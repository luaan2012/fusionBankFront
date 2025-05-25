import type { Account } from "./account"

export interface ApiResponse<T> {
  data: T;
  error: ErrorApi;
  success: boolean;
}

export interface AxyosResponse<T> {
  data: ApiResponse<T>;
  status: number
}

export interface ErrorApi {
  message: string,
  levelError: LevelError
}

export enum LevelError {
  low = 1,
  medium,
  high
}

export interface LoginResponse
{
  account: Account,
  token: string
}

export interface ResponseStore {
  message: string,
  success: boolean
}