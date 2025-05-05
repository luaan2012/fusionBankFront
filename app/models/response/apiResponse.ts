import type { ErrorApi } from "./errorResponse"

export interface ApiResponse<T> {
  data: T;
  error: ErrorApi;
  success: boolean;
}

export interface AxyosResponse<T> {
  data: ApiResponse<T>;
  status: number
}