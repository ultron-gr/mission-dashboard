import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const IMAGES = [
  '/bugatti3.png',
  '/gallery2/1.png',
  '/gallery2/3.png',
  '/gallery2/4.png',
];

export function BugattiScene() {
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((i) => (i + 1) % IMAGES.length);
  const handlePrev = () => setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);

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
        
        <button 
          onClick={handlePrev}
          style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', fontSize: '3rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', padding: '0 1rem', zIndex: 10 }}
        >
          &lt;
        </button>

        <div style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.img 
              key={index}
              src={IMAGES[index]} 
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

        <button 
          onClick={handleNext}
          style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', fontSize: '3rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', padding: '0 1rem', zIndex: 10 }}
        >
          &gt;
        </button>

      </div>

      {/* Small indicator dots below */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
        {IMAGES.map((_, idx) => (
          <div 
            key={idx} 
            style={{
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: idx === index ? 'var(--accent-red)' : '#333',
              transition: 'background 0.3s'
            }} 
          />
        ))}
      </div>
    </div>
  );
}
