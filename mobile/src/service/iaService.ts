import { IaRankingItem, mapIaToRankingItem } from '@model/ia';
import { fetchListIas } from '@fetcher/iaFetcher';
import i18n from '@i18n';

type Ok<T> = { ok: true; data: T };
type Fail = { ok: false; erroGeral?: string };

export async function listIas(token?: string): Promise<Ok<IaRankingItem[]> | Fail> {
  try {
    const data = await fetchListIas(token);
    const mapped = (data || []).map(mapIaToRankingItem);
    return { ok: true, data: mapped };
  } catch {
    return { ok: false, erroGeral: i18n.t('ia.errors.load') };
  }
}
