import { useState } from 'react';
import { MinimalEditor } from './MinimalEditor';

interface YearlyGoalsLayerProps {
  goals: Record<string, string>;
  setGoal: (year: string, text: string) => void;
}

export function YearlyGoalsLayer({ goals, setGoal }: YearlyGoalsLayerProps) {
  const years = Array.from({ length: 41 }, (_, i) => String(2026 + i));
  const [editingYear, setEditingYear] = useState<string | null>(null);

  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0, 
        background: 'radial-gradient(circle at center, #1a0a00 0%, var(--bg-color) 100%)', 
        overflowY: 'auto',
        padding: '2rem 1rem',
        paddingTop: '6rem' // Leave space for the drag handle indicator
      }}
    >
      <div className="font-mono text-secondary" style={{ fontSize: '0.8rem', marginBottom: '2rem', textAlign: 'center', letterSpacing: '0.2em' }}>
        MISSION TIMELINE
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {years.map((year) => (
          <div 
            key={year} 
            onClick={() => setEditingYear(year)}
            style={{
              display: 'flex',
              padding: '1.5rem 0',
              borderBottom: '1px solid #222',
              cursor: 'pointer',
              opacity: goals[year] ? 1 : 0.4,
              transition: 'opacity 0.2s'
            }}
          >
            <div className="font-mono" style={{ width: '80px', color: 'var(--accent-red)' }}>
              {year}
            </div>
            <div className="font-sans" style={{ flex: 1, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {goals[year] || '[ EMPTY ]'}
            </div>
          </div>
        ))}
      </div>

      <MinimalEditor
        isOpen={!!editingYear}
        onClose={() => setEditingYear(null)}
        title={`GOAL ${editingYear}`}
        initialValue={editingYear ? (goals[editingYear] || '') : ''}
        isNumeric={false}
        onSave={(val) => {
          if (editingYear) setGoal(editingYear, val);
        }}
      />
    </div>
  );
}
