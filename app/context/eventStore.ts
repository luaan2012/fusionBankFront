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
    })
);