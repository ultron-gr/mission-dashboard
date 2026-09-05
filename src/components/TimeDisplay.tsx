import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTimeStats } from '../utils/time';

export function TimeDisplay() {
  const [stats, setStats] = useState(() => getTimeStats());

  useEffect(() => {
    // Update every minute is sufficient, but every second feels more alive if we showed seconds
    // Since we only show days, daily or hourly is enough. We'll do minute-ly to catch midnight precisely.
    const interval = setInterval(() => {
      setStats(getTimeStats());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const { remainingDays, elapsedPercentage } = stats;

  // Visual threat calculation
  // > 90% elapsed: High Danger
  // > 50% elapsed: Medium Danger
  // < 50% elapsed: Low Danger
  let dangerClass = 'var(--danger-low)';
  let shadowClass = 'none';
  if (elapsedPercentage > 50) {
    dangerClass = 'var(--danger-med)';
    shadowClass = '0 0 10px rgba(170, 34, 34, 0.3)';
  }
  if (elapsedPercentage > 90) {
    dangerClass = 'var(--danger-high)';
    shadowClass = '0 0 20px rgba(255, 17, 17, 0.6)';
  }

  // Format with commas, e.g. "14,502"
  const formattedDays = remainingDays.toLocaleString();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0' }}>
      <div 
        className="font-mono" 
        style={{ 
          fontSize: '0.8rem', 
          color: 'var(--text-secondary)', 
          letterSpacing: '0.2em', 
          marginBottom: '0.5rem' 
        }}
      >
        DAYS REMAINING
      </div>
      
      <motion.div 
        className="font-mono text-primary"
        style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {formattedDays}
      </motion.div>

      {/* Danger Progress Bar */}
      <div style={{ width: '80%', maxWidth: '300px', height: '4px', background: '#111', marginTop: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          style={{ 
            height: '100%', 
            background: dangerClass, 
            boxShadow: shadowClass 
          }}
          initial={{ width: 0 }}
          animate={{ width: `${elapsedPercentage}%` }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
