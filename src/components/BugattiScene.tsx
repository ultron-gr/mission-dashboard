import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const IMAGES = [
  '/bugatti3.png',
  '/gallery2/1.png',
  '/gallery2/3.png',
  '/gallery2/4.png',
];

interface BugattiSceneProps {
  activeCarIndex: number;
  setActiveCarIndex: (idx: number | ((prev: number) => number)) => void;
}

const CAR_COLORS = [
  '255, 120, 0',    // 0: Orange
  '150, 180, 255',  // 1: Silver Blue
  '255, 10, 10',    // 2: Angry Red
  '0, 100, 255'     // 3: Deep Blue
];

export function BugattiScene({ activeCarIndex, setActiveCarIndex }: BugattiSceneProps) {
  const handleNext = () => setActiveCarIndex((i) => (i + 1) % IMAGES.length);
  const handlePrev = () => setActiveCarIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);

  const activeColorStr = CAR_COLORS[activeCarIndex % CAR_COLORS.length];
  const activeColorCss = `rgb(${activeColorStr})`;

  return (
    <div style={{ 
      width: '100%', 
      height: '45vh', 
      position: 'relative', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '0'
    }}>
      {/* Main Image Row with Arrows */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
        height: '80%',
        padding: '0 1rem'
      }}>
        
        <motion.button 
          onClick={handlePrev}
          animate={{ color: activeColorCss }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ background: 'transparent', border: 'none', fontSize: '3rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', padding: '0 1rem', zIndex: 10 }}
        >
          &lt;
        </motion.button>

        <div style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.img 
              key={activeCarIndex}
              src={IMAGES[activeCarIndex]} 
              alt="Bugatti"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{
                width: '100%',
                height: '380px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.9))',
                borderRadius: '8px'
              }}
            />
          </AnimatePresence>
        </div>

        <motion.button 
          onClick={handleNext}
          animate={{ color: activeColorCss }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ background: 'transparent', border: 'none', fontSize: '3rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', padding: '0 1rem', zIndex: 10 }}
        >
          &gt;
        </motion.button>

      </div>

      {/* Small indicator dots below */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
        {IMAGES.map((_, idx) => (
          <motion.div 
            key={idx} 
            animate={{ background: idx === activeCarIndex ? activeColorCss : '#333' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              width: '6px', 
              height: '6px', 
              borderRadius: '50%'
            }} 
          />
        ))}
      </div>
    </div>
  );
}
