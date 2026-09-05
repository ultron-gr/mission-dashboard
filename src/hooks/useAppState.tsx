import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppState } from '../services/persistence/schema';
import { storage } from '../services/persistence/storage';

interface AppStateContextType {
  state: AppState;
  updateState: (updater: (draft: AppState) => AppState) => void;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => storage.loadState());

  // Save to persistence whenever state changes
  useEffect(() => {
    storage.saveState(state);
  }, [state]);

  const updateState = (updater: (draft: AppState) => AppState) => {
    setState((prev) => updater({ ...prev }));
  };

  return (
    <AppStateContext.Provider value={{ state, updateState }}>
      {children}
    </AppStateContext.Provider>
  );
};

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
