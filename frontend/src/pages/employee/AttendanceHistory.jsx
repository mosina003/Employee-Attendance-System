import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/layout/Navbar';
import Loading from '../../components/common/Loading';
import attendanceService from '../../services/attendanceService';
import { 
  FaCalendarAlt, 
  FaChevronLeft, 
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaHourglassHalf,
  FaClock,
  FaTimes
} from 'react-icons/fa';

function AttendanceHistory() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchAttendanceData();
  }, [currentDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const params = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
      
      const data = await attendanceService.getMyHistory(params);
      setAttendanceData(data || []);
    } catch (error) {
      toast.error('Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getAttendanceForDate = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    
    return attendanceData.find(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === dateStr;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
    setSelectedRecord(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedRecord(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
    setSelectedRecord(null);
  };

  const handleDateClick = (day, record) => {
    if (record) {
      setSelectedDate(day);
      setSelectedRecord(record);
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
    setSelectedRecord(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'late':
        return 'bg-yellow-500';
      case 'half-day':
        return 'bg-orange-500';
      case 'absent':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <FaCheckCircle className="text-white" />;
      case 'late':
        return <FaExclamationCircle className="text-white" />;
      case 'half-day':
        return <FaHourglassHalf className="text-white" />;
      case 'absent':
        return <FaTimesCircle className="text-white" />;
      default:
        return null;
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isWeekend = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-gray-50 min-h-[100px] p-2 border border-gray-200"></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const record = getAttendanceForDate(day);
      const hasAttendance = record !== undefined;
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day, record)}
          className={`min-h-[100px] p-2 border border-gray-200 transition ${
            isToday(day) ? 'ring-2 ring-blue-500 bg-blue-50' : 
            isWeekend(day) ? 'bg-gray-50' : 'bg-white'
          } ${hasAttendance ? 'cursor-pointer hover:shadow-lg' : ''}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-semibold ${
              isToday(day) ? 'text-blue-600' : 
              isWeekend(day) ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {day}
            </span>
          </div>
          
          {hasAttendance ? (
            <div className="flex flex-col items-center justify-center mt-2">
              <div className={`w-12 h-12 rounded-full ${getStatusColor(record.status)} flex items-center justify-center mb-2`}>
                {getStatusIcon(record.status)}
              </div>
              <span className="text-xs font-semibold text-gray-700 capitalize">
                {record.status}
              </span>
              {record.totalHours && (
                <span className="text-xs text-gray-500 mt-1">
                  {record.totalHours.toFixed(1)}h
                </span>
              )}
            </div>
          ) : isWeekend(day) ? (
            <div className="text-center mt-4">
              <span className="text-xs text-gray-400">Weekend</span>
            </div>
          ) : (
            <div className="text-center mt-4">
              <span className="text-xs text-gray-400">No record</span>
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  // Calculate monthly stats
  const monthStats = {
    present: attendanceData.filter(r => r.status === 'present').length,
    late: attendanceData.filter(r => r.status === 'late').length,
    halfDay: attendanceData.filter(r => r.status === 'half-day').length,
    absent: attendanceData.filter(r => r.status === 'absent').length,
    totalHours: attendanceData.reduce((sum, r) => sum + (r.totalHours || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaCalendarAlt className="mr-3 text-blue-600" />
            My Attendance History
          </h1>
          <p className="mt-2 text-gray-600">View your attendance calendar and history</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={previousMonth}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <FaChevronLeft className="text-xl" />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-800 min-w-[200px] text-center">
                {monthYear}
              </h2>
              
              <button
                onClick={nextMonth}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <FaChevronRight className="text-xl" />
              </button>
              
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Today
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-gray-600">Late</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-gray-600">Half Day</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-gray-600">Absent</span>
            </div>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Present</p>
            <p className="text-2xl font-bold text-green-700">{monthStats.present}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-600 font-medium">Late</p>
            <p className="text-2xl font-bold text-yellow-700">{monthStats.late}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-600 font-medium">Half Day</p>
            <p className="text-2xl font-bold text-orange-700">{monthStats.halfDay}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600 font-medium">Absent</p>
            <p className="text-2xl font-bold text-red-700">{monthStats.absent}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total Hours</p>
            <p className="text-2xl font-bold text-blue-700">{monthStats.totalHours.toFixed(1)}h</p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <Loading text="Loading your attendance history..." />
          ) : (
            <>
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gray-100">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="p-3 text-center font-semibold text-gray-700 border-b border-gray-200"
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {renderCalendarDays()}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">Attendance Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Date */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedRecord.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full ${getStatusColor(selectedRecord.status)} flex items-center justify-center`}>
                  {getStatusIcon(selectedRecord.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-gray-800 capitalize">{selectedRecord.status}</p>
                </div>
              </div>

              {/* Check In */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaClock className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Check In</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedRecord.checkInTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Check Out */}
              {selectedRecord.checkOutTime && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaClock className="text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Check Out</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedRecord.checkOutTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Total Hours */}
              {selectedRecord.totalHours && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <FaHourglassHalf className="text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Total Hours Worked</p>
                    <p className="font-semibold text-blue-800 text-lg">
                      {selectedRecord.totalHours.toFixed(2)} hours
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={closeModal}
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceHistory;
