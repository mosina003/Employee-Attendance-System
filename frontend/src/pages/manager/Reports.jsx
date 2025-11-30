import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/layout/Navbar';
import Loading from '../../components/common/Loading';
import { DEPARTMENTS } from '../../utils/constants';
import attendanceService from '../../services/attendanceService';
import dashboardService from '../../services/dashboardService';
import { 
  FaChartBar, 
  FaDownload, 
  FaCalendar,
  FaUsers,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaBuilding,
  FaClock
} from 'react-icons/fa';

function Reports() {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [employees, setEmployees] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await attendanceService.getAllUsers();
      setEmployees(data || []);
    } catch (error) {
      // Error silently handled - employees list will remain empty
    }
  };

  const generateReport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error('Please select date range');
      return;
    }

    try {
      setLoading(true);
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      };

      if (selectedDepartment) params.department = selectedDepartment;

      let data;
      
      if (reportType === 'summary') {
        data = await attendanceService.getAllAttendance(params);
        processSummaryReport(data);
      } else if (reportType === 'employee' && selectedEmployee) {
        data = await attendanceService.getEmployeeAttendance(selectedEmployee, params);
        processEmployeeReport(data);
      } else if (reportType === 'department') {
        data = await attendanceService.getAllAttendance(params);
        processDepartmentReport(data);
      } else if (reportType === 'late') {
        params.status = 'late';
        data = await attendanceService.getAllAttendance(params);
        processLateReport(data);
      }
      
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const processSummaryReport = (data) => {
    const summary = {
      totalRecords: data.length,
      present: data.filter(r => r.status === 'present').length,
      late: data.filter(r => r.status === 'late').length,
      halfDay: data.filter(r => r.status === 'half-day').length,
      absent: data.filter(r => r.status === 'absent').length,
      totalHours: data.reduce((sum, r) => sum + (r.totalHours || 0), 0),
      avgHours: (data.reduce((sum, r) => sum + (r.totalHours || 0), 0) / data.length).toFixed(2)
    };
    setReportData({ type: 'summary', data: summary });
  };

  const processEmployeeReport = (data) => {
    const employee = employees.find(e => e._id === selectedEmployee);
    const summary = {
      employeeName: employee?.name || 'Unknown',
      employeeId: employee?.employeeId || 'N/A',
      department: employee?.department || 'N/A',
      totalDays: data.length,
      present: data.filter(r => r.status === 'present').length,
      late: data.filter(r => r.status === 'late').length,
      halfDay: data.filter(r => r.status === 'half-day').length,
      totalHours: data.reduce((sum, r) => sum + (r.totalHours || 0), 0).toFixed(2),
      avgHours: (data.reduce((sum, r) => sum + (r.totalHours || 0), 0) / data.length).toFixed(2),
      records: data
    };
    setReportData({ type: 'employee', data: summary });
  };

  const processDepartmentReport = (data) => {
    const deptMap = {};
    
    data.forEach(record => {
      const dept = record.userId?.department || 'Unknown';
      if (!deptMap[dept]) {
        deptMap[dept] = {
          department: dept,
          totalRecords: 0,
          present: 0,
          late: 0,
          halfDay: 0,
          totalHours: 0
        };
      }
      
      deptMap[dept].totalRecords++;
      if (record.status === 'present') deptMap[dept].present++;
      if (record.status === 'late') deptMap[dept].late++;
      if (record.status === 'half-day') deptMap[dept].halfDay++;
      deptMap[dept].totalHours += record.totalHours || 0;
    });
    
    const departments = Object.values(deptMap).map(dept => ({
      ...dept,
      avgHours: (dept.totalHours / dept.totalRecords).toFixed(2),
      totalHours: dept.totalHours.toFixed(2)
    }));
    
    setReportData({ type: 'department', data: departments });
  };

  const processLateReport = (data) => {
    const lateRecords = data.map(record => ({
      date: new Date(record.date).toLocaleDateString(),
      employeeName: record.userId?.name || 'Unknown',
      employeeId: record.userId?.employeeId || 'N/A',
      department: record.userId?.department || 'N/A',
      checkInTime: new Date(record.checkInTime).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }));
    
    setReportData({ type: 'late', data: lateRecords });
  };

  const handleExport = async () => {
    try {
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      };
      
      if (selectedDepartment) params.department = selectedDepartment;
      
      const blob = await attendanceService.exportAttendance(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const renderSummaryReport = () => {
    if (!reportData || reportData.type !== 'summary') return null;
    const { data } = reportData;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Present</p>
                <p className="text-3xl font-bold text-green-700">{data.present}</p>
                <p className="text-xs text-green-600 mt-1">
                  {((data.present / data.totalRecords) * 100).toFixed(1)}%
                </p>
              </div>
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Late</p>
                <p className="text-3xl font-bold text-yellow-700">{data.late}</p>
                <p className="text-xs text-yellow-600 mt-1">
                  {((data.late / data.totalRecords) * 100).toFixed(1)}%
                </p>
              </div>
              <FaExclamationCircle className="text-4xl text-yellow-500" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Half Day</p>
                <p className="text-3xl font-bold text-orange-700">{data.halfDay}</p>
                <p className="text-xs text-orange-600 mt-1">
                  {((data.halfDay / data.totalRecords) * 100).toFixed(1)}%
                </p>
              </div>
              <FaHourglassHalf className="text-4xl text-orange-500" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Hours</p>
                <p className="text-3xl font-bold text-blue-700">{data.totalHours.toFixed(0)}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Avg: {data.avgHours}h/day
                </p>
              </div>
              <FaClock className="text-4xl text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-indigo-500 pl-4">
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-800">{data.totalRecords}</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {((data.present / data.totalRecords) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-sm text-gray-600">Average Hours</p>
              <p className="text-2xl font-bold text-gray-800">{data.avgHours}h</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmployeeReport = () => {
    if (!reportData || reportData.type !== 'employee') return null;
    const { data } = reportData;
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <FaUsers className="text-3xl text-indigo-600 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">{data.employeeName}</h3>
              <p className="text-sm text-gray-600">{data.employeeId} • {data.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Total Days</p>
              <p className="text-2xl font-bold text-blue-700">{data.totalDays}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Present</p>
              <p className="text-2xl font-bold text-green-700">{data.present}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-600">Late</p>
              <p className="text-2xl font-bold text-yellow-700">{data.late}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600">Total Hours</p>
              <p className="text-2xl font-bold text-purple-700">{data.totalHours}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Attendance Records</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.records.slice(0, 10).map((record, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.totalHours?.toFixed(2)}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                        record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                        record.status === 'half-day' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderDepartmentReport = () => {
    if (!reportData || reportData.type !== 'department') return null;
    const { data } = reportData;
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaBuilding className="mr-2 text-indigo-600" />
            Department-wise Analysis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Records</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Half Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Hours</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{dept.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.totalRecords}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{dept.present}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">{dept.late}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-semibold">{dept.halfDay}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.totalHours}h</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-semibold">{dept.avgHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderLateReport = () => {
    if (!reportData || reportData.type !== 'late') return null;
    const { data } = reportData;
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaExclamationCircle className="mr-2 text-yellow-600" />
            Late Arrivals Report ({data.length} records)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.employeeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.employeeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">{record.checkInTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaChartBar className="mr-3 text-indigo-600" />
            Attendance Reports
          </h1>
          <p className="mt-2 text-gray-600">Generate and analyze attendance reports</p>
        </div>

        {/* Report Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="summary">Overall Summary</option>
                <option value="employee">Individual Employee</option>
                <option value="department">Department Analysis</option>
                <option value="late">Late Arrivals</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline mr-1" /> Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline mr-1" /> End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Employee Filter (for employee report) */}
            {reportType === 'employee' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Choose Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department (Optional)</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={generateReport}
              disabled={loading || (reportType === 'employee' && !selectedEmployee)}
              className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FaChartBar />
              <span>{loading ? 'Generating...' : 'Generate Report'}</span>
            </button>
            
            {reportData && (
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <FaDownload />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Report Display */}
        {loading ? (
          <Loading text="Generating report..." />
        ) : reportData ? (
          <div>
            {reportData.type === 'summary' && renderSummaryReport()}
            {reportData.type === 'employee' && renderEmployeeReport()}
            {reportData.type === 'department' && renderDepartmentReport()}
            {reportData.type === 'late' && renderLateReport()}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaChartBar className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Configure options and click "Generate Report" to view data</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
