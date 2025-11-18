import { apiHttp, authHeaders } from './http';

// Explicar tarefa
export type MentorResponseApi = {
  ia_indicada: string;
  quando_usar: string;
  quando_evitar: string;
  passos_humano: string[];
  passos_com_ia: string[];
  dificuldade: 'baixa' | 'media' | 'alta';
  tempo_estimado_min: number;
  categoria?: string;
};

export async function fetchMentorExplicarTarefa(
  descricao: string,
  contexto?: string,
  token?: string,
): Promise<MentorResponseApi> {
  const { data } = await apiHttp.post<MentorResponseApi>(
    '/mentor/explicar-tarefa',
    { descricao, contexto },
    { headers: authHeaders(token) },
  );
  return data;
}

// Plano de estudo
export type PlanoEstudoResponse = {
  objetivo: string;
  duracao_semanas: number;
  semanas: Array<{
    semana: number;
    foco: string;
    temas: string[];
    tarefas: string[];
  }>;
};

export async function fetchMentorPlanoEstudo(
  objetivo: string,
  horasSemana: number,
): Promise<PlanoEstudoResponse> {
  const { data } = await apiHttp.post<PlanoEstudoResponse>(
    '/mentor/plano-estudo',
    { objetivo, horas_semana: horasSemana },
  );
  return data;
}

// Refinar resultado
export type RefinarResultadoResponse = {
  texto_refinado: string;
  explicacao_melhorias: string;
};

export async function fetchMentorRefinarResultado(
  tipo: string,
  textoInicial: string,
  tom: string,
  tamanho: string,
): Promise<RefinarResultadoResponse> {
  const { data } = await apiHttp.post<RefinarResultadoResponse>(
    '/mentor/refinar-resultado',
    {
      tipo,
      texto_inicial: textoInicial,
      tom,
      tamanho,
    },
  );
  return data;
}
