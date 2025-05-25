import { create } from 'zustand';
import { LevelError, type ErrorApi } from '~/models/response/errorResponse'
import type { CreditCard } from '~/models/creditCard'
import { creditCardApi } from '~/services/creditCardApi'

// Tipagem do estado de autenticação
interface CreditCardState {
  creditCard: CreditCard;
  loading: boolean;
  error: ErrorApi;
  requestCreditCard: (account: string, limit: number) => Promise<boolean>;
  requestVirtualCreditCard: (account: string) => Promise<boolean>;
  getCreditCardsById: (account: string) => Promise<void>;
  virtualCreditCardDelete: (account: string) => Promise<boolean>;
  creditCardToggleBlocked: (account: string, isBlocked: boolean) => Promise<boolean>;
}

// Criação da store com persistência
export const useCreditCardStore = create<CreditCardState>()(
  (set, get) => ({
    creditCard: null,
    loading: false,
    error: null,
    requestCreditCard: async (account: string, limit: number) => {
      set({ loading: true, error: null});
      try {
        await creditCardApi.requestCreditCard(account, limit);
        set({ loading: false, error: null });
        return true
      } catch (err: any) { 
        set({ loading: false, error: err || { message: 'Erro na solicitacao', levelError: LevelError.high } });
        return false
      }
    },
    requestVirtualCreditCard: async (account: string) => {
      set({ loading: true, error: null});
      try {
        const virtualCreditCard = await creditCardApi.requestVirtualCreditCard(account);
        set({ loading: false, error: null, creditCard:  virtualCreditCard.data});
        return true
      } catch (err: any) { 
        set({ loading: false, error: err || { message: 'Erro na solicitacao', levelError: LevelError.high } });
        return false
      }
    },
    virtualCreditCardDelete: async (account: string) => {
      set({ loading: true, error: null});
      try {
        const virtualCreditCard = await creditCardApi.virtualCreditCardDelete(account);
        set({ loading: false, error: null, creditCard:  virtualCreditCard.data});
        return true
      } catch (err: any) { 
        set({ loading: false, error: err || { message: 'Erro na solicitacao', levelError: LevelError.high } });
        return false
      }
    },
    creditCardToggleBlocked: async (account: string, isBlocked: boolean) => {
      set({ loading: true, error: null});
      try {
        const virtualCreditCard = await creditCardApi.creditcardToggleBlocked(account, isBlocked);
        set({ loading: false, error: null, creditCard:  virtualCreditCard.data});
        return true
      } catch (err: any) { 
        set({ loading: false, error: err || { message: 'Erro na solicitacao', levelError: LevelError.high } });
        return false
      }
    },
    getCreditCardsById: async (account: string): Promise<void> => {
      if(get().loading) return;
      set({ loading: true, error: null});
      try {
        var creditCard = await creditCardApi.getCreditCardsById(account);
        set({ loading: false, error: null, creditCard: creditCard.data });
      } catch (err: any) {
        set({ loading: false, error: err || { message: 'erro ao consultar seus cartoes', levelError: LevelError.high } });
      }
    }
  })
);