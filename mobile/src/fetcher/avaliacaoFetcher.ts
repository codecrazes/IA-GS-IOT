import { apiHttp, authHeaders } from './http';
import { AvaliacaoApi } from '@model/avaliacao';

export type AvaliacaoCreatePayload = {
  nota: number;
  comentario?: string | null;
  usuarioId: number;
  iaId: number;
};

export async function fetchCreateAvaliacao(
  token: string | undefined,
  body: AvaliacaoCreatePayload,
): Promise<AvaliacaoApi> {
  const { data } = await apiHttp.post<AvaliacaoApi>('/avaliacoes', body, {
    headers: authHeaders(token),
  });
  return data;
}
