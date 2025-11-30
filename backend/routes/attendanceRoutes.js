const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getTodayStatus,
  getAllAttendance,
  getEmployeeAttendance,
  getTeamSummary,
  exportAttendance,
  getTodayTeamStatus
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

// Employee routes
router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/my-history', protect, getMyHistory);
router.get('/my-summary', protect, getMySummary);
router.get('/today', protect, getTodayStatus);

// Manager routes
router.get('/all', protect, authorize('manager'), getAllAttendance);
router.get('/employee/:id', protect, authorize('manager'), getEmployeeAttendance);
router.get('/summary', protect, authorize('manager'), getTeamSummary);
router.get('/export', protect, authorize('manager'), exportAttendance);
router.get('/today-status', protect, authorize('manager'), getTodayTeamStatus);

module.exports = router;
