import { TarefaApi, TarefaInput } from '@model/tarefa';
import { RecomendacaoApi } from '@model/recomendacao';
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

export async function fetchListTarefas(token?: string) {
  return request<TarefaApi[]>('/tarefas', { token });
}

export async function fetchCreateTarefa(body: TarefaInput, token?: string) {
  return request<TarefaApi>('/tarefas', { method: 'POST', token, body });
}

export async function fetchGerarRecomendacao(tarefaId: number, token?: string) {
  return request<RecomendacaoApi>(`/recomendacoes/gerar/${tarefaId}`, {
    method: 'POST',
    token,
  });
}
