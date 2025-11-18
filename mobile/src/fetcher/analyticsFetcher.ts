// src/fetcher/analyticsFetcher.ts
import { apiHttp } from './http';

export async function fetchIasMaisUsadas() {
  const { data } = await apiHttp.get<{ top: any[] }>('/analytics/ias-mais-usadas');
  return data?.top ?? [];
}

export async function fetchConsumoEcoUsuario(usuarioId: string) {
  const { data } = await apiHttp.get('/analytics/eco/consumo-usuario/' + usuarioId);
  return data;
}
