import { create } from 'zustand';
import { bankApi } from '~/services/bankService'
import { LevelError, type ErrorApi } from '~/types/api'
import type { Bank } from '~/types/bank'

// Tipagem do estado de autenticação
interface BankState {
  banks: Bank[];
  loading: boolean;
  error: ErrorApi | null;
  listBanks: () => Promise<Bank[]>;
}

// Criação da store com persistência
export const useBankStore = create<BankState>()(
  (set, get) => ({
    banks: [],
    loading: false,
    error: null,
    listBanks: async () => {
      if (get().loading) return; // Prevent concurrent calls
      set({ loading: true, error: null});
      try {
        var banks = await bankApi.listBanks();
        set({ loading: false, error: null, banks: banks.data });
        return banks.data;
      } catch (err: any) {
        set({
          loading: false,
          error: { message: err.response?.data?.message || err.message || 'Erro ao atualizar dark mode', levelError: LevelError.high }
        });
        return [];
      }
    }
  })
);