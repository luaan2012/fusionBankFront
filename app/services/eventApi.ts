import { httpClient } from '../services/api';
import type { EventMessage } from '~/models/eventMessage'

 const baseUrl = import.meta.env.VITE_API_URL_EVENT

 const listEvents = baseUrl + 'event/list-last-transactions'

export const eventApi = {
  listEvent: (accountId: string, limit: number) => httpClient.get<EventMessage[]>(`${listEvents}/${accountId}?limit=${limit}`),
};