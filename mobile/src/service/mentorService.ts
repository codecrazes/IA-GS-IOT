import {
    fetchMentorExplicarTarefa,
    fetchMentorPlanoEstudo,
    fetchMentorRefinarResultado,
    MentorResponseApi,
    PlanoEstudoResponse,
    RefinarResultadoResponse,
  } from '@fetcher/mentorFetcher';
  
  type Ok<T> = { ok: true; data: T };
  type Fail = { ok: false; erroGeral?: string };
  
  export async function explicarTarefaService(
    descricao: string,
    contexto?: string,
    token?: string,
  ): Promise<Ok<MentorResponseApi> | Fail> {
    try {
      const data = await fetchMentorExplicarTarefa(descricao, contexto, token);
      return { ok: true, data };
    } catch (e: any) {
      console.log('MENTOR explicar-tarefa ERROR =====>');
      console.log(JSON.stringify(e?.response?.data || e, null, 2));
      const detail = e?.response?.data?.detail;
      return { ok: false, erroGeral: detail || 'Não foi possível falar com o mentor de IA.' };
    }
  }
  
  export async function planoEstudoService(
    objetivo: string,
    horasSemana: number,
  ): Promise<Ok<PlanoEstudoResponse> | Fail> {
    try {
      const data = await fetchMentorPlanoEstudo(objetivo, horasSemana);
      return { ok: true, data };
    } catch (e: any) {
      console.log('MENTOR plano-estudo ERROR =====>');
      console.log(JSON.stringify(e?.response?.data || e, null, 2));
      const detail = e?.response?.data?.detail;
      return { ok: false, erroGeral: detail || 'Não foi possível gerar o plano de estudo.' };
    }
  }
  
  export async function refinarResultadoService(
    tipo: string,
    textoInicial: string,
    tom: string,
    tamanho: string,
  ): Promise<Ok<RefinarResultadoResponse> | Fail> {
    try {
      const data = await fetchMentorRefinarResultado(tipo, textoInicial, tom, tamanho);
      return { ok: true, data };
    } catch (e: any) {
      console.log('MENTOR refinar-resultado ERROR =====>');
      console.log(JSON.stringify(e?.response?.data || e, null, 2));
      const detail = e?.response?.data?.detail;
      return { ok: false, erroGeral: detail || 'Não foi possível refinar o texto.' };
    }
  }
  