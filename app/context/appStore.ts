import { create } from 'zustand';

interface AppState {
  view: string;
  setView: (view: string) => void;
}

// Criação da store com persistência
export const useAppStore = create<AppState>()(
    set => ({
      view: 'dashboard',
      setView: async (view: string) => {
        set({
          view: view,
        });
      }
    })
);