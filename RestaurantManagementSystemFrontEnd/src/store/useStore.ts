import { create } from 'zustand';
import { User } from '../types';

interface AppState {
  user: User | null;
  isDarkMode: boolean;
  setUser: (user: User | null) => void;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isDarkMode: false,
  setUser: (user) => set({ user }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));