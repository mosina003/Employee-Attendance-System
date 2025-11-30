import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PropTypes from 'prop-types';

function CircularProgress({ 
  value, 
  maxValue = 100, 
  label, 
  color = '#3b82f6',
  size = 120 
}) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
    >
      <div style={{ width: size, height: size }}>
        <CircularProgressbar
          value={percentage}
          text={`${Math.round(percentage)}%`}
          styles={buildStyles({
            textSize: '16px',
            pathTransitionDuration: 1.5,
            pathColor: color,
            textColor: color,
            trailColor: '#e5e7eb',
            backgroundColor: '#3e98c7',
          })}
        />
      </div>
      {label && (
        <p className="mt-3 text-sm font-semibold text-gray-700">{label}</p>
      )}
    </motion.div>
  );
}

export default CircularProgress;
