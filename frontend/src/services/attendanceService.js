import axios from 'axios';

const API_URL = '/api/attendance/';

// Get authorization header
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

// Check in
const checkIn = async () => {
  const response = await axios.post(API_URL + 'checkin', {}, getAuthHeader());
  return response.data.data || response.data;
};

// Check out
const checkOut = async () => {
  const response = await axios.post(API_URL + 'checkout', {}, getAuthHeader());
  return response.data.data || response.data;
};

// Get my attendance history
const getMyHistory = async (params) => {
  const response = await axios.get(API_URL + 'my-history', {
    ...getAuthHeader(),
    params,
  });
  return response.data.data || response.data;
};

// Get my summary
const getMySummary = async (params) => {
  const response = await axios.get(API_URL + 'my-summary', {
    ...getAuthHeader(),
    params,
  });
  return response.data.data || response.data;
};

// Get today's status
const getTodayStatus = async () => {
  const response = await axios.get(API_URL + 'today', getAuthHeader());
  return response.data.data || response.data;
};

// Get all attendance (Manager)
const getAllAttendance = async (params) => {
  const response = await axios.get(API_URL + 'all', {
    ...getAuthHeader(),
    params,
  });
  return response.data.data || response.data;
};

// Get team summary (Manager)
const getTeamSummary = async (params) => {
  const response = await axios.get(API_URL + 'summary', {
    ...getAuthHeader(),
    params,
  });
  return response.data.data || response.data;
};

// Get today team status (Manager)
const getTodayTeamStatus = async () => {
  const response = await axios.get(API_URL + 'today-status', getAuthHeader());
  return response.data.data || response.data;
};

// Get employee attendance by ID (Manager)
const getEmployeeAttendance = async (employeeId, params) => {
  const response = await axios.get(API_URL + `employee/${employeeId}`, {
    ...getAuthHeader(),
    params,
  });
  return response.data.data || response.data;
};

// Export attendance to CSV (Manager)
const exportAttendance = async (params) => {
  const response = await axios.get(API_URL + 'export', {
    ...getAuthHeader(),
    params,
    responseType: 'blob',
  });
  return response.data;
};

// Get all users for dropdown (Manager)
const getAllUsers = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await axios.get('/api/auth/users', {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });
  return response.data.data || response.data;
};

// Get calendar view data (Manager)
const getCalendarData = async (params) => {
  const response = await axios.get(API_URL + 'all', {
    ...getAuthHeader(),
    params,
  });
  return response.data.data || response.data;
};

const attendanceService = {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getTodayStatus,
  getAllAttendance,
  getTeamSummary,
  getTodayTeamStatus,
  getEmployeeAttendance,
  exportAttendance,
  getAllUsers,
  getCalendarData,
};

export default attendanceService;
