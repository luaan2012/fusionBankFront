import { type Account } from './../account';
export interface LoginResponse
{
  account: Account,
  token: string
}