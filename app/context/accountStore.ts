import { type Account } from './../models/account';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { accountApi } from '../services/accountApi';
import { type LoginPayload } from '../homePage/schema/loginSchema';
import { LevelError, type ErrorApi } from '~/models/response/errorResponse';
import type { AccountRequest } from 'types';
import type { RegisterKeyPix } from '~/models/request/registerKeyPix';

// Tipagem do estado de autenticação
interface AccountState {
  token: string | null;
  user: Account | null;
  tokenExpiry: number | null; // Novo campo para o tempo de expiração
  loading: boolean;
  clickedLogout: boolean;
  error: ErrorApi | null;
  sessionExpiredMessage: string | null;
  setDarkMode: (darkMode: boolean) => void;
  registerPasswordTransaction: (passwordTransaction: string) => Promise<boolean>;
  updateUser: () => void;
  updateLocalUser: (field: string, value: any) => void;
  login: (credentials: LoginPayload) => Promise<boolean>;
  register: (credentials: RegisterRequest) => Promise<boolean>;
  editAccount: (accountId: string, credentials: AccountRequest) => Promise<boolean>;
  registerKey: (request: RegisterKeyPix) => Promise<boolean>;
  deleteKey: () => Promise<boolean>;
  logout: () => void;
  checkToken: () => Promise<boolean>;
  setSessionExpired: (message: string) => void;
}

// Função para obter o tempo de expiração do token
const getTokenExpiry = (token: string | null): number | null => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Converte segundos para milissegundos
  } catch {
    return null;
  }
};

// Função para verificar expiração do token
const isTokenExpired = (token: string | null, tokenExpiry: number | null): boolean => {
  if (!token || !tokenExpiry) return true;
  return Date.now() >= tokenExpiry;
};

// Criação da store com persistência
export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      clickedLogout: false,
      tokenExpiry: null,
      loading: false,
      error: null,
      sessionExpiredMessage: null,
      setDarkMode: async (darkMode: boolean) => {
        const { user } = get();
        if (!user) {
          set({ error: { message: 'Usuário não autenticado', levelError: LevelError.high }, loading: false });
          return;
        }
        set({ loading: false, user: { ...user, darkMode } });
        try {
          await accountApi.setModeDark(user.accountId, darkMode);
        } catch (err: any) {
          set({ loading: false, error: err || { message: 'Falha ao atualizar modo escuro', levelError: LevelError.high } });
        }
      },
      registerPasswordTransaction: async (passwordTransaction: string) => {
        const { user } = get();
        if (!user) {
          set({ error: { message: 'Usuário não autenticado', levelError: LevelError.high }, loading: false });
          return false;
        }
        try {
          await accountApi.registerPasswordTransaction(user.accountId, passwordTransaction);
          set({ loading: false, user: { ...user, passwordTransaction } });
          return true;
        } catch (err: any) {
          set({ loading: false, error: err || { message: 'Falha ao registrar senha de transação', levelError: LevelError.high } });
          return false;
        }
      },
      updateUser: async () => {
        try {
          const { user } = get();
          const response = await accountApi.getAccount(user.accountId);
          set({ loading: false, user: response.data });
        } catch (err: any) {
          set({ loading: false, error: err.message || 'Falha ao atualizar usuário' });
        }
      },
      updateLocalUser: async (field: string, value: any) => {
        try {
          const { user } = get();
          set({ loading: false, user: { ...user, [field]: value } });
        } catch (err: any) {
          set({ loading: false, error: err.message || 'Falha ao atualizar o usuário' });
        }
      },
      registerKey: async (request: RegisterKeyPix) => {
        try {
          const { user } = get();
          const response = await accountApi.registerKey(request);
          set({ loading: false, user: { ...user, keyAccount: request.keyPix } });
          return true;
        } catch (err: any) {
          set({ loading: false, error: err.message || 'Falha ao cadastrar chave Pix' });
          return false;
        }
      },
      login: async (credentials) => {
        set({ loading: true, error: null, sessionExpiredMessage: null });
        try {
          const response = await accountApi.login(credentials);

          const token = response.data.token;
          const tokenExpiry = getTokenExpiry(token);
          set({
            loading: false,
            token,
            user: response.data.account,
            tokenExpiry,
          });
          return true;
        } catch (err: any) {
          set({ loading: false, error: err || { message: 'Falha no login', levelError: LevelError.high } });
          return false;
        }
      },
      register: async (credentials) => {
        set({ loading: true, error: null, sessionExpiredMessage: null });
        try {
          const response = await accountApi.register(credentials);
          const token = response.data.token;
          const tokenExpiry = getTokenExpiry(token);
          set({
            loading: false,
            token,
            user: response.data.account,
            tokenExpiry,
          });
          return true;
        } catch (err: any) {
          set({ loading: false, error: err || { message: 'Falha ao cadastrar', levelError: LevelError.high } });
          return false;
        }
      },
      editAccount: async (accountId: string, accountRequest: AccountRequest) => {
        set({ loading: true, error: null, sessionExpiredMessage: null });
        try {
          const response = await accountApi.editAccount(accountId, accountRequest);
          set({ loading: false, user: response.data });
          return true;
        } catch (err: any) {
          set({ loading: false, error: err || { message: 'Falha ao editar conta', levelError: LevelError.high } });
          return false;
        }
      },
      deleteKey: async () => {
        const { user } = get();
        set({ loading: true, error: null, sessionExpiredMessage: null });
        try {
          await accountApi.deleteKey(user.accountId);
          set({ loading: false, user: { ...user, keyAccount: '' } });
          return true;
        } catch (err: any) {
          set({ loading: false, error: err || { message: 'Falha ao deletar chave Pix', levelError: LevelError.high } });
          return false;
        }
      },
      logout: () => {
        set({
          token: null,
          user: null,
          tokenExpiry: null,
          error: null,
          loading: false,
          clickedLogout: true,
          sessionExpiredMessage: null,
        });
      },
      checkToken: async () => {
        const { token, tokenExpiry } = get();
        if (!token || isTokenExpired(token, tokenExpiry)) {
          set({
            token: null,
            user: null,
            tokenExpiry: null,
            error: null,
            loading: false,
            sessionExpiredMessage: 'Sessão expirada, faça o login novamente',
          });
          return false;
        }
        return true
      },
      setSessionExpired: (message: string) => {
        set({
          token: null,
          user: null,
          tokenExpiry: null,
          error: null,
          loading: false,
          sessionExpiredMessage: message,
        });
      },
    }),
    {
      name: 'account-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        tokenExpiry: state.tokenExpiry,
      })
    }
  )
);