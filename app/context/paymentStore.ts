import { create } from 'zustand';
import type { DepositFormData } from '~/homeApp/schema/depositBilletsScheme'
import { paymentApi } from '~/services/paymentService'
import type { ErrorApi, ResponseStore } from '~/types/api'
import type { Billet, DepositBillet } from '~/types/transaction'

// Tipagem do estado de autenticação
interface PaymentState {
  message: string
  billet: Billet
  loading: boolean;
  error: ErrorApi | null
  directDeposit: (deposit: DepositFormData) => Promise<ResponseStore>;
  generateBillet: (deposit: DepositFormData) => Promise<ResponseStore>;
  getBillet: (billetCode: string) => Promise<boolean>;
  depositBillet: (billet: DepositBillet) => Promise<boolean>;
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
          return { message: response.data, success: true,} as ResponseStore;
        } catch (err: any) {
          set({ loading: false });
          return { message: err.message, success: false} as ResponseStore;
        }
      },
      generateBillet: async (deposit: DepositFormData) => {
        try {
          set({ loading: true });
          const response = await paymentApi.generateBillet(deposit);
          set({ loading: false });
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
      },
      depositBillet: async (billet: DepositBillet) => {
        try {
          set({ loading: true, error: null });
          const response = await paymentApi.depositBillet(billet);
          set({ loading: false, message: response.data });
          return true;
        } catch (err: any) {
          set({ error: err, loading: false});
          return false
        }
      }
    })
);