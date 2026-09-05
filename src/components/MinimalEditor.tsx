import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface MinimalEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialValue: string | number;
  onSave: (val: string) => void;
  isNumeric?: boolean;
}

export function MinimalEditor({ isOpen, onClose, title, initialValue, onSave, isNumeric }: MinimalEditorProps) {
  const [val, setVal] = useState(String(initialValue));

  useEffect(() => {
    setVal(String(initialValue));
  }, [initialValue, isOpen]);

  const handleSave = () => {
    onSave(val);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--surface-color)',
            borderTop: '1px solid #333',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100,
          }}
        >
          <div className="font-mono text-secondary" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
            {title}
          </div>
          
          {isNumeric ? (
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="font-mono text-primary"
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #555',
                fontSize: '2rem',
                outline: 'none',
                color: 'white',
                marginBottom: '2rem',
              }}
              autoFocus
            />
          ) : (
            <textarea
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="font-sans text-primary"
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #555',
                fontSize: '1.2rem',
                outline: 'none',
                color: 'white',
                marginBottom: '2rem',
                minHeight: '100px',
                resize: 'none',
              }}
              autoFocus
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={onClose}
              className="font-mono"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="font-mono"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              SAVE
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
