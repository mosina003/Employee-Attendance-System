import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTimesCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

function ActivityTimeline({ activities = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case 'check-in':
        return <FaSignInAlt className="text-green-500" />;
      case 'check-out':
        return <FaSignOutAlt className="text-red-500" />;
      case 'present':
        return <FaCheckCircle className="text-green-500" />;
      case 'absent':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-blue-500" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'check-in':
      case 'present':
        return 'border-green-500 bg-green-50';
      case 'check-out':
      case 'absent':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-start space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 ${getColor(activity.type)} flex items-center justify-center`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <FaClock className="mx-auto text-4xl mb-2 opacity-30" />
            <p className="text-sm">No recent activities</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ActivityTimeline;
