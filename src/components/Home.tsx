import { useState } from 'react';
import { useDragControls } from 'framer-motion';
import { DashboardLayer } from './DashboardLayer';
import { YearlyGoalsLayer } from './YearlyGoalsLayer';
import { useAppState } from '../hooks/useAppState';

export function Home() {
  const dragControls = useDragControls();
  const [isRevealed, setIsRevealed] = useState(false);
  const { state, updateState } = useAppState();

  const setSavedAmount = (amount: number) => {
    updateState(draft => {
      draft.bugatti.savedAmount = amount;
      
      const len = draft.savingsHistory.length;
      // Only push if the new amount is different from the very last entry
      if (len === 0 || draft.savingsHistory[len - 1].amount !== amount) {
        draft.savingsHistory.push({
          amount,
          timestamp: Date.now()
        });
      }
      
      return draft;
    });
  };

  const setTargetPrice = (price: number) => {
    updateState(draft => {
      draft.bugatti.targetPrice = price;
      return draft;
    });
  };

  // Map state.yearlyGoals back to simple string record for the YearlyGoalsLayer compatibility
  const legacyGoalsRecord: Record<string, string> = {};
  Object.keys(state.yearlyGoals).forEach(year => {
    legacyGoalsRecord[year] = state.yearlyGoals[year].goal;
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
      <YearlyGoalsLayer />

      <DashboardLayer
        dragControls={dragControls}
        isRevealed={isRevealed}
        setIsRevealed={setIsRevealed}
        savedAmount={state.bugatti.savedAmount}
        targetPrice={state.bugatti.targetPrice || 0}
        savingsHistory={state.savingsHistory}
        setSavedAmount={setSavedAmount}
        setTargetPrice={setTargetPrice}
      />
    </div>
  );
}
