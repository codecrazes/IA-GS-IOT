import { apiHttp, authHeaders } from './http';

// IAs mais usadas pelo usuário / geral
export type IaMaisUsada = {
  ia_id: string;
  nome: string;
  usos: number;
  eco_score?: number | null;
};

export type IasMaisUsadasResponse = {
  ias: IaMaisUsada[];
};

// Consumo eco do usuário
export type EcoConsumoUsuarioResponse = {
  usuario_id: string;
  total_chamadas: number;
  kwh_estimado: number;
  co2_estimado_kg: number;
  ia_mais_utilizada?: string | null;
  nivel_consumo?: 'baixo' | 'moderado' | 'alto';
};

// Resumo textual do uso da IA (mentor)
export type ResumoUsoIaResponse = {
  destaque: string;
  texto_resumo: string;
  recomendacoes: string[];
};

export async function fetchIasMaisUsadas(
  token?: string,
): Promise<IasMaisUsadasResponse> {
  const { data } = await apiHttp.get<IasMaisUsadasResponse>(
    '/analytics/ias-mais-usadas',
    { headers: authHeaders(token) },
  );
  return data;
}

export async function fetchEcoConsumoUsuario(
  usuarioId: string,
  token?: string,
): Promise<EcoConsumoUsuarioResponse> {
  const { data } = await apiHttp.get<EcoConsumoUsuarioResponse>(
    `/analytics/eco/consumo-usuario/${usuarioId}`,
    { headers: authHeaders(token) },
  );
  return data;
}

export async function fetchResumoUsoIa(
  usuarioId: string,
  token?: string,
): Promise<ResumoUsoIaResponse> {
  const { data } = await apiHttp.get<ResumoUsoIaResponse>(
    `/mentor/resumo-uso-ia`,
    {
      params: { usuario_id: usuarioId },
      headers: authHeaders(token),
    },
  );
  return data;
}
