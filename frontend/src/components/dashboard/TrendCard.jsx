import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

function TrendCard({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon: Icon, 
  color = 'blue',
  subtitle 
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <FaArrowUp className="text-green-500" />;
    if (trend === 'down') return <FaArrowDown className="text-red-500" />;
    return <FaMinus className="text-gray-400" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 bg-green-50';
    if (trend === 'down') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <motion.p 
              className="text-3xl font-bold text-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              {value}
            </motion.p>
            {trendValue && (
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>{trendValue}</span>
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <motion.div 
            className={`${colorClasses[color]} p-3 rounded-full`}
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ rotate: 360 }}
          >
            <Icon className="text-white text-xl" />
          </motion.div>
        )}
      </div>
      
      {/* Mini sparkline effect */}
      <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${colorClasses[color]}`}
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
          transition={{ delay: 0.5, duration: 1 }}
        />
      </div>
    </motion.div>
  );
}

export default TrendCard;
