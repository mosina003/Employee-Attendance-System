import axios from 'axios';

const API_URL = '/api/dashboard/';

// Get authorization header
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

// Get employee dashboard
const getEmployeeDashboard = async () => {
  const response = await axios.get(API_URL + 'employee', getAuthHeader());
  return response.data;
};

// Get manager dashboard
const getManagerDashboard = async () => {
  const response = await axios.get(API_URL + 'manager', getAuthHeader());
  return response.data;
};

const dashboardService = {
  getEmployeeDashboard,
  getManagerDashboard,
};

export default dashboardService;
