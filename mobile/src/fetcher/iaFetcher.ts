import { apiHttp, authHeaders } from './http';
import { IaApi } from '@model/ia';

type EcoRankingResponse = {
  eco_ranking: Array<{
    id: string;
    nome: string;
    descricao?: string | null;
    tipo?: string | null;
    eco_score?: number | null;
  }>;
};

export async function fetchListIas(token?: string): Promise<IaApi[]> {
  const { data } = await apiHttp.get<EcoRankingResponse>('/ias/eco-ranking', {
    headers: authHeaders(token),
  });

  const list = data?.eco_ranking ?? [];

  return list.map((ia, index) => ({
    id: index, // ou mapeia pra número se quiser
    nome: ia.nome,
    descricao: ia.descricao ?? 'IA do backend GS (eco-ranking)',
    tipo: ia.tipo ?? 'chat',
    ecoScore: typeof ia.eco_score === 'number' ? ia.eco_score : null,
    avaliacoes: [],
  }));
}
