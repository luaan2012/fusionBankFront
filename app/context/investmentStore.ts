import { create } from 'zustand';
import type { Investment } from '~/models/investment'
import { type ErrorApi } from '~/models/response/errorResponse'
import { investmentApi } from '~/services/investmentApi'

// Tipagem do estado de autenticação
interface InvestmentState {
  investment: Investment[];
  loading: boolean;
  error: ErrorApi | null
  getInvestmentsHome: (accountId: string, limit: number) => void;
}
// Criação da store com persistência
export const useInvestmentStore = create<InvestmentState>()(
  (set, get) => ({
      investment: [],
      loading: false,
      error: null,
      getInvestmentsHome: async (accountId: string, limit: number) => {
        if (get().loading) return; 
        set({ loading: true, error: null });
        try {
          const response = await investmentApi.listInvestmentHome(accountId, limit);
          set({ loading: false, investment: response.data });
        } catch (err: any) {
          set({ loading: false, error: err.message || 'Falha ao carregar ultimos Investmentos' });
        }
      }
    })
);