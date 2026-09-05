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
        {/* Main downward spotlight beam - perfectly centered & symmetrical */}
        <motion.div style={{
          position: 'absolute',
          top: '4px',
          width: '360px',
          left: 'calc(50% - 180px)',
          transformOrigin: 'top center',
          height: '180px',
          filter: 'blur(18px)',
          zIndex: 0,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse 65% 100% at 50% 0%, rgba(${baseColorStr}, 0.45) 0%, rgba(${baseColorStr}, 0.15) 50%, transparent 80%)`,
          WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 50% 0%, black 30%, transparent 85%)',
          maskImage: 'radial-gradient(ellipse 80% 100% at 50% 0%, black 30%, transparent 85%)'
        }} 
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: 1,
          opacity: 0.95
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />

        {/* Focused central downlight beam for crisp middle radiance */}
        <motion.div style={{
          position: 'absolute',
          top: '4px',
          width: '240px',
          left: 'calc(50% - 120px)',
          transformOrigin: 'top center',
          height: '90px',
          filter: 'blur(10px)',
          zIndex: 0,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse 55% 100% at 50% 0%, rgba(${baseColorStr}, 0.6) 0%, rgba(${baseColorStr}, 0.18) 60%, transparent 100%)`
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: 1,
          opacity: 0.9
        }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />

        {/* Fluorescent Tube Light - Expanding smoothly from Center to cover the Underline */}
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
            background: `rgba(${baseColorStr}, 0.8)`,
            boxShadow: `0 0 10px 2px rgba(${baseColorStr}, 0.6), 0 0 25px 6px rgba(${baseColorStr}, 0.3)`
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: 1,
            opacity: 1
          }}
          transition={{
            duration: 1.1,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.15
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
            scaleX: 1,
            opacity: 1
          }}
          transition={{
            duration: 1.0,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.15
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
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
        />
      </div>
    </div>
  );
}
