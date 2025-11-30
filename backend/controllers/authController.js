const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { asyncHandler } = require('../utils/errorHandler');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, employeeId, department } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return sendError(res, 'User already exists', 400);
  }

  // Check if employeeId exists
  const employeeIdExists = await User.findOne({ employeeId });

  if (employeeIdExists) {
    return sendError(res, 'Employee ID already exists', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'employee',
    employeeId,
    department
  });

  if (!user) {
    return sendError(res, 'Invalid user data', 400);
  }

  sendSuccess(res, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    employeeId: user.employeeId,
    department: user.department,
    token: generateToken(user._id)
  }, 201, 'User registered successfully');
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return sendError(res, 'Invalid email or password', 401);
  }

  sendSuccess(res, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    employeeId: user.employeeId,
    department: user.department,
    token: generateToken(user._id)
  }, 200, 'Login successful');
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  sendSuccess(res, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    employeeId: user.employeeId,
    department: user.department
  }, 200, 'User retrieved successfully');
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  // Check if email is being changed and if it already exists
  if (req.body.email && req.body.email !== user.email) {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return sendError(res, 'Email already in use', 400);
    }
  }

  // Update fields
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.department = req.body.department || user.department;

  const updatedUser = await user.save();

  sendSuccess(res, {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    employeeId: updatedUser.employeeId,
    department: updatedUser.department,
    token: generateToken(updatedUser._id)
  }, 200, 'Profile updated successfully');
});

// @desc    Get all users (Manager)
// @route   GET /api/auth/users
// @access  Private (Manager)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'employee' }).select('-password').sort({ name: 1 });
  
  sendSuccess(res, users, 200, 'Users retrieved successfully');
});

