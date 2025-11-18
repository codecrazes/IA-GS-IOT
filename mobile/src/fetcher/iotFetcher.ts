// src/fetcher/iotFetcher.ts
import { apiHttp } from './http';

export async function fetchContextoAtual(usuarioId: string) {
  const { data } = await apiHttp.get('/contexto/atual', {
    params: { usuario_id: usuarioId },
  });
  return data;
}
