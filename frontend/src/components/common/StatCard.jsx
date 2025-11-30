import { motion } from 'framer-motion';

function StatCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, shadow: 'lg' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase truncate">{title}</p>
          <motion.p 
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mt-1 sm:mt-2"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.p>
          {subtitle && <p className="text-xs sm:text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <motion.div 
            className={`${colorClasses[color]} p-2 sm:p-3 md:p-4 rounded-full flex-shrink-0 ml-2`}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Icon className="text-white text-lg sm:text-xl md:text-2xl" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default StatCard;
