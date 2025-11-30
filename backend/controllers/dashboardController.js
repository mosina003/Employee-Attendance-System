const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { asyncHandler } = require('../utils/errorHandler');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// @desc    Get employee dashboard stats
// @route   GET /api/dashboard/employee
// @access  Private (Employee)
exports.getEmployeeDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get today's attendance
  const todayAttendance = await Attendance.findOne({
    userId,
    date: today
  });

  // Get current month stats
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const monthAttendance = await Attendance.find({
    userId,
    date: { $gte: startOfMonth, $lte: endOfMonth }
  });

  // Calculate monthly stats
  const monthStats = {
    present: monthAttendance.filter(a => a.status === 'present').length,
    late: monthAttendance.filter(a => a.status === 'late').length,
    halfDay: monthAttendance.filter(a => a.status === 'half-day').length,
    totalHours: monthAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0),
    absent: getWorkingDays(startOfMonth, endOfMonth) - monthAttendance.length
  };

  // Get last 7 days attendance
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const recentAttendance = await Attendance.find({
    userId,
    date: { $gte: sevenDaysAgo, $lte: today }
  }).sort({ date: -1 });

  sendSuccess(res, {
    todayStatus: {
      checkedIn: !!todayAttendance,
      checkedOut: todayAttendance ? !!todayAttendance.checkOutTime : false,
      checkInTime: todayAttendance?.checkInTime || null,
      checkOutTime: todayAttendance?.checkOutTime || null,
      status: todayAttendance?.status || null
    },
    monthStats,
    recentAttendance
  }, 200, 'Employee dashboard retrieved successfully');
});

// @desc    Get manager dashboard stats
// @route   GET /api/dashboard/manager
// @access  Private (Manager)
exports.getManagerDashboard = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all employees
  const totalEmployees = await User.countDocuments({ role: 'employee' });

  // Get today's attendance
  const todayAttendance = await Attendance.find({ date: today })
    .populate('userId', 'name employeeId department');

  const presentToday = todayAttendance.length;
  const absentToday = totalEmployees - presentToday;
  const lateToday = todayAttendance.filter(a => a.status === 'late').length;

  // Get absent employees today
  const presentIds = todayAttendance.map(a => a.userId._id.toString());
  const absentEmployees = await User.find({
    role: 'employee',
    _id: { $nin: presentIds }
  }).select('name employeeId department');

  // Get last 7 days stats for chart
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const weeklyAttendance = await Attendance.aggregate([
    {
      $match: {
        date: { $gte: sevenDaysAgo, $lte: today }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Get department-wise attendance for current month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const departmentStats = await Attendance.aggregate([
    {
      $match: {
        date: { $gte: startOfMonth, $lte: endOfMonth }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $group: {
        _id: '$user.department',
        totalAttendance: { $sum: 1 },
        present: {
          $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
        },
        late: {
          $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
        }
      }
    }
  ]);

  sendSuccess(res, {
    overview: {
      totalEmployees,
      presentToday,
      absentToday,
      lateToday
    },
    absentEmployees,
    weeklyTrend: weeklyAttendance,
    departmentStats
  }, 200, 'Manager dashboard retrieved successfully');
});

// Helper function to calculate working days
const getWorkingDays = (startDate, endDate) => {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};
