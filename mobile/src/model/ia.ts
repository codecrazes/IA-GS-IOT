import { UsuarioApi } from '@model/usuario';

export type IaApiAvaliacao = {
  id?: number;
  nota: number;
  comentario?: string | null;
  data: string;
  usuario: UsuarioApi;
};

export type IaApi = {
  id: number;
  nome: string;
  descricao: string;
  tipo?: string | null;
  ecoScore?: number | null;
  avaliacoes?: IaApiAvaliacao[] | null;
};

export type IaCategory = 'chat' | 'code' | 'image' | 'audio' | 'assistant' | 'other';

export type IaRankingItem = {
  id: number;
  name: string;
  description: string;
  category: IaCategory;
  rawType: string | null;
  ecoScore: number;
  averageScore: number;
  score0to10: number;
  totalRatings: number;
  emoji: string;
};

export type IaRankingViewItem = IaRankingItem & {
  rank: number;
};

const TYPE_CONFIG: Record<string, { category: IaCategory; emoji: string }> = {
  chat: { category: 'chat', emoji: '🤖' },
  texto: { category: 'chat', emoji: '🤖' },
  estudos: { category: 'chat', emoji: '📚' },
  estudo: { category: 'chat', emoji: '📚' },
  code: { category: 'code', emoji: '💻' },
  codigo: { category: 'code', emoji: '💻' },
  programação: { category: 'code', emoji: '💻' },
  image: { category: 'image', emoji: '🎨' },
  imagem: { category: 'image', emoji: '🎨' },
  imagens: { category: 'image', emoji: '🎨' },
  audio: { category: 'audio', emoji: '🎧' },
  áudio: { category: 'audio', emoji: '🎧' },
  voz: { category: 'audio', emoji: '🎧' },
  assistant: { category: 'assistant', emoji: '🧩' },
  assistente: { category: 'assistant', emoji: '🧩' },
};

export function mapIaToRankingItem(api: IaApi): IaRankingItem {
  const rawType = api.tipo?.toLowerCase().trim() || null;
  const cfg = (rawType && TYPE_CONFIG[rawType]) || {
    category: 'other' as IaCategory,
    emoji: '🤖',
  };
  const avaliacoes = api.avaliacoes || [];
  const notas = avaliacoes
    .map(a => a.nota)
    .filter(n => typeof n === 'number' && !Number.isNaN(n));
  let averageScore = 0;
  if (notas.length > 0) {
    averageScore = notas.reduce((sum, n) => sum + n, 0) / notas.length;
  } else if (typeof api.ecoScore === 'number') {
    averageScore = api.ecoScore;
  }
  const clamped = Math.max(0, Math.min(10, averageScore));
  const score0to10 = Math.round(clamped);
  return {
    id: api.id,
    name: api.nome,
    description: api.descricao,
    category: cfg.category,
    rawType,
    ecoScore: typeof api.ecoScore === 'number' ? api.ecoScore : 0,
    averageScore,
    score0to10,
    totalRatings: notas.length,
    emoji: cfg.emoji,
  };
}
