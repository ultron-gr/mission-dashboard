import type { AppState } from './schema';
import { DEFAULT_STATE } from './schema';

// Helper to safely get old localStorage items
function safeGetItem(key: string, fallback: any): any {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

export function performMigrations(currentState: any): AppState {
  let state = currentState;

  // 1. If completely empty, perform initial scatter-gather legacy migration (v1)
  if (!state) {
    const legacySaved = safeGetItem('mission_saved', 0);
    const legacyTarget = safeGetItem('mission_target_120cr', 1200000000);
    const legacyGoals = safeGetItem('mission_goals', {});

    state = {
      version: 1,
      birthDate: "2026-07-13",
      targetDate: "2066-07-13",
      bugatti: {
        savedAmount: legacySaved,
        targetPrice: legacyTarget,
      },
      yearlyGoals: {},
      settings: { currency: "INR" }
    };

    Object.entries(legacyGoals).forEach(([year, text]) => {
      state.yearlyGoals[year] = {
        goal: text as string,
        targetAmount: null,
        notes: '',
        savedAmount: 0,
        completed: false
      };
    });
  }

  // 2. Migrate from v1 to v2 (add invested and royalty)
  if (state.version === 1) {
    state = {
      ...state,
      version: 2,
      bugatti: {
        ...state.bugatti,
        investedAmount: 0,
        royaltyAmount: 0
      }
    };
  }

  // 3. Migrate from v2 to v3 (remove invested/royalty, add savingsHistory)
  if (state.version === 2) {
    const history = [];
    if (state.bugatti.savedAmount > 0) {
      history.push({ amount: state.bugatti.savedAmount, timestamp: Date.now() });
    }

    state = {
      ...state,
      version: 3,
      bugatti: {
        targetPrice: state.bugatti.targetPrice,
        savedAmount: state.bugatti.savedAmount,
      },
      savingsHistory: history
    };
  }

  // If we have state but it's v3, just return it
  if (state.version === 3) {
    return state as AppState;
  }

  // Fallback safe recovery
  return DEFAULT_STATE;
}
