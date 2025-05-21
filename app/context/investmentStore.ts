import { create } from 'zustand';
import type { AvailableInvestment } from 'types';
import type { Investment } from '~/models/investment';
import type { InvestmentRequest } from '~/models/request/investmentRequest';
import type { ErrorApi } from '~/models/response/errorResponse';
import { investmentApi } from '~/services/investmentApi';

interface InvestmentState {
  investment: Investment[];
  availableInvestment: AvailableInvestment[];
  loadingInvestment: boolean;
  loadingBuying: boolean;
  isAlreadyInvestments: boolean;
  isAlreadyAvailable: boolean;
  error: ErrorApi | string | null;
  createInvest: (investment: InvestmentRequest) => Promise<boolean>;
  handleInvestment: (accountId: string, investmentId: string, amount: number) => Promise<boolean>;
  rescueInvestment: (accountId: string, investmentId: string, amount: number) => Promise<boolean>;
  listInvestmentsUser: (accountId: string, limit: number) => Promise<boolean>;
  availableInvestments: (accountId?: string) => Promise<boolean>;
}

export const useInvestmentStore = create<InvestmentState>()((set, get) => ({
  investment: [],
  availableInvestment: [],
  loadingBuying: false,
  loadingInvestment: false,
  isAlreadyInvestments: false,
  isAlreadyAvailable: false,
  error: null,

  createInvest: async (investment) => {
    if (get().loadingBuying) return false;

    set({ loadingBuying: true, error: null });

    try {
      await investmentApi.createInvest(investment);
      set({ loadingBuying: false });
      return true;
    } catch (err: any) {
      set({ loadingBuying: false, error: err?.message || 'Falha ao criar investimento' });
      return false;
    }
  },
  handleInvestment: async (accountId, investmentId, amount) => {
    if (get().loadingBuying) return false;

    set({ loadingBuying: true, error: null });

    try {
      await investmentApi.handleInvestment(accountId, investmentId, amount);
      set({ loadingBuying: false });
      return true;
    } catch (err: any) {
      set({ loadingBuying: false, error: err?.message || 'Falha ao aplicar investimento' });
      return false;
    }
  },
  rescueInvestment: async (accountId, investmentId, amount) => {
    if (get().loadingBuying) return false;

    set({ loadingBuying: true, error: null });

    try {
      await investmentApi.rescueInvestment(accountId, investmentId, amount);
      set({ loadingBuying: false });
      return true;
    } catch (err: any) {
      set({ loadingBuying: false, error: err?.message || 'Falha ao aplicar investimento' });
      return false;
    }
  },
  listInvestmentsUser: async (accountId: string, limit: number) => {
    if (get().loadingInvestment) return false;
    set({ loadingInvestment: true, error: null });

    try {
      const response = await investmentApi.listInvestments(accountId, limit);
      set({ investment: response.data, loadingInvestment: false, isAlreadyInvestments: true });
      return true;
    } catch (err: any) {
      set({ loadingInvestment: false, error: err?.message || 'Falha ao listar investimentos do usuário' });
      return false;
    }
  },
  availableInvestments: async (accountId: string) => {
    if (get().loadingInvestment) return false;

    set({ loadingInvestment: true, error: null });

    try {
      const response = await investmentApi.availableInvestments(accountId);
      set({ availableInvestment: response.data, loadingInvestment: false, isAlreadyAvailable: true });
      return true;
    } catch (err: any) {
      set({ loadingInvestment: false, error: err?.message || 'Falha ao buscar investimentos disponíveis' });
      return false;
    }
  }
}));
