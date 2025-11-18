import {
    fetchEcoConsumoUsuario,
    fetchIasMaisUsadas,
    fetchResumoUsoIa,
    EcoConsumoUsuarioResponse,
    IasMaisUsadasResponse,
    ResumoUsoIaResponse,
  } from '@fetcher/analyticsFetcher';
  
  type Ok<T> = { ok: true; data: T };
  type Fail = { ok: false; erroGeral?: string };
  
  export async function carregarIasMaisUsadas(
    token?: string,
  ): Promise<Ok<IasMaisUsadasResponse> | Fail> {
    try {
      const data = await fetchIasMaisUsadas(token);
      return { ok: true, data };
    } catch (e: any) {
      console.log('ANALYTICS ias-mais-usadas ERROR ====>');
      console.log(JSON.stringify(e?.response?.data || e, null, 2));
      const detail = e?.response?.data?.detail;
      return {
        ok: false,
        erroGeral: detail || 'Não foi possível carregar as IAs mais usadas.',
      };
    }
  }
  
  export async function carregarEcoConsumoUsuario(
    usuarioId: string,
    token?: string,
  ): Promise<Ok<EcoConsumoUsuarioResponse> | Fail> {
    try {
      const data = await fetchEcoConsumoUsuario(usuarioId, token);
      return { ok: true, data };
    } catch (e: any) {
      console.log('ANALYTICS eco-consumo ERROR ====>');
      console.log(JSON.stringify(e?.response?.data || e, null, 2));
      const detail = e?.response?.data?.detail;
      return {
        ok: false,
        erroGeral: detail || 'Não foi possível carregar o consumo ecológico.',
      };
    }
  }
  
  export async function carregarResumoUsoIa(
    usuarioId: string,
    token?: string,
  ): Promise<Ok<ResumoUsoIaResponse> | Fail> {
    try {
      const data = await fetchResumoUsoIa(usuarioId, token);
      return { ok: true, data };
    } catch (e: any) {
      console.log('ANALYTICS resumo-uso-ia ERROR ====>');
      console.log(JSON.stringify(e?.response?.data || e, null, 2));
      const detail = e?.response?.data?.detail;
      return {
        ok: false,
        erroGeral:
          detail || 'Não foi possível carregar o resumo de uso das IAs.',
      };
    }
  }
  