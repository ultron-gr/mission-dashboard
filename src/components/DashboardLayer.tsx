import { motion } from 'framer-motion';
import { TimeDisplay } from './TimeDisplay';
import { BugattiScene } from './BugattiScene';
import { MoneyProgress } from './MoneyProgress';
import { MinimalEditor } from './MinimalEditor';
import { useState } from 'react';

import type { SavingsPoint } from '../services/persistence/schema';

interface DashboardLayerProps {
  dragControls: any;
  isRevealed: boolean;
  setIsRevealed: (v: boolean) => void;
  savedAmount: number;
  targetPrice: number;
  savingsHistory: SavingsPoint[];
  setSavedAmount: (val: number) => void;
  setTargetPrice: (val: number) => void;
}

export function DashboardLayer({
  dragControls,
  isRevealed,
  setIsRevealed,
  savedAmount,
  targetPrice,
  savingsHistory,
  setSavedAmount,
  setTargetPrice,
}: DashboardLayerProps) {
  const [editorMode, setEditorMode] = useState<'savings' | 'target' | null>(null);
  const [activeCarIndex, setActiveCarIndex] = useState(0);

  const handleDragEnd = (_: any, info: any) => {
    // Threshold to reveal or hide
    if (!isRevealed && info.offset.y > 100) {
      setIsRevealed(true);
    } else if (isRevealed && info.offset.y < -50) {
      setIsRevealed(false);
    }
  };

  const handleSave = (val: string) => {
    const num = Number(val) || 0;
    if (editorMode === 'savings') setSavedAmount(num);
    if (editorMode === 'target') setTargetPrice(num);
  };

  const CAR_COLORS = [
    '255, 120, 0',    // 0: Orange
    '150, 180, 255',  // 1: Silver Blue
    '255, 10, 10',    // 2: Angry Red
    '0, 100, 255'     // 3: Deep Blue
  ];
  const activeColorStr = CAR_COLORS[activeCarIndex % CAR_COLORS.length];

  return (
    <motion.div
      drag="y"
      dragControls={dragControls}
      dragListener={false} 
      dragConstraints={{ top: 0, bottom: window.innerHeight * 0.85 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={{
        y: isRevealed ? window.innerHeight * 0.85 : 0,
        backgroundImage: `radial-gradient(circle at top center, rgba(${activeColorStr}, 0.2) 0%, rgba(5, 5, 5, 0) 100%)`
      }}
      transition={{ 
        y: { type: 'spring', damping: isRevealed ? 20 : 25, stiffness: isRevealed ? 100 : 150 },
        backgroundImage: { duration: 0.6, ease: 'easeInOut' }
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#050505',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -10px 50px rgba(0,0,0,0.8)', // Shadow for depth
      }}
    >
      {/* Top drag handle indicator */}
      <div 
        onPointerDown={(e) => dragControls.start(e)}
        style={{
          height: '60px', // slightly taller for easier thumb grab
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'grab',
          touchAction: 'none'
        }}
      >
        <div style={{ width: '50px', height: '4px', background: '#333', borderRadius: '2px' }} />
      </div>

      <div 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          paddingBottom: '3rem',
          opacity: isRevealed ? 0.3 : 1, // dim the dashboard when revealed
          pointerEvents: isRevealed ? 'none' : 'auto', // disable interactions when pushed down
          transition: 'opacity 0.3s'
        }}
      >
        <TimeDisplay activeCarIndex={activeCarIndex} />
        
        <BugattiScene activeCarIndex={activeCarIndex} setActiveCarIndex={setActiveCarIndex} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 1rem' }}>
          <MoneyProgress 
            savedAmount={savedAmount}
            targetPrice={targetPrice} 
            savingsHistory={savingsHistory}
            onClick={() => setEditorMode('savings')}
          />
        </div>
      </div>

      <MinimalEditor
        isOpen={!!editorMode}
        onClose={() => setEditorMode(null)}
        title={editorMode === 'savings' ? 'UPDATE SAVED AMOUNT' : 'UPDATE TARGET PRICE'}
        initialValue={editorMode === 'savings' ? savedAmount : targetPrice}
        isNumeric={true}
        onSave={handleSave}
      />
    </motion.div>
  );
}
