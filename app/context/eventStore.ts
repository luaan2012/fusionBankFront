import { create } from 'zustand';
import { eventApi } from '../services/eventApi'
import { type ErrorApi } from '~/models/response/errorResponse'
import type { EventMessage } from '~/models/eventMessage'

// Tipagem do estado de autenticação
interface EventState {
  events: EventMessage[];
  lastTransactions: EventMessage[];
  loading: boolean;
  isAlready: boolean
  error: ErrorApi | null
  getEventTransactions: (accountId: string, limit: number ) => void;
  listEvents: (accountId: string, limit: number) => void;
  updateEvents: (event: EventMessage) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteAllById: (accountId: string) => void;
}
// Criação da store com persistência
export const useEventStore = create<EventState>()(
  (set, get) => ({
      events: [],
      lastTransactions: [],
      loading: false,
      error: null,
      isAlready: false,
      getEventTransactions: async (accountId: string, limit: number) => {
        if (get().loading) return; 
        set({ loading: true, error: null });
        try {
          const response = await eventApi.eventTransactions(accountId, limit);
          set({ loading: false, lastTransactions: response.data, isAlready: true});
        } catch (err: any) {
          set({ loading: false, error: err.message || 'Falha ao carregar ultimos eventos' });
        }
      },
      listEvents: async (accountId: string, limit: number) => {
        if (get().loading) return; 
        set({ loading: true, error: null });
        try {
          const response = await eventApi.listEvents(accountId, limit);
          set({ loading: false, events: response.data});
        } catch (err: any) {
          set({ loading: false, error: err.message || 'Falha ao carregar ultimos eventos' });
        }
      },
      updateEvents: async (newEvent: EventMessage) => {
        const currentEvents = get().events || [];
        set({ events: [newEvent, ...currentEvents] });
      },
      markAsRead: async (id: string) => {
        try {
          await eventApi.markAsRead(id);
          const currentEvents = get().events || [];
          const updatedEvents = currentEvents.map((event) => {
          if (event.eventId === id) {
            return {...event, read: true}
          }
          return event
        })
          set({ events: updatedEvents });
          return true
        } catch(err) {
          set({ loading: false, error: err || 'Falha ao carregar ultimos eventos' });
        }
      },
      markAllAsRead: async () => {
        try {
          const currentEvents = get().events || [];
          const eventsToRead = currentEvents.filter(e => !e.read).map(d => d.eventId);
          await eventApi.markAllAsRead(eventsToRead);

          const updatedEvents = currentEvents.filter(e => !e.read).map((event) => {
            return {...event, read: true}
          })
          
          set({ events: updatedEvents });
        }catch(err) {
          set({ loading: false, error: err || 'Falha ao carregar ultimos eventos'})
        }
      },
      deleteAllById: async (accountId: string) => {
        try {
          const response = eventApi.deleteAllById(accountId)
          set({ events: [] });
        }catch(err) {
          set({ loading: false, error: err || 'Falha ao carregar ultimos eventos'})
        }
      }
    })
);