import { create } from 'zustand';
import { eventApi } from '../services/eventApi'
import { type ErrorApi } from '~/models/response/errorResponse'
import type { EventMessage } from '~/models/eventMessage'

// Tipagem do estado de autenticação
interface EventState {
  events: EventMessage[];
  lastTransactions: EventMessage[];
  loadingEvents: boolean;
  loadingTransactions: boolean;
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
      loadingEvents: false,
      loadingTransactions: false,
      error: null,
      isAlready: false,
      getEventTransactions: async (accountId: string, limit: number) => {
        if(get().loadingTransactions) return;
        set({ loadingTransactions: true, error: null });
        try {
          const response = await eventApi.eventTransactions(accountId, limit);
          set({ loadingTransactions: false, lastTransactions: response.data, isAlready: true});
        } catch (err: any) {
          set({ loadingTransactions: false, error: err.message || 'Falha ao carregar ultimos eventos' });
        }
      },
      listEvents: async (accountId: string, limit: number) => {
        if(get().loadingEvents) return;
        set({ loadingEvents: true, error: null });
        try {
          const response = await eventApi.listEvents(accountId, limit);
          set({ loadingEvents: false, events: response.data});
        } catch (err: any) {
          set({ loadingEvents: false, error: err.message || 'Falha ao carregar ultimos eventos' });
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
        }
      },
      deleteAllById: async (accountId: string) => {
        try {
          const response = eventApi.deleteAllById(accountId)
          set({ events: [] });
        }catch(err) {
        }
      }
    })
);