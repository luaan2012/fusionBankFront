import type { InvestmentRequest, Investment, AvailableInvestment } from "~/types/investment"
import { httpClient } from "./apiService"

 const baseUrl = import.meta.env.VITE_API_URL_INVESTMENT

 const createInvest = baseUrl + 'investment/create-invest'
 const handleInvestment = baseUrl + 'investment/handle-investment'
 const listInvestments = baseUrl + 'investment/list-investments'
 const availableInvestments = baseUrl + 'investment/available-investments'
 const rescueInvestment = baseUrl + 'investment/rescue-investment'


export const investmentApi = {
  createInvest: (investment: InvestmentRequest) => httpClient.post<string, InvestmentRequest>(createInvest, investment),
  handleInvestment: (accountId: string, investmentId: string, amount: number) => httpClient.put<string, string>(`${handleInvestment}?accountId=${accountId}&investmentId=${investmentId}&amount=${amount}`, accountId),
  rescueInvestment: (accountId: string, investmentId: string, amount: number) => httpClient.put<string, string>(`${rescueInvestment}/${accountId}?investmentId=${investmentId}&amount=${amount}`, accountId),
  listInvestments: (accountId: string, limit: number) => httpClient.get<Investment[]>(`${listInvestments}/${accountId}?limit=${limit}`),
  availableInvestments: (accountId: string) => httpClient.get<AvailableInvestment[]>(availableInvestments + "?accountId=" + accountId),
};