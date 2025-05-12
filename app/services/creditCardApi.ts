import type { CreditCard } from "~/models/creditCard"
import { httpClient } from "./api"

const creditCardUrl = import.meta.env.VITE_API_URL_CARD

const requestCreditCard = creditCardUrl + 'creditCard/request-creditcard/'
const requestVirtualCreditCard = creditCardUrl + 'creditCard/request-virtual-creditcard/'
const virtualCreditCardDelete = creditCardUrl + 'creditCard/virtual-creditcard-delete/'
const creditCardToggleBlocked = creditCardUrl + 'creditCard/creditcard-toggle-blocked/'
const getCreditCardsById = creditCardUrl + 'creditCard/list-credicard-by-id/'

export const creditCardApi = {
  requestCreditCard: (accountId: string, limit: number) => httpClient.get<CreditCard>(requestCreditCard + accountId + '?limit=' + limit),
  requestVirtualCreditCard: (id: string) => httpClient.get<CreditCard>(requestVirtualCreditCard + id),
  getCreditCardsById: (accountId: string) => httpClient.get<CreditCard>(getCreditCardsById + accountId),
  creditcardToggleBlocked: (id: string, isBlocked: boolean) => httpClient.put<CreditCard, boolean>(creditCardToggleBlocked + id + '?isBlocked=' + isBlocked, isBlocked),
  virtualCreditCardDelete: (id: string) => httpClient.deleted<CreditCard, boolean>(virtualCreditCardDelete + id),
};