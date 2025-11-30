import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaHourglassHalf,
} from 'react-icons/fa';
import { ATTENDANCE_STATUS, STATUS_COLORS } from './constants';

/**
 * Get status badge component
 * @param {string} status - Attendance status
 * @returns {JSX.Element} Status badge
 */
export const getStatusBadge = (status) => {
  const config = {
    [ATTENDANCE_STATUS.PRESENT]: {
      ...STATUS_COLORS[ATTENDANCE_STATUS.PRESENT],
      icon: <FaCheckCircle className="inline mr-1" />,
    },
    [ATTENDANCE_STATUS.ABSENT]: {
      ...STATUS_COLORS[ATTENDANCE_STATUS.ABSENT],
      icon: <FaTimesCircle className="inline mr-1" />,
    },
    [ATTENDANCE_STATUS.LATE]: {
      ...STATUS_COLORS[ATTENDANCE_STATUS.LATE],
      icon: <FaExclamationCircle className="inline mr-1" />,
    },
    [ATTENDANCE_STATUS.HALF_DAY]: {
      ...STATUS_COLORS[ATTENDANCE_STATUS.HALF_DAY],
      icon: <FaHourglassHalf className="inline mr-1" />,
    },
  };

  const statusConfig = config[status] || config[ATTENDANCE_STATUS.PRESENT];
  const displayStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : 'Unknown';

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}
    >
      {statusConfig.icon}
      {displayStatus}
    </span>
  );
};

/**
 * Get status icon component
 * @param {string} status - Attendance status
 * @returns {JSX.Element} Status icon
 */
export const getStatusIcon = (status) => {
  const icons = {
    [ATTENDANCE_STATUS.PRESENT]: <FaCheckCircle className="text-green-500" />,
    [ATTENDANCE_STATUS.ABSENT]: <FaTimesCircle className="text-red-500" />,
    [ATTENDANCE_STATUS.LATE]: <FaExclamationCircle className="text-yellow-500" />,
    [ATTENDANCE_STATUS.HALF_DAY]: <FaHourglassHalf className="text-orange-500" />,
  };
  return icons[status] || icons[ATTENDANCE_STATUS.PRESENT];
};
