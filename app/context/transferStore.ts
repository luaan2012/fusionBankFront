import { create } from 'zustand';
import type { TransferFormData } from '~/homeApp/schema/transferScheme'
import { type ErrorApi } from '~/models/response/errorResponse'
import { transferApi } from '~/services/transferApi'

// Tipagem do estado de autenticação
interface TransferState {
  message: string;
  loading: boolean;
  error: ErrorApi | null
  createTransfer: (transfer: TransferFormData) => Promise<boolean>;
}
// Criação da store com persistência
export const useTransferStore = create<TransferState>()(
  set => ({
      message: null,
      loading: false,
      error: null,
      createTransfer: async (transfer: TransferFormData) => {
        try {
          set({ loading: true, error: null });
          const response = await transferApi.createTransfer(transfer);
          set({ loading: false, message: response.data });
          return true;
        } catch (err: any) {
          set({ loading: false, error: err || 'Falha ao realizar a transferência' });
          return false
        }
      }
    })
);