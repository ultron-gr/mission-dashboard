export interface YearlyGoal {
  goal: string;
  targetAmount: number | null;
  notes: string;
  savedAmount: number;
  completed: boolean;
}

export interface SavingsPoint {
  amount: number;
  timestamp: number;
}

export interface BugattiState {
  targetPrice: number | null;
  savedAmount: number;
}

export interface AppStateV1 {
  version: 1;
  birthDate: string;
  targetDate: string;
  bugatti: { targetPrice: number | null; savedAmount: number; };
  yearlyGoals: Record<string, YearlyGoal>;
  settings: { currency: string; };
}

export interface AppStateV2 {
  version: 2;
  birthDate: string;
  targetDate: string;
  bugatti: { targetPrice: number | null; savedAmount: number; investedAmount: number; royaltyAmount: number; };
  yearlyGoals: Record<string, YearlyGoal>;
  settings: { currency: string; };
}

export interface AppStateV3 {
  version: 3;
  birthDate: string;
  targetDate: string;
  bugatti: BugattiState;
  savingsHistory: SavingsPoint[];
  yearlyGoals: Record<string, YearlyGoal>;
  settings: { currency: string; };
}

export type AppState = AppStateV3; // Always alias to latest version

export const DEFAULT_STATE: AppState = {
  version: 3,
  birthDate: "2026-07-13",
  targetDate: "2066-07-13",
  bugatti: {
    targetPrice: 1200000000,
    savedAmount: 0
  },
  savingsHistory: [],
  yearlyGoals: {},
  settings: {
    currency: "INR"
  }
};
