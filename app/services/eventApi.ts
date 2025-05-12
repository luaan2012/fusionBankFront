import { httpClient } from '../services/api';
import type { EventMessage } from '~/models/eventMessage'

 const baseUrl = import.meta.env.VITE_API_URL_EVENT

 const eventTransactions = baseUrl + 'event/list-last-transactions'
 const listEvents = baseUrl + 'event/list-events'

export const eventApi = {
  eventTransactions: (accountId: string, limit: number) => httpClient.get<EventMessage[]>(`${eventTransactions}/${accountId}?limit=${limit}`),
  listEvents: (accountId: string, limit: number) => httpClient.get<EventMessage[]>(`${listEvents}/${accountId}?limit=${limit}`),
};