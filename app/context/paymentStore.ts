import type { ResponseStore } from 'types'
import { create } from 'zustand';
import type { DepositFormData } from '~/homeApp/schema/depositBilletsScheme'
import type { Billet } from '~/models/response/billetResponse'
import { type ErrorApi } from '~/models/response/errorResponse'
import { paymentApi } from '~/services/paymentApi'

// Tipagem do estado de autenticação
interface PaymentState {
  billet: Billet
  loading: boolean;
  error: ErrorApi | null
  directDeposit: (deposit: DepositFormData) => Promise<ResponseStore>;
  generateBillet: (deposit: DepositFormData) => Promise<ResponseStore>;
  getBillet: (billetCode: string) => Promise<boolean>;
}
// Criação da store com persistência
export const usePaymentStore = create<PaymentState>()(
  set => ({
      billet: null,
      message: null,
      loading: false,
      error: null,
      code: null,
      directDeposit: async (deposit: DepositFormData) : Promise<ResponseStore> => {
        try {
          set({ loading: true, error: null });
          const response = await paymentApi.directDeposit(deposit);
          set({ loading: false});
          return { message: response.data, success: true} as ResponseStore;
        } catch (err: any) {
          set({ loading: false });
          return { message: err.message, success: false} as ResponseStore;
        }
      },
      generateBillet: async (deposit: DepositFormData) => {
        try {
          set({ loading: true });
          const response = await paymentApi.generateBillet(deposit);
          return { message: response.data, success: true} as ResponseStore;
        } catch (err: any) {
          set({ loading: false});
          return { message: err.message, success: false} as ResponseStore;
        }
      },
      getBillet: async (codeGenerate: string) => {
        try {
          set({ loading: true, error: null });
          const response = await paymentApi.getBillet(codeGenerate);
          set({ billet: response.data, loading: false});
          return true;
        } catch (err: any) {
          set({ error: err, loading: false});
          return false
        }
      }
    })
);