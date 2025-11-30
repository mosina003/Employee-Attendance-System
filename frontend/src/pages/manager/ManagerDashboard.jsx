import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import TrendCard from '../../components/dashboard/TrendCard';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import CircularProgress from '../../components/dashboard/CircularProgress';
import dashboardService from '../../services/dashboardService';
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChartLine,
} from 'react-icons/fa';

function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getManagerDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  const { overview, absentEmployees, weeklyTrend, departmentStats } = dashboardData || {};

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
            Manager Dashboard 📊
          </h1>
          <p className="text-gray-600 mt-1">Team attendance overview</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TrendCard
            title="Total Employees"
            value={overview?.totalEmployees || 0}
            trend="up"
            trendValue="+2"
            icon={FaUsers}
            color="indigo"
            subtitle="Active members"
          />
          <TrendCard
            title="Present Today"
            value={overview?.presentToday || 0}
            trend="up"
            trendValue={`${overview?.totalEmployees > 0 ? Math.round((overview.presentToday / overview.totalEmployees) * 100) : 0}%`}
            icon={FaCheckCircle}
            color="green"
            subtitle="Attendance rate"
          />
          <TrendCard
            title="Absent Today"
            value={overview?.absentToday || 0}
            trend={overview?.absentToday > 2 ? "up" : "down"}
            trendValue={`${overview?.absentToday || 0} emp`}
            icon={FaTimesCircle}
            color="red"
            subtitle="Need attention"
          />
          <TrendCard
            title="Late Today"
            value={overview?.lateToday || 0}
            trend="down"
            trendValue="-3"
            icon={FaClock}
            color="yellow"
            subtitle="Improved"
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <AttendanceChart
              data={weeklyTrend?.map(day => ({
                date: new Date(day._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                present: day.count,
                absent: overview.totalEmployees - day.count
              })) || []}
              title="Weekly Attendance Trend"
            />
          </div>
          
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Today's Attendance</h3>
            <div className="flex justify-center">
              <CircularProgress
                value={overview?.presentToday || 0}
                maxValue={overview?.totalEmployees || 1}
                label={`${overview?.presentToday || 0} / ${overview?.totalEmployees || 0}`}
                color="#10b981"
                size={150}
              />
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Present</span>
                <span className="font-semibold text-green-600">{overview?.presentToday || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Absent</span>
                <span className="font-semibold text-red-600">{overview?.absentToday || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Late</span>
                <span className="font-semibold text-yellow-600">{overview?.lateToday || 0}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Absent Employees Today */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaTimesCircle className="text-red-500 mr-2" />
              Absent Employees Today
            </h2>
            <div className="space-y-3">
              {absentEmployees && absentEmployees.length > 0 ? (
                absentEmployees.map((emp) => (
                  <div
                    key={emp._id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{emp.name}</p>
                      <p className="text-sm text-gray-600">
                        {emp.employeeId} • {emp.department}
                      </p>
                    </div>
                    <span className="text-red-600 font-semibold">Absent</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  🎉 All employees are present today!
                </div>
              )}
            </div>
          </div>

          {/* Weekly Attendance Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaChartLine className="text-blue-500 mr-2" />
              Weekly Attendance Trend
            </h2>
            <div className="space-y-3">
              {weeklyTrend && weeklyTrend.length > 0 ? (
                weeklyTrend.map((day) => {
                  const percentage = ((day.count / overview.totalEmployees) * 100).toFixed(0);
                  return (
                    <div key={day._id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{formatDate(day._id)}</span>
                        <span className="font-semibold text-gray-800">
                          {day.count} / {overview.totalEmployees} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Department-wise Attendance */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Department-wise Attendance (This Month)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Present
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Late
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentStats && departmentStats.length > 0 ? (
                  departmentStats.map((dept) => {
                    const rate = ((dept.present / dept.totalAttendance) * 100).toFixed(1);
                    return (
                      <tr key={dept._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{dept._id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {dept.totalAttendance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                          {dept.present}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">
                          {dept.late}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 mr-4">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${rate}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No department data available
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

export default ManagerDashboard;
