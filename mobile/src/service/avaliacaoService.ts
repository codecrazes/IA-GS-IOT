import { AvaliacaoApi, AvaliacaoInput } from '@model/avaliacao';
import { fetchCreateAvaliacao, AvaliacaoCreatePayload } from '@fetcher/avaliacaoFetcher';
import i18n from '@i18n';

type Ok<T> = { ok: true; data: T };
type Fail = { ok: false; erroGeral?: string; fieldErrors?: Record<string, string> };

const DEFAULT_USER_ID = 1;

export async function createAvaliacao(
  token: string | undefined,
  input: Omit<AvaliacaoInput, 'usuarioId'>,
  usuarioId: number = DEFAULT_USER_ID,
): Promise<Ok<AvaliacaoApi> | Fail> {
  const fieldErrors: Record<string, string> = {};
  if (input.nota == null || Number.isNaN(input.nota)) {
    fieldErrors.nota = i18n.t('avaliacoes.errors.notaRequired');
  } else if (input.nota < 0 || input.nota > 10) {
    fieldErrors.nota = i18n.t('avaliacoes.errors.notaRange');
  }
  if (!input.iaId) {
    fieldErrors.iaId = i18n.t('avaliacoes.errors.iaRequired');
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }
  const payload: AvaliacaoCreatePayload = {
    nota: input.nota,
    comentario: input.comentario,
    usuarioId,
    iaId: input.iaId,
  };
  try {
    const data = await fetchCreateAvaliacao(token, payload);
    return { ok: true, data };
  } catch {
    return { ok: false, erroGeral: i18n.t('avaliacoes.errors.create') };
  }
}
