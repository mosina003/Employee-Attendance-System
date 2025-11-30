import axios from 'axios';

const API_URL = '/api/auth/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  // Extract data from the new response format
  const data = response.data.data || response.data;
  
  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  return data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  // Extract data from the new response format
  const data = response.data.data || response.data;
  
  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  return data;
};

// Update profile
const updateProfile = async (userData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const response = await axios.put(API_URL + 'profile', userData, config);

  // Extract data from the new response format
  const data = response.data.data || response.data;
  
  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  return data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  updateProfile,
  logout,
};

export default authService;
