import type { TransferFormData } from '~/homeApp/schema/transferScheme'
import { httpClient } from '../services/api';

 const baseUrl = import.meta.env.VITE_API_URL_TRANSFER

 const createTransfer = baseUrl + 'transfer/create-transfer'

export const transferApi = {
  createTransfer: (transferRequest: TransferFormData) => httpClient.post<string, TransferFormData>(createTransfer, transferRequest),
};