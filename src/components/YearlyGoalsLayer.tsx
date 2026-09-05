import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';

const YEARS = Array.from({ length: 41 }, (_, i) => (2026 + i).toString());

export function YearlyGoalsLayer() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const goals = state.yearlyGoals;

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, #1a0a00 0%, #050505 100%)',
        overflowY: 'auto',
        padding: '2rem 1rem',
        paddingTop: '30vh', // Start text lower so it's revealed smoothly
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '10vh' }}>
        {YEARS.map((year, index) => {
          const goalObj = goals[year];
          const hasGoal = goalObj && goalObj.goal;
          
          return (
            <motion.div 
              key={year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05 }}
              style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', cursor: 'pointer' }}
              onClick={() => navigate(`/year/${year}`)}
            >
              <div 
                className="font-mono text-primary" 
                style={{ fontSize: '1.2rem', minWidth: '80px', paddingTop: '0.2rem', letterSpacing: '0.05em' }}
              >
                {year}
              </div>
              
              <div style={{ flex: 1 }}>
                <div 
                  className={hasGoal ? "text-primary" : "text-secondary"}
                  style={{ 
                    fontSize: hasGoal ? '1.2rem' : '1rem',
                    fontStyle: hasGoal ? 'normal' : 'italic',
                    lineHeight: 1.5,
                    borderLeft: hasGoal ? '2px solid var(--accent-red)' : '1px solid #333',
                    paddingLeft: '1rem',
                    marginLeft: '-1rem',
                    minHeight: '2rem',
                    color: goalObj?.completed ? 'var(--text-secondary)' : (hasGoal ? '#fff' : '#666'),
                    textDecoration: goalObj?.completed ? 'line-through' : 'none'
                  }}
                >
                  {hasGoal ? goalObj.goal : "NO TARGET SET"}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
