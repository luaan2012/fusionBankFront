import type { DepositFormData } from "~/homeApp/schema/depositBilletsScheme"
import type { Billet, DepositBillet } from "~/types/transaction"
import { httpClient } from "./apiService"

const baseUrl = import.meta.env.VITE_API_URL_DEPOSIT

 const directDeposit = baseUrl + 'deposit/direct-deposit'
 const generateBillet = baseUrl + 'deposit/generate-billet'
 const getBillet = baseUrl + 'deposit/get-billet-by-id'
 const depositBillet = baseUrl + 'deposit/deposit-billet'


export const paymentApi = {
  directDeposit: (deposit: DepositFormData) => httpClient.post<string, DepositFormData>(directDeposit, deposit),
  generateBillet: (deposit: DepositFormData) => httpClient.post<string, DepositFormData>(generateBillet, deposit),
  getBillet: (billetCode: string) => httpClient.get<Billet>(getBillet + '/' + billetCode),
  depositBillet: (billet: DepositBillet) => httpClient.post<string, DepositBillet>(depositBillet, billet),
};