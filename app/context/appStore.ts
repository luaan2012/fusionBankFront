import { create } from 'zustand';

interface AppState {
  view: string;
  toastSuccess: boolean
  toastError: boolean
  setView: (view: string) => void;
}

export const useAppStore = create<AppState>()(
    set => ({
      view: 'dashboard',
      toastSuccess: false,
      toastError: false,
      setView: async (view: string) => {
        set({
          view: view,
        });
      }
    })
);