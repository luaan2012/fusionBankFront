import { create } from 'zustand';
import { LevelError, type ErrorApi } from '~/models/response/errorResponse'
import type { CreditCard } from '~/models/creditCard'
import { creditCardApi } from '~/services/creditCardApi'

// Tipagem do estado de autenticação
interface CreditCardState {
  creditCards: CreditCard[];
  loading: boolean;
  error: ErrorApi | null;
  requestCreditCard: (account: string) => void;
  getCreditCardsById: (account: string) => void;
}

// Criação da store com persistência
export const useCreditCardStore = create<CreditCardState>()(
  (set, get) => ({
    creditCards: [],
    loading: false,
    error: null,
    requestCreditCard: async (account: string) => {
      if (get().loading) return get().creditCards;
      set({ loading: true, error: null});
      try {
        await creditCardApi.requestCreditCard(account);
        set({ loading: false, error: null });
      } catch (err: any) {
        set({
          loading: false,
          error: { message: err.response?.data?.message || err.message || 'Erro ao requisitar um novo cartao', levelError: LevelError.high }
        });
      }
    },
    getCreditCardsById: async (account: string) => {
      if (get().loading) return get().creditCards;
      set({ loading: true, error: null});
      try {
        var CreditCards = await creditCardApi.getCreditCardsById(account);
        set({ loading: false, error: null, creditCards: CreditCards.data });
      } catch (err: any) {
        set({
          loading: false,
          error: { message: err.response?.data?.message || err.message || 'Erro ao listar cartoes', levelError: LevelError.high }
        });
      }
    }
  })
);