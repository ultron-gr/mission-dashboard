import { useState } from 'react';
import { useDragControls } from 'framer-motion';
import { DashboardLayer } from './components/DashboardLayer';
import { YearlyGoalsLayer } from './components/YearlyGoalsLayer';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const dragControls = useDragControls();
  const [isRevealed, setIsRevealed] = useState(false);

  // Persistence
  const [savedAmount, setSavedAmount] = useLocalStorage('mission_saved', 0);
  const [targetPrice, setTargetPrice] = useLocalStorage('mission_target_120cr', 1200000000); // Default 120Cr
  const [goals, setGoals] = useLocalStorage<Record<string, string>>('mission_goals', {});

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
      {/* Underlying Layer */}
      <YearlyGoalsLayer 
        goals={goals} 
        setGoal={(year, text) => setGoals({ ...goals, [year]: text })} 
      />

      {/* Top Layer */}
      <DashboardLayer
        dragControls={dragControls}
        isRevealed={isRevealed}
        setIsRevealed={setIsRevealed}
        savedAmount={savedAmount}
        targetPrice={targetPrice}
        setSavedAmount={setSavedAmount}
        setTargetPrice={setTargetPrice}
      />
    </div>
  );
}

export default App;
