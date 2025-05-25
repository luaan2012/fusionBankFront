import type { EventMessage } from "~/types/notification"
import { httpClient } from "./apiService"

 const baseUrl = import.meta.env.VITE_API_URL_EVENT

 const eventTransactions = baseUrl + 'event/list-last-transactions'
 const listEvents = baseUrl + 'event/list-events'
 const markAsRead = baseUrl + 'event/mark-ready'
 const markAllAsRead = baseUrl + 'event/mark-all-ready'
 const deleteAllById = baseUrl + 'event/delete-all-by-id'

export const eventApi = {
  eventTransactions: (accountId: string, limit: number) => httpClient.get<EventMessage[]>(`${eventTransactions}/${accountId}?limit=${limit}`),
  listEvents: (accountId: string, limit: number) => httpClient.get<EventMessage[]>(`${listEvents}/${accountId}?limit=${limit}`),
  markAsRead: (eventId: string) => httpClient.put<string, string>(`${markAsRead}/${eventId}`, eventId),
  markAllAsRead: (eventIds: string[]) => httpClient.put<string, string[]>(`${markAllAsRead}/${eventIds}`, eventIds),
  deleteAllById: (accountId: string) => httpClient.deleted<string, string[]>(`${deleteAllById}/${accountId}`)
};