import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Loading from '../../components/common/Loading';
import TrendCard from '../../components/dashboard/TrendCard';
import CircularProgress from '../../components/dashboard/CircularProgress';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import AttendancePieChart from '../../components/dashboard/AttendancePieChart';
import dashboardService from '../../services/dashboardService';
import attendanceService from '../../services/attendanceService';
import {
  FaCalendarCheck,
  FaCalendarTimes,
  FaClock,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';

function EmployeeDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getEmployeeDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      await attendanceService.checkIn();
      toast.success('Checked in successfully!');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check in');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setCheckingOut(true);
      await attendanceService.checkOut();
      toast.success('Checked out successfully!');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check out');
    } finally {
      setCheckingOut(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'text-green-600 bg-green-100';
      case 'late':
        return 'text-yellow-600 bg-yellow-100';
      case 'half-day':
        return 'text-orange-600 bg-orange-100';
      case 'absent':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Loading fullScreen text="Loading your dashboard..." />
      </div>
    );
  }

  const { todayStatus, monthStats, recentAttendance } = dashboardData || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Employee ID: {user?.employeeId}</p>
        </motion.div>

        {/* Check In/Out Section */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Today's Attendance
              </h2>
              {todayStatus?.checkedIn ? (
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Check In: <span className="font-semibold">{formatTime(todayStatus.checkInTime)}</span>
                  </p>
                  {todayStatus.checkedOut && (
                    <p className="text-sm text-gray-600">
                      Check Out: <span className="font-semibold">{formatTime(todayStatus.checkOutTime)}</span>
                    </p>
                  )}
                  <p className="text-sm">
                    Status:{' '}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(todayStatus.status)}`}>
                      {todayStatus.status}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">You haven't checked in today</p>
              )}
            </div>

            <div className="flex space-x-3">
              {!todayStatus?.checkedIn ? (
                <motion.button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaCheckCircle />
                  <span>{checkingIn ? 'Checking In...' : 'Check In'}</span>
                </motion.button>
              ) : !todayStatus?.checkedOut ? (
                <motion.button
                  onClick={handleCheckOut}
                  disabled={checkingOut}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimesCircle />
                  <span>{checkingOut ? 'Checking Out...' : 'Check Out'}</span>
                </motion.button>
              ) : (
                <div className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-semibold">
                  ✅ Completed for today
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid with Trends */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <TrendCard
            title="Present Days"
            value={monthStats?.present || 0}
            trend="up"
            trendValue="+12%"
            icon={FaCalendarCheck}
            color="green"
            subtitle="This month"
          />
          <TrendCard
            title="Absent Days"
            value={monthStats?.absent || 0}
            trend="down"
            trendValue="-5%"
            icon={FaCalendarTimes}
            color="red"
            subtitle="This month"
          />
          <TrendCard
            title="Late Arrivals"
            value={monthStats?.late || 0}
            trend="down"
            trendValue="-8%"
            icon={FaClock}
            color="yellow"
            subtitle="This month"
          />
          <TrendCard
            title="Total Hours"
            value={monthStats?.totalHours?.toFixed(1) || 0}
            trend="up"
            trendValue="+15%"
            icon={FaHourglassHalf}
            color="blue"
            subtitle="This month"
          />
        </motion.div>

        {/* Circular Progress and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Monthly Attendance Rate</h3>
            <div className="flex justify-center">
              <CircularProgress
                value={monthStats?.present || 0}
                maxValue={(monthStats?.present || 0) + (monthStats?.absent || 0)}
                label={`${monthStats?.present || 0} / ${(monthStats?.present || 0) + (monthStats?.absent || 0)} days`}
                color="#10b981"
                size={150}
              />
            </div>
          </motion.div>

          <div className="lg:col-span-2">
            <ActivityTimeline 
              activities={recentAttendance?.slice(0, 5).map(record => ({
                type: record.status === 'present' ? 'check-in' : record.status,
                title: record.status === 'present' ? 'Checked In' : record.status.charAt(0).toUpperCase() + record.status.slice(1),
                description: `Check-in: ${formatTime(record.checkInTime)}${record.checkOutTime ? ` | Check-out: ${formatTime(record.checkOutTime)}` : ''}`,
                time: formatDate(record.date)
              })) || []}
            />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="mb-8">
          <AttendancePieChart 
            data={{
              present: monthStats?.present || 0,
              late: monthStats?.late || 0,
              halfDay: 0,
              absent: monthStats?.absent || 0
            }}
            title="Monthly Attendance Distribution"
          />
        </div>

        {/* Recent Attendance */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Attendance (Last 7 Days)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAttendance && recentAttendance.length > 0 ? (
                  recentAttendance.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(record.checkInTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(record.checkOutTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.totalHours?.toFixed(2) || 0}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full uppercase ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
