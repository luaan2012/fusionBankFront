import { type Account } from './../models/account';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { accountApi } from '../services/accountApi';
import { type LoginPayload } from '../homePage/schema/loginSchema';
import { LevelError, type ErrorApi } from '~/models/response/errorResponse'

// Tipagem do estado de autenticação
interface AccountState {
  token: string | null;
  user: Account | null;
  loading: boolean;
  error: ErrorApi | null;
  setDarkMode: (darkMode: boolean) => void;
  updateUser: () => void;
  login: (credentials: LoginPayload) => Promise<boolean>;
  logout: () => void;
  // checkToken: () => Promise<boolean>;
}

// Função para verificar expiração do token (assumindo JWT)
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    return Date.now() >= expiry;
  } catch {
    return true;
  }
};

// Criação da store com persistência
export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      setDarkMode: async (darkMode: boolean) => {
        const { user } = get(); // CORREÇÃO: pegar user do estado atual
        if (!user) {
          set({ error: { message: 'Usuário não autenticado', levelError: LevelError.high }, loading: false});
          return;
        }
        set({ loading: true, error: null });

        try {
          await accountApi.setModeDark(user.accountId, darkMode);
          set({
            loading: false,
            user: { ...user, darkMode }, // Atualiza com o novo valor
          });
        } catch (err: any) {
          set({
            loading: false,
            error: { message: err.response?.data?.message || err.message || 'Erro ao atualizar dark mode', levelError: LevelError.high },
          });
        }
      },
      updateUser: async () => {
        const { user } = get(); // CORREÇÃO: pegar user do estado atual
        if (!user) {
          set({ error: { message: 'Usuário não autenticado', levelError: LevelError.high }, loading: false});
          return;
        }        
        set({
          user: { ...user }, // Atualiza com o novo valor
        });

      },
      login: async credentials => {
        set({ loading: true, error: null });
        try {
          const response = await accountApi.login(credentials);
          set({ loading: false, token: response.data.token, user: response.data.account });
          return true;
        } catch (err: any) {
          set({ loading: false, error: err.message || 'Falha no login' });
          return false
          // throw err;
        }
      },
      logout: () => set({ token: null, user: null, error: null, loading: false }),
      // checkToken: async () => {
      //   const state = useAuthStore.getState();
      //   if (!state.token || isTokenExpired(state.token)) {
      //     set({ token: null, user: null, error: 'Sessão expirada', loading: false });
      //     return false;
      //   }
      //   set({ loading: true });
      //   try {
      //     await httpClient.get<{ user: { id: string; email: string } }>('/auth/me');
      //     set({ loading: false });
      //     return true;
      //   } catch {
      //     set({ token: null, user: null, error: 'Sessão inválida', loading: false });
      //     return false;
      //   }
      // },
    }),
    {
      name: 'account-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);