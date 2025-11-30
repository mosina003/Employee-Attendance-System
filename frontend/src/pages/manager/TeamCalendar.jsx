import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/layout/Navbar';
import Loading from '../../components/common/Loading';
import { getStatusIcon } from '../../utils/statusUtils';
import attendanceService from '../../services/attendanceService';
import { 
  FaCalendarAlt, 
  FaChevronLeft, 
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaHourglassHalf,
  FaUsers
} from 'react-icons/fa';

function TeamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate, selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const data = await attendanceService.getAllUsers();
      setEmployees(data || []);
    } catch (error) {
      // Error silently handled - employees list will remain empty
    }
  };

  const fetchCalendarData = async () => {
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
      
      const data = await attendanceService.getCalendarData(params);
      setAttendanceData(data || []);
    } catch (error) {
      toast.error('Failed to fetch calendar data');
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
    
    let dayAttendance = attendanceData.filter(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === dateStr;
    });
    
    // Filter by employee if selected
    if (selectedEmployee) {
      dayAttendance = dayAttendance.filter(record => 
        record.userId?._id === selectedEmployee
      );
    }
    
    return dayAttendance;
  };

  const getStatusCount = (attendance, status) => {
    return attendance.filter(a => a.status === status).length;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
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
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-gray-50 min-h-[120px] p-2 border border-gray-200"></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAttendance = getAttendanceForDate(day);
      const present = getStatusCount(dayAttendance, 'present');
      const absent = getStatusCount(dayAttendance, 'absent');
      const late = getStatusCount(dayAttendance, 'late');
      const halfDay = getStatusCount(dayAttendance, 'half-day');
      
      days.push(
        <div
          key={day}
          className={`min-h-[120px] p-2 border border-gray-200 ${
            isToday(day) ? 'bg-blue-50 ring-2 ring-blue-500' : 
            isWeekend(day) ? 'bg-gray-50' : 'bg-white'
          } hover:shadow-md transition`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-semibold ${
              isToday(day) ? 'text-blue-600' : 
              isWeekend(day) ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {day}
            </span>
            {dayAttendance.length > 0 && (
              <span className="text-xs text-gray-500">
                {dayAttendance.length}
              </span>
            )}
          </div>
          
          {!isWeekend(day) && dayAttendance.length > 0 && (
            <div className="space-y-1">
              {present > 0 && (
                <div className="flex items-center space-x-1">
                  {getStatusIcon('present', 'w-5 h-5')}
                  <span className="text-xs text-gray-600">{present}</span>
                </div>
              )}
              {late > 0 && (
                <div className="flex items-center space-x-1">
                  {getStatusIcon('late', 'w-5 h-5')}
                  <span className="text-xs text-gray-600">{late}</span>
                </div>
              )}
              {halfDay > 0 && (
                <div className="flex items-center space-x-1">
                  {getStatusIcon('half-day', 'w-5 h-5')}
                  <span className="text-xs text-gray-600">{halfDay}</span>
                </div>
              )}
              {absent > 0 && (
                <div className="flex items-center space-x-1">
                  {getStatusIcon('absent', 'w-5 h-5')}
                  <span className="text-xs text-gray-600">{absent}</span>
                </div>
              )}
            </div>
          )}
          
          {isWeekend(day) && (
            <div className="text-xs text-gray-400 italic">Weekend</div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaCalendarAlt className="mr-3 text-indigo-600" />
            Team Calendar View
          </h1>
          <p className="mt-2 text-gray-600">Visual overview of team attendance</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Month Navigation */}
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Today
              </button>
            </div>

            {/* Employee Filter */}
            <div className="flex items-center space-x-3">
              <FaUsers className="text-gray-600" />
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              {getStatusIcon('present', 'w-5 h-5')}
              <span className="text-gray-600">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon('late', 'w-5 h-5')}
              <span className="text-gray-600">Late</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon('half-day', 'w-5 h-5')}
              <span className="text-gray-600">Half Day</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon('absent', 'w-5 h-5')}
              <span className="text-gray-600">Absent</span>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <Loading text="Loading calendar data..." />
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

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Present</p>
                <p className="text-2xl font-bold text-green-700">
                  {getStatusCount(attendanceData, 'present')}
                </p>
              </div>
              <FaCheckCircle className="text-3xl text-green-500" />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Late</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {getStatusCount(attendanceData, 'late')}
                </p>
              </div>
              <FaExclamationCircle className="text-3xl text-yellow-500" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Half Day</p>
                <p className="text-2xl font-bold text-orange-700">
                  {getStatusCount(attendanceData, 'half-day')}
                </p>
              </div>
              <FaHourglassHalf className="text-3xl text-orange-500" />
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Absent</p>
                <p className="text-2xl font-bold text-red-700">
                  {getStatusCount(attendanceData, 'absent')}
                </p>
              </div>
              <FaTimesCircle className="text-3xl text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamCalendar;
