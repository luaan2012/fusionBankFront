import { boolean } from 'zod'
import { httpClient } from '../services/api';
import type { LoginPayload } from '~/homePage/schema/loginSchema';
import type { ApiResponse } from '~/models/response/apiResponse'
import type { LoginResponse } from '~/models/response/loginResponse'
import type { Account } from '~/models/account'

 const baseUrl = import.meta.env.VITE_API_URL_ACCOUNT

 const loginUrl = baseUrl + 'account/sign-account'
 const getAccount = baseUrl + 'account/get-account-by-id'
 const setDarkMode = baseUrl + 'account/set-dark-mode'
 const registerUrl = baseUrl + 'account/create-account'

export const accountApi = {
  login: (payload: LoginPayload) => httpClient.post<LoginResponse, LoginPayload>(loginUrl, payload),
  register: (payload: RegisterRequest) => httpClient.post<LoginResponse, RegisterRequest>(registerUrl, payload),
  getAccount: (accountId: string) => httpClient.get<Account>(`${getAccount}/${accountId}`),
  setModeDark: (accountId: string, darkMode: boolean) => httpClient.put<ApiResponse<string>, boolean>(`${setDarkMode}/${accountId}?darkMode=${darkMode}`, darkMode),
};