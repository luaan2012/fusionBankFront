import type { Investment } from '~/models/investment'
import { httpClient } from '../services/api';

 const baseUrl = import.meta.env.VITE_API_URL_INVESTMENT

 const listInvestmentHome = baseUrl + 'investment/list-investments'


export const investmentApi = {
  listInvestmentHome: (accountId: string, limit: number) => httpClient.get<Investment[]>(`${listInvestmentHome}/${accountId}?limit=${limit}`),
};