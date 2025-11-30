const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { Parser } = require('json2csv');

// @desc    Check in (Employee)
// @route   POST /api/attendance/checkin
// @access  Private (Employee)
exports.checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      userId: req.user._id,
      date: today,
      checkInTime: new Date()
    });

    res.status(201).json({
      message: 'Checked in successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check out (Employee)
// @route   POST /api/attendance/checkout
// @access  Private (Employee)
exports.checkOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance
    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No check-in record found for today' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    // Update check out time
    attendance.checkOutTime = new Date();
    await attendance.save();

    res.json({
      message: 'Checked out successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-history
// @access  Private (Employee)
exports.getMyHistory = async (req, res) => {
  try {
    const { startDate, endDate, month, year } = req.query;
    
    let query = { userId: req.user._id };

    // Filter by date range
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.date = {
        $gte: start,
        $lte: end
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('userId', 'name employeeId');

    res.json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my monthly summary
// @route   GET /api/attendance/my-summary
// @access  Private (Employee)
exports.getMySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const start = new Date(currentYear, currentMonth - 1, 1);
    const end = new Date(currentYear, currentMonth, 0);

    const attendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });

    // Calculate summary
    const summary = {
      totalDays: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: 0, // Calculated based on working days
      late: attendance.filter(a => a.status === 'late').length,
      halfDay: attendance.filter(a => a.status === 'half-day').length,
      totalHours: attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0)
    };

    // Calculate working days (excluding weekends)
    const workingDays = getWorkingDays(start, end);
    summary.absent = workingDays - attendance.length;

    res.json({
      success: true,
      month: currentMonth,
      year: currentYear,
      summary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's attendance status
// @route   GET /api/attendance/today
// @access  Private (Employee)
exports.getTodayStatus = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    res.json({
      success: true,
      data: attendance || null,
      checkedIn: !!attendance,
      checkedOut: attendance ? !!attendance.checkOutTime : false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all employees attendance (Manager)
// @route   GET /api/attendance/all
// @access  Private (Manager)
exports.getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, status, department } = req.query;
    
    let query = {};

    // Filter by date range
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name employeeId department')
      .sort({ date: -1 });

    // Filter by department if specified
    let filteredAttendance = attendance;
    if (department) {
      filteredAttendance = attendance.filter(
        a => a.userId && a.userId.department === department
      );
    }

    res.json({
      success: true,
      count: filteredAttendance.length,
      data: filteredAttendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific employee attendance (Manager)
// @route   GET /api/attendance/employee/:id
// @access  Private (Manager)
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { userId: req.params.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name employeeId department')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get team summary (Manager)
// @route   GET /api/attendance/summary
// @access  Private (Manager)
exports.getTeamSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const start = new Date(currentYear, currentMonth - 1, 1);
    const end = new Date(currentYear, currentMonth, 0);

    const attendance = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).populate('userId', 'name employeeId department');

    // Get all employees
    const allEmployees = await User.find({ role: 'employee' });

    // Calculate summary per employee
    const employeeSummary = allEmployees.map(emp => {
      const empAttendance = attendance.filter(
        a => a.userId && a.userId._id.toString() === emp._id.toString()
      );

      const workingDays = getWorkingDays(start, end);

      return {
        employee: {
          _id: emp._id,
          name: emp.name,
          employeeId: emp.employeeId,
          department: emp.department
        },
        totalDays: empAttendance.length,
        present: empAttendance.filter(a => a.status === 'present').length,
        late: empAttendance.filter(a => a.status === 'late').length,
        halfDay: empAttendance.filter(a => a.status === 'half-day').length,
        absent: workingDays - empAttendance.length,
        totalHours: empAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0)
      };
    });

    res.json({
      success: true,
      month: currentMonth,
      year: currentYear,
      data: employeeSummary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export attendance to CSV (Manager)
// @route   GET /api/attendance/export
// @access  Private (Manager)
exports.exportAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name employeeId department')
      .sort({ date: -1 });

    // Format data for CSV
    const csvData = attendance.map(a => ({
      Date: new Date(a.date).toLocaleDateString(),
      EmployeeID: a.userId?.employeeId || 'N/A',
      EmployeeName: a.userId?.name || 'N/A',
      Department: a.userId?.department || 'N/A',
      CheckIn: new Date(a.checkInTime).toLocaleTimeString(),
      CheckOut: a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString() : 'Not Checked Out',
      TotalHours: a.totalHours || 0,
      Status: a.status
    }));

    // Convert to CSV
    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance_report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's status for all employees (Manager)
// @route   GET /api/attendance/today-status
// @access  Private (Manager)
exports.getTodayTeamStatus = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({ date: today })
      .populate('userId', 'name employeeId department');

    const allEmployees = await User.find({ role: 'employee' });

    // Get present employees
    const presentEmployees = attendance.map(a => ({
      _id: a.userId._id,
      name: a.userId.name,
      employeeId: a.userId.employeeId,
      department: a.userId.department,
      checkInTime: a.checkInTime,
      checkOutTime: a.checkOutTime,
      status: a.status
    }));

    // Get absent employees
    const presentIds = attendance.map(a => a.userId._id.toString());
    const absentEmployees = allEmployees
      .filter(emp => !presentIds.includes(emp._id.toString()))
      .map(emp => ({
        _id: emp._id,
        name: emp.name,
        employeeId: emp.employeeId,
        department: emp.department,
        status: 'absent'
      }));

    res.json({
      success: true,
      date: today,
      totalEmployees: allEmployees.length,
      present: presentEmployees.length,
      absent: absentEmployees.length,
      presentEmployees,
      absentEmployees
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate working days (excluding weekends)
const getWorkingDays = (startDate, endDate) => {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};
