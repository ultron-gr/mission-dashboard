import { useParams, useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import { MinimalEditor } from './MinimalEditor';
import { useState } from 'react';

export function YearlyMissionPage() {
  const { yearId } = useParams();
  const navigate = useNavigate();
  const { state, updateState } = useAppState();

  const [editorMode, setEditorMode] = useState<keyof typeof goalState | null>(null);

  if (!yearId) return null;

  const goalState = state.yearlyGoals[yearId] || {
    goal: '',
    targetAmount: null,
    notes: '',
    savedAmount: 0,
    completed: false
  };

  const updateField = (field: keyof typeof goalState, value: any) => {
    updateState(draft => {
      if (!draft.yearlyGoals[yearId]) {
        draft.yearlyGoals[yearId] = { goal: '', targetAmount: null, notes: '', savedAmount: 0, completed: false };
      }
      (draft.yearlyGoals[yearId] as any)[field] = value;
      return draft;
    });
  };

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100%', 
      background: 'radial-gradient(circle at center, #1a0a00 0%, #050505 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem'
    }}>
      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <button 
          onClick={() => navigate(`/year/${Number(yearId) - 1}`)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
        >
          &lt; {Number(yearId) - 1}
        </button>
        <button 
          onClick={() => navigate('/')}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
        >
          HOME
        </button>
        <button 
          onClick={() => navigate(`/year/${Number(yearId) + 1}`)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
        >
          {Number(yearId) + 1} &gt;
        </button>
      </div>

      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <h1 className="font-mono" style={{ fontSize: '3rem', color: 'var(--accent-red)', margin: 0, letterSpacing: '0.1em' }}>
          {yearId}
        </h1>

        {/* Goal Field */}
        <div style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', textAlign: 'left' }}>
          <div className="font-mono text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>GOAL</div>
          <div 
            onClick={() => setEditorMode('goal')}
            style={{ fontSize: '1.2rem', cursor: 'text', minHeight: '2rem', whiteSpace: 'pre-wrap' }}
          >
            {goalState.goal || <span style={{ color: '#444' }}>Tap to add goal...</span>}
          </div>
        </div>

        {/* Target Amount Field */}
        <div style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', textAlign: 'left' }}>
          <div className="font-mono text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>TARGET AMOUNT</div>
          <div 
            onClick={() => setEditorMode('targetAmount')}
            style={{ fontSize: '1.2rem', cursor: 'text', minHeight: '2rem', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}
          >
            {goalState.targetAmount ? `₹${goalState.targetAmount.toLocaleString()}` : <span style={{ color: '#444' }}>--</span>}
          </div>
        </div>

        {/* Saved Amount Field */}
        <div style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', textAlign: 'left' }}>
          <div className="font-mono text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>SAVED AMOUNT</div>
          <div 
            onClick={() => setEditorMode('savedAmount')}
            style={{ fontSize: '1.2rem', cursor: 'text', minHeight: '2rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
          >
            ₹{goalState.savedAmount.toLocaleString()}
          </div>
        </div>

        {/* Notes Field */}
        <div style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', textAlign: 'left' }}>
          <div className="font-mono text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>NOTES</div>
          <div 
            onClick={() => setEditorMode('notes')}
            style={{ fontSize: '1rem', cursor: 'text', minHeight: '2rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}
          >
            {goalState.notes || <span style={{ color: '#444' }}>Tap to add notes...</span>}
          </div>
        </div>
        
        {/* Completed Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '1rem', background: goalState.completed ? 'rgba(255, 42, 0, 0.1)' : '#111', borderRadius: '8px', cursor: 'pointer' }} onClick={() => updateField('completed', !goalState.completed)}>
          <span className="font-mono" style={{ color: goalState.completed ? 'var(--accent-red)' : 'var(--text-secondary)' }}>MISSION COMPLETED</span>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${goalState.completed ? 'var(--accent-red)' : '#444'}`, background: goalState.completed ? 'var(--accent-red)' : 'transparent' }} />
        </div>
      </div>

      {editorMode && (
        <MinimalEditor
          initialValue={(goalState[editorMode] || '').toString()}
          onSave={(val) => {
            const numericFields = ['targetAmount', 'savedAmount'];
            const finalVal = numericFields.includes(editorMode) ? Number(val) : val;
            updateField(editorMode, finalVal);
          }}
          onClose={() => setEditorMode(null)}
          title={`EDIT ${editorMode.replace(/([A-Z])/g, ' $1').toUpperCase()}`}
          type={['targetAmount', 'savedAmount'].includes(editorMode) ? 'number' : 'text'}
        />
      )}
    </div>
  );
}
