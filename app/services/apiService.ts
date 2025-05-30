import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { useAccountStore } from '~/context/accountStore'
import { LevelError, type ApiResponse, type AxyosResponse, type ErrorApi } from '~/types/api'


const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 60000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const { token } = useAccountStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Função genérica para GET
async function get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxyosResponse<T> = await api.get(url, config);
    return response.data
  } catch (error) {
    throw handleError(error);
  }
}

// Função genérica para POST
async function post<T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxyosResponse<T> = await api.post(url, data, config);
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
}

async function put<T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxyosResponse<T> = await api.put(url, data, config);
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
}

async function deleted<T, D>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxyosResponse<T> = await api.delete(url, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

function handleError(error: any): ErrorApi {
  if (axios.isAxiosError(error)) {
    const apiError: ErrorApi = {
      message: error.response?.data?.error?.message || 'Erro desconhecido',
      levelError: error.response?.data?.error?.levelError ?? LevelError.low,
    };

    return apiError;
  }

  return {
    message: 'Erro inesperado',
    levelError: LevelError.high,
  };
}

// Exporta métodos disponíveis
export const httpClient = {
  get,
  post,
  put,
  deleted
}