import { httpClient } from '../services/api';
import type { LoginPayload } from '~/homePage/schema/loginSchema';
import type { ApiResponse } from '~/models/response/apiResponse'
import type { LoginResponse } from '~/models/response/loginResponse'
import type { Account } from '~/models/account'
import type { AccountRequest, InvestmentProfile } from 'types'
import type { RegisterKeyPix } from '~/models/request/registerKeyPix'

 const baseUrl = import.meta.env.VITE_API_URL_ACCOUNT

 const loginUrl = baseUrl + 'account/sign-account'
 const getAccount = baseUrl + 'account/get-account-by-id'
 const setDarkMode = baseUrl + 'account/set-dark-mode'
 const registerUrl = baseUrl + 'account/create-account'
 const editAccount = baseUrl + 'account/edit-account'
 const registerKey = baseUrl + 'account/register-key-account'
 const deleteKey = baseUrl + 'account/delete-key-account'
 const registerPasswordTransaction = baseUrl + 'account/register-password-transaction'
 const saveInvestmentProfile = baseUrl + 'account/save-investment-profile'

export const accountApi = {
  login: (payload: LoginPayload) => httpClient.post<LoginResponse, LoginPayload>(loginUrl, payload),
  register: (payload: RegisterRequest) => httpClient.post<LoginResponse, RegisterRequest>(registerUrl, payload),
  editAccount: (accountId: string, payload: AccountRequest) => httpClient.put<Account, AccountRequest>(editAccount + '/' + accountId, payload),
  getAccount: (accountId: string) => httpClient.get<Account>(`${getAccount}/${accountId}`),
  deleteKey: (accountId: string) => httpClient.deleted<string, string>(`${deleteKey}/${accountId}`),
  registerKey: (request: RegisterKeyPix) => httpClient.post<string, RegisterKeyPix>(registerKey, request),
  saveInvestmentProfile: (accountId: string, request: InvestmentProfile) => httpClient.post<string, InvestmentProfile>(saveInvestmentProfile + '/' + accountId, request),
  setModeDark: (accountId: string, darkMode: boolean) => httpClient.put<string, boolean>(`${setDarkMode}/${accountId}?darkMode=${darkMode}`, darkMode),
  registerPasswordTransaction: (accountId: string, passwordTransaction: string) => httpClient.put<string, string>(`${registerPasswordTransaction}/${accountId}?passwordTransaction=${passwordTransaction}`, passwordTransaction),
};