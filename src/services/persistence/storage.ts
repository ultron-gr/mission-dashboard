import type { AppState } from './schema';
import { performMigrations } from './migrations';

const STORAGE_KEY = 'mission-dashboard-state';

export const storage = {
  loadState: (): AppState => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      
      // Pass the raw parsed JSON (if it exists) to migrations
      const parsed = raw ? JSON.parse(raw) : null;
      
      // Perform any migrations necessary
      const finalState = performMigrations(parsed);
      
      // Resave immediately if a migration occurred (meaning raw was null or an older version)
      if (!raw || (parsed && parsed.version !== finalState.version)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalState));
      }
      
      return finalState;
    } catch (e) {
      console.error("Failed to load state, corrupted JSON. Recovering.", e);
      // Attempt legacy migration as fallback if completely corrupted
      const recoveredState = performMigrations(null);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recoveredState));
      return recoveredState;
    }
  },

  saveState: (state: AppState): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }
};
