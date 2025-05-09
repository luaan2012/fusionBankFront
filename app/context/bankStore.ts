import { create } from 'zustand';
import { LevelError, type ErrorApi } from '~/models/response/errorResponse'
import type { Bank } from '~/models/bank'
import { bankApi } from '~/services/bankApi'

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
      if (get().loading) return get().banks; // Prevent concurrent calls
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