import type { Bank } from "~/types/bank"
import { httpClient } from "./apiService"

const baseUrl = import.meta.env.VITE_API_URL_BANK

const bankList = baseUrl + 'centralBank/list-all-banks'

export const bankApi = {
  listBanks: () => httpClient.get<Bank[]>(bankList),
};