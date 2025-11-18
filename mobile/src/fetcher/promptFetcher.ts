import { PromptApi, PromptInput } from '@model/prompt';
import { apiHttp, authHeaders } from './http';
import axios from 'axios';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string;
  body?: unknown;
};

type RawResponse<T> = {
  status: number;
  data: T | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<RawResponse<T>> {
  try {
    const res = await apiHttp.request<T>({
      url: path,
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(options.token),
      },
      data: options.body ?? undefined,
    });

    return {
      status: res.status,
      data: (res.data as T) ?? null,
    };
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) {
      return {
        status: err.response.status,
        data: (err.response.data as T) ?? null,
      };
    }
    return {
      status: 0,
      data: null,
    };
  }
}

export async function fetchPrompts(token?: string) {
  return request<PromptApi[]>('/prompts', { token });
}

export async function fetchCreatePrompt(body: PromptInput, token?: string) {
  return request<PromptApi>('/prompts', { method: 'POST', token, body });
}

export async function fetchUpdatePrompt(id: number, body: PromptInput, token?: string) {
  return request<PromptApi>(`/prompts/${id}`, { method: 'PUT', token, body });
}

export async function fetchDeletePrompt(id: number, token?: string) {
  return request<null>(`/prompts/${id}`, { method: 'DELETE', token });
}
