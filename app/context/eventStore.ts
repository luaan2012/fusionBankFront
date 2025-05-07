import { create } from 'zustand';
import { eventApi } from '../services/eventApi'
import type { EventMessage } from '~/models/eventMessage'
import { type ErrorApi } from '~/models/response/errorResponse'

// Tipagem do estado de autenticação
interface EventState {
  event: EventMessage[] | null;
  loading: boolean;
  error: ErrorApi | null
  getEventsHome: (accountId: string, limit: number) => void;
}
// Criação da store com persistência
export const useEventStore = create<EventState>()(
  set => ({
      event: null,
      loading: false,
      error: null,
      getEventsHome: async (accountId: string, limit: number) => {
        set({ loading: true, error: null });
        try {
          const response = await eventApi.listEvent(accountId, limit);
          set({ loading: false, event: response.data });
        } catch (err: any) {
          set({ loading: false, error: err.message || 'Falha ao carregar ultimos eventos' });
        }
      }
    })
);