// Pagination
export const ITEMS_PER_PAGE = 10;

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half-day',
};

// Departments
export const DEPARTMENTS = [
  'Engineering',
  'HR',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
  'Management',
];

// Working Hours
export const WORKING_HOURS = {
  START_TIME: '09:00',
  END_TIME: '18:00',
  LATE_THRESHOLD_MINUTES: 0, // Minutes after start time
  HALF_DAY_HOURS: 4,
  FULL_DAY_HOURS: 8,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'en-US',
  ISO: 'YYYY-MM-DD',
};

// API Endpoints
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
  },
  ATTENDANCE: {
    CHECKIN: '/api/attendance/checkin',
    CHECKOUT: '/api/attendance/checkout',
    MY_HISTORY: '/api/attendance/my-history',
    ALL: '/api/attendance/all',
  },
};

// Status Colors
export const STATUS_COLORS = {
  [ATTENDANCE_STATUS.PRESENT]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  [ATTENDANCE_STATUS.ABSENT]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },
  [ATTENDANCE_STATUS.LATE]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  [ATTENDANCE_STATUS.HALF_DAY]: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
  },
};
