import { TarefaApi, TarefaInput } from '@model/tarefa'
import { RecomendacaoApi } from '@model/recomendacao'
import { fetchListTarefas, fetchCreateTarefa, fetchGerarRecomendacao } from '@fetcher/tarefaFetcher'

type ApiOk<T> = { ok: true; data: T }
type ApiFail = { ok: false; erroGeral?: string | null; fieldErrors?: Record<string, string> }

export type ApiResult<T> = ApiOk<T> | ApiFail

export async function listTarefas(token?: string): Promise<ApiResult<TarefaApi[]>> {
  try {
    const res = await fetchListTarefas(token)
    if (res.status >= 200 && res.status < 300) {
      return { ok: true, data: res.data ?? [] }
    }
    return { ok: false, erroGeral: 'Não foi possível listar as tarefas' }
  } catch {
    return { ok: false, erroGeral: 'Erro de comunicação com o servidor' }
  }
}

export async function createTarefa(token: string | undefined, input: TarefaInput): Promise<ApiResult<TarefaApi>> {
  const res = await fetchCreateTarefa(input, token)
  if (res.status >= 200 && res.status < 300 && res.data) {
    return { ok: true, data: res.data }
  }
  return { ok: false, erroGeral: 'Não foi possível criar a tarefa' }
}

export async function gerarRecomendacaoParaTarefa(token: string | undefined, tarefaId: number): Promise<ApiResult<RecomendacaoApi>> {
  const res = await fetchGerarRecomendacao(tarefaId, token)
  if (res.status >= 200 && res.status < 300 && res.data) {
    return { ok: true, data: res.data }
  }
  return { ok: false, erroGeral: 'Não foi possível gerar a recomendação' }
}
