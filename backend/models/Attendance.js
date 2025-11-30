const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day'],
    default: 'present'
  },
  totalHours: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
attendanceSchema.index({ userId: 1, date: 1 });

// Calculate status based on check-in time
attendanceSchema.pre('save', function(next) {
  if (this.isNew) {
    const checkInHour = this.checkInTime.getHours();
    const checkInMinute = this.checkInTime.getMinutes();
    
    // If check-in is after 9:30 AM, mark as late
    if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 30)) {
      this.status = 'late';
    }
  }
  
  // Calculate total hours if checked out
  if (this.checkOutTime && this.checkInTime) {
    const diff = this.checkOutTime - this.checkInTime;
    this.totalHours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
    
    // If total hours less than 4, mark as half-day
    if (this.totalHours < 4) {
      this.status = 'half-day';
    }
  }
  
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
