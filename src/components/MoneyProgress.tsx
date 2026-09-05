import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SavingsPoint } from '../services/persistence/schema';

interface MoneyProgressProps {
  savedAmount: number;
  targetPrice: number;
  savingsHistory: SavingsPoint[];
  onClick: () => void;
}

export function MoneyProgress({ savedAmount, targetPrice, savingsHistory, onClick }: MoneyProgressProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Parse points. If no history, use the current savedAmount as a single point
  const points = savingsHistory.length > 0 
    ? savingsHistory 
    : [{ amount: savedAmount, timestamp: Date.now() }];
    
  // Layout Constants
  const W = 500;
  const H = 50;
  const PADDING_Y = 10;

  const { pathD, areaD, plottedPoints, activeWidth } = useMemo(() => {
    // Mathematical horizontal progress based strictly on target
    const percentage = targetPrice > 0 ? (savedAmount / targetPrice) * 100 : 0;
    const clampedPct = Math.min(Math.max(percentage, 0), 100);
    
    // The visual width of the waveform (minimum 2px so it's visible if > 0)
    let width = (clampedPct / 100) * W;
    if (savedAmount > 0 && width < 2) width = 2;
    
    // For Y, to make the waveform actually visible and move up/down relative to its own history 
    // while the whole graph stays constrained to the bottom of the container, 
    // we map the Y axis to the max history amount, but scale the container height.
    // Wait, the user specifically requested: "The Y position represents the savings amount relative to the target."
    const yMax = targetPrice > 0 ? targetPrice : Math.max(...points.map(p => p.amount), 1);
    
    // Map a value to a Y coordinate (inverted for SVG)
    const getY = (val: number) => {
      const clamped = Math.max(0, Math.min(val, yMax));
      const ratio = yMax > 0 ? clamped / yMax : 0;
      // It stays within the padded bounds
      return H - PADDING_Y - (ratio * (H - 2 * PADDING_Y));
    };

    if (points.length === 1) {
      const y = getY(points[0].amount);
      const p = [
        { x: 0, y, amount: points[0].amount, ts: points[0].timestamp }, 
        { x: width, y, amount: points[0].amount, ts: points[0].timestamp }
      ];
      return {
        pathD: `M ${p[0].x},${p[0].y} L ${p[1].x},${p[1].y}`,
        areaD: `M ${p[0].x},${H} L ${p[0].x},${p[0].y} L ${p[1].x},${p[1].y} L ${p[1].x},${H} Z`,
        plottedPoints: p,
        activeWidth: width
      };
    }

    // Multiple points distributed strictly across the active width
    const stepX = width / Math.max((points.length - 1), 1);
    const p = points.map((pt, i) => ({
      x: i * stepX,
      y: getY(pt.amount),
      amount: pt.amount,
      ts: pt.timestamp
    }));

    // Smooth cubic bezier curve
    let d = `M ${p[0].x},${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p1 = p[i];
      const p2 = p[i + 1];
      const cp1x = p1.x + (p2.x - p1.x) / 2;
      const cp1y = p1.y;
      const cp2x = p1.x + (p2.x - p1.x) / 2;
      const cp2y = p2.y;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    const area = `${d} L ${p[p.length - 1].x},${H} L ${p[0].x},${H} Z`;

    return { pathD: d, areaD: area, plottedPoints: p, activeWidth: width };
  }, [points, targetPrice, savedAmount]);

  const endPoint = plottedPoints[plottedPoints.length - 1];
  const activePoint = hoverIndex !== null ? plottedPoints[hoverIndex] : null;

  const percentage = targetPrice > 0 ? (savedAmount / targetPrice) * 100 : 0;
  const displayPercentage = percentage > 0 && percentage < 0.01 
    ? percentage.toFixed(5) 
    : percentage.toFixed(2);

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      
      {/* SVG Container / Progress Bar */}
      <motion.div 
        onClick={onClick}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        style={{ 
          position: 'relative',
          width: '100%', 
          height: `${H}px`, // Compact 50px height
          background: '#0a0505', // Inactive area is very dark
          border: '1px solid #221111',
          borderRadius: '4px',
          cursor: 'pointer',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
        }}
      >
        <svg 
          viewBox={`0 0 ${W} ${H}`} 
          preserveAspectRatio="none" 
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            {/* Background Isometric Mesh Pattern */}
            <pattern id="bg-mesh" width="30" height="15" patternUnits="userSpaceOnUse">
              <path d="M 0 15 L 30 0 M 0 0 L 30 15" fill="none" stroke="rgba(255, 42, 0, 0.07)" strokeWidth="0.5" />
            </pattern>

            {/* Active Area Fill Mesh Pattern (optional extra detail for active area) */}
            <pattern id="mesh" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 0 4 L 4 0" stroke="rgba(255, 42, 0, 0.3)" strokeWidth="0.5" />
            </pattern>
            
            {/* Area Gradient */}
            <linearGradient id="areaFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,42,0,0.5)" />
              <stop offset="100%" stopColor="rgba(255,42,0,0)" />
            </linearGradient>

            {/* Line Glow */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Full Container Background Mesh */}
          <rect width={W} height={H} fill="url(#bg-mesh)" />

          {/* Active Area Mask to restrict drawing beyond activeWidth */}
          <clipPath id="active-clip">
            <motion.rect 
              x="0" 
              y="0" 
              height={H}
              initial={{ width: 0 }}
              animate={{ width: activeWidth }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            />
          </clipPath>

          <g clipPath="url(#active-clip)">
            {/* Area Fill */}
            <path d={areaD} fill="url(#areaFade)" />
            <path d={areaD} fill="url(#mesh)" />

            {/* The Waveform Line */}
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              d={pathD} 
              fill="none" 
              stroke="#ff2a00" 
              strokeWidth="2" 
              filter="url(#glow)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Current / End Point Glow */}
          {savedAmount > 0 && (
            <motion.circle 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, duration: 0.3 }}
              cx={endPoint.x} 
              cy={endPoint.y} 
              r="2.5" 
              fill="#fff" 
              filter="url(#glow)" 
            />
          )}

          {/* Target Reference Line (if max isn't hit) */}
          <motion.line 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            x1={activeWidth} 
            y1={PADDING_Y} 
            x2={W} 
            y2={PADDING_Y} 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="1" 
            strokeDasharray="2 4" 
          />

          {/* Hover Interaction Overlay */}
          {plottedPoints.map((_, i) => {
            const sliceW = activeWidth / plottedPoints.length;
            const sliceX = i * sliceW;
            return (
              <rect
                key={i}
                x={sliceX}
                y="0"
                width={sliceW}
                height={H}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                onTouchStart={() => setHoverIndex(i)}
              />
            );
          })}

          {/* Tooltip Render inside SVG */}
          <AnimatePresence>
            {activePoint && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ pointerEvents: 'none' }}
              >
                {/* Vertical Guide Line */}
                <line 
                  x1={activePoint.x} y1="0" 
                  x2={activePoint.x} y2={H} 
                  stroke="rgba(255, 42, 0, 0.5)" 
                  strokeWidth="1" 
                  strokeDasharray="2 2" 
                />
                <circle cx={activePoint.x} cy={activePoint.y} r="2" fill="#ff2a00" />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <div className="font-mono text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          <span style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>₹{savedAmount.toLocaleString()}</span> SAVED<br/>
          {displayPercentage}% / ACQUISITION
          <AnimatePresence>
            {activePoint && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: '#ff2a00', fontSize: '0.65rem', marginTop: '0.2rem' }}
              >
                HISTORY: ₹{activePoint.amount.toLocaleString()} ({new Date(activePoint.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })})
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="font-mono text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textAlign: 'right' }}>
          TARGET <br/> <span style={{ color: 'rgba(255,255,255,0.4)' }}>₹{targetPrice ? targetPrice.toLocaleString() : 'UNSET'}</span>
        </div>
      </motion.div>
    </div>
  );
}
