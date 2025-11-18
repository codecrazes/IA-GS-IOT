import { PromptApi, PromptInput } from '@model/prompt'
import { fetchPrompts, fetchCreatePrompt, fetchUpdatePrompt, fetchDeletePrompt } from '@fetcher/promptFetcher'

type ApiOk<T> = { ok: true; data: T }
type ApiFail = { ok: false; erroGeral?: string | null; fieldErrors?: Record<string, string> }

export type ApiResult<T> = ApiOk<T> | ApiFail

function buildError(status: number, fallback: string): ApiFail {
  if (status === 400) {
    return { ok: false, erroGeral: 'Requisição inválida' }
  }
  if (status === 404) {
    return { ok: false, erroGeral: 'Recurso não encontrado' }
  }
  if (status >= 500) {
    return { ok: false, erroGeral: 'Erro no servidor' }
  }
  return { ok: false, erroGeral: fallback }
}

export async function listPrompts(token?: string): Promise<ApiResult<PromptApi[]>> {
  try {
    const res = await fetchPrompts(token)
    if (res.status >= 200 && res.status < 300) {
      return { ok: true, data: res.data ?? [] }
    }
    return buildError(res.status, 'Não foi possível listar os prompts')
  } catch {
    return { ok: false, erroGeral: 'Erro de comunicação com o servidor' }
  }
}

export async function createPrompt(token: string | undefined, input: PromptInput): Promise<ApiResult<PromptApi>> {
  try {
    const res = await fetchCreatePrompt(input, token)
    if (res.status >= 200 && res.status < 300 && res.data) {
      return { ok: true, data: res.data }
    }
    return buildError(res.status, 'Não foi possível criar o prompt')
  } catch {
    return { ok: false, erroGeral: 'Erro de comunicação com o servidor' }
  }
}

export async function updatePrompt(token: string | undefined, id: number, input: PromptInput): Promise<ApiResult<PromptApi>> {
  try {
    const res = await fetchUpdatePrompt(id, input, token)
    if (res.status >= 200 && res.status < 300 && res.data) {
      return { ok: true, data: res.data }
    }
    return buildError(res.status, 'Não foi possível atualizar o prompt')
  } catch {
    return { ok: false, erroGeral: 'Erro de comunicação com o servidor' }
  }
}

export async function deletePrompt(token: string | undefined, id: number): Promise<ApiResult<null>> {
  try {
    const res = await fetchDeletePrompt(id, token)
    if (res.status >= 200 && res.status < 300) {
      return { ok: true, data: null }
    }
    return buildError(res.status, 'Não foi possível excluir o prompt')
  } catch {
    return { ok: false, erroGeral: 'Erro de comunicação com o servidor' }
  }
}
