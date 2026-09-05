import { motion } from 'framer-motion';

interface MoneyProgressProps {
  savedAmount: number;
  targetPrice: number;
  onClick: () => void;
}

export function MoneyProgress({ savedAmount, targetPrice, onClick }: MoneyProgressProps) {
  const percentage = targetPrice > 0 ? (savedAmount / targetPrice) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  // Ensure there's a tiny visual sliver if they have saved *something*, so the bar isn't completely empty
  const visualPercentage = savedAmount > 0 ? Math.max(clampedPercentage, 0.5) : 0;

  // If percentage is > 0 but < 0.01, show more decimal places so they see it's working
  const displayPercentage = clampedPercentage > 0 && clampedPercentage < 0.01 
    ? clampedPercentage.toFixed(5) 
    : clampedPercentage.toFixed(2);

  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        cursor: 'pointer',
        padding: '1rem',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      {/* Animated CSS Progress Bar */}
      <div style={{ 
        width: '100%', 
        height: '12px', 
        background: '#1a1a1a', 
        borderRadius: '6px', 
        overflow: 'hidden',
        border: '1px solid #333',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${visualPercentage}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          style={{ 
            height: '100%', 
            background: 'linear-gradient(90deg, #8b0000, #ff2a00)', 
            boxShadow: '0 0 10px rgba(255, 42, 0, 0.5)',
            borderRadius: '6px'
          }}
        />
      </div>

      <div 
        className="font-mono" 
        style={{ 
          fontSize: '0.75rem', 
          color: 'var(--text-secondary)', 
          marginTop: '1.2rem',
          letterSpacing: '0.1em',
          textAlign: 'center'
        }}
      >
        <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>₹{savedAmount.toLocaleString()}</span> SAVED<br/>
        <span style={{ opacity: 0.6 }}>{displayPercentage}% / ACQUISITION</span>
      </div>
    </div>
  );
}
