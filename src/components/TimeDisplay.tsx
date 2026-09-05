import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTimeStats } from '../utils/time';

interface TimeDisplayProps {
  activeCarIndex?: number;
}

const CAR_COLORS = [
  '255, 120, 0',    // 0: Orange
  '150, 180, 255',  // 1: Silver Blue
  '255, 10, 10',    // 2: Angry Red
  '0, 100, 255'     // 3: Deep Blue
];

export function TimeDisplay({ activeCarIndex = 0 }: TimeDisplayProps) {
  const [stats, setStats] = useState(() => getTimeStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getTimeStats());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const { remainingDays, elapsedPercentage } = stats;

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

  const formattedDays = remainingDays.toLocaleString();

  // Pick the color based on the car index
  const baseColorStr = CAR_COLORS[activeCarIndex % CAR_COLORS.length];
  
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

      {/* Danger Progress Bar Container with Lamp Effect */}
      <div style={{ 
        width: '80%', maxWidth: '300px', height: '4px', background: '#111', 
        marginTop: '1.5rem', position: 'relative', overflow: 'visible',
        borderRadius: '2px'
      }}>
        
        {/* --- LAMP EFFECT START --- */}
        {/* Main downward spotlight beam expanding with tube */}
        <motion.div style={{
          position: 'absolute',
          top: '4px',
          left: '50%',
          transform: 'translateX(-50%)',
          transformOrigin: 'top center',
          width: '100%',
          maxWidth: '320px',
          height: '140px',
          filter: 'blur(15px)',
          zIndex: 0,
          pointerEvents: 'none',
          WebkitMaskImage: 'radial-gradient(circle at top, black 0%, transparent 70%)',
          maskImage: 'radial-gradient(circle at top, black 0%, transparent 70%)'
        }} 
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: 1,
          opacity: 0.9,
          background: `conic-gradient(from 90deg at 50% -10%, transparent 0deg, rgba(${baseColorStr}, 0.4) 90deg, transparent 180deg)`
        }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />

        {/* Fluorescent Tube Light - Expanding from Center to cover the Underline */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '2px',
            transformOrigin: 'center',
            pointerEvents: 'none',
            zIndex: 1,
            background: `rgba(${baseColorStr}, 0.75)`,
            boxShadow: `0 0 10px 2px rgba(${baseColorStr}, 0.6), 0 0 25px 6px rgba(${baseColorStr}, 0.3)`
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: [0, 0.08, 0.05, 0.4, 1],
            opacity: [0, 0.9, 0.4, 0.9, 1]
          }}
          transition={{
            duration: 0.85,
            times: [0, 0.15, 0.25, 0.5, 1],
            ease: 'easeOut',
            delay: 0.2
          }}
        />

        {/* Super-bright inner neon tube core wire */}
        <motion.div
          style={{
            position: 'absolute',
            top: '1px',
            left: 0,
            width: '100%',
            height: '2px',
            borderRadius: '1px',
            transformOrigin: 'center',
            pointerEvents: 'none',
            zIndex: 2,
            background: '#ffffff',
            boxShadow: `0 0 6px #fff, 0 0 14px rgba(${baseColorStr}, 0.9)`
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: [0, 0.1, 0.08, 0.5, 1],
            opacity: [0, 1, 0.5, 1, 1]
          }}
          transition={{
            duration: 0.85,
            times: [0, 0.15, 0.25, 0.5, 1],
            ease: 'easeOut',
            delay: 0.2
          }}
        />
        {/* --- LAMP EFFECT END --- */}

        {/* Actual Progress Fill */}
        <motion.div
          style={{ 
            height: '100%', 
            background: dangerClass, 
            boxShadow: shadowClass,
            position: 'relative',
            zIndex: 3,
            borderRadius: '2px'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${elapsedPercentage}%` }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.9 }}
        />
      </div>
    </div>
  );
}
