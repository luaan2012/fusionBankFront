import type { CreditCard } from "~/models/creditCard"
import { httpClient } from "./api"

const creditCardUrl = import.meta.env.VITE_API_URL_CARD

const requestCreditCard = creditCardUrl + 'creditCard/request-creditcard/'
const getCreditCardsById = creditCardUrl + 'creditCard/list-credicards-by-id/'

export const creditCardApi = {
  requestCreditCard: (accountId: string) => httpClient.get<CreditCard[]>(requestCreditCard + accountId),
  getCreditCardsById: (accountId: string) => httpClient.get<CreditCard[]>(getCreditCardsById + accountId),
};