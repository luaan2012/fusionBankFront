import type { DepositFormData } from "~/homeApp/schema/depositBilletsScheme"
import { httpClient } from "./api"
import type { Billet } from "~/models/response/billetResponse"

const baseUrl = import.meta.env.VITE_API_URL_DEPOSIT

 const directDeposit = baseUrl + 'deposit/direct-deposit'
 const generateBillet = baseUrl + 'deposit/generate-billet'
 const getBillet = baseUrl + 'deposit/get-billet-by-id'


export const paymentApi = {
  directDeposit: (deposit: DepositFormData) => httpClient.post<string, DepositFormData>(directDeposit, deposit),
  generateBillet: (deposit: DepositFormData) => httpClient.post<string, DepositFormData>(generateBillet, deposit),
  getBillet: (billetCode: string) => httpClient.get<Billet>(getBillet + '/' + billetCode),
};