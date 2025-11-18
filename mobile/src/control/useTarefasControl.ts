import { useCallback, useMemo, useState, useEffect } from 'react';
import { TarefaApi, TarefaInput } from '@model/tarefa';
import { RecomendacaoApi } from '@model/recomendacao';
import { createTarefa, gerarRecomendacaoParaTarefa, listTarefas } from '@service/tarefaService';
import { useNotifications } from '@notifications/NotificationsProvider';
import { triggerLocalNotification } from '@notifications/local';
import { notifyTarefaCreated } from '@notifications/pushGateway';
import i18n from '@i18n';

type Ok<T> = { ok: true; data: T };
type Fail = { ok: false; erroGeral?: string | null; fieldErrors?: Record<string, string> };

const FLAGS = {
  pushEnabled: (process.env.EXPO_PUBLIC_PUSH_ENV || 'dev') !== 'off',
};

export function useTarefasControl(token?: string | null) {
  const [items, setItems] = useState<TarefaApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { expoPushToken, requestToken, upsertMyToken } = useNotifications();

  const reload = useCallback(async () => {
    setLoading(true);
    const res = await listTarefas(token || undefined);
    setLoading(false);
    if (res.ok) {
      setItems(res.data || []);
      setError(null);
    } else {
      setError(res.erroGeral || null);
    }
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  const sorted = useMemo(() => [...items].sort((a, b) => a.id - b.id), [items]);

  async function addTarefa(input: TarefaInput): Promise<Ok<TarefaApi> | Fail> {
    setBusy(true);
    setFieldErrors({});
    const res = await createTarefa(token || undefined, input);
    setBusy(false);
    if (res.ok) {
      setItems(prev => [res.data, ...prev]);
      setError(null);

      const title = i18n.t('push.tarefaCreated.title');
      const body = i18n.t('push.tarefaCreated.body', { title: res.data.titulo });

      if (FLAGS.pushEnabled) {
        await upsertMyToken();
        let to = expoPushToken;
        if (!to) {
          to = await requestToken();
        }
        if (to) {
          await notifyTarefaCreated(to, { id: res.data.id, titulo: res.data.titulo });
        } else {
          await triggerLocalNotification({
            title,
            body,
            data: { screen: 'Explore', params: { section: 'tasks', tarefaId: res.data.id } },
            delaySeconds: 1,
          });
        }
      } else {
        await triggerLocalNotification({
          title,
          body,
          data: { screen: 'Explore', params: { section: 'tasks', tarefaId: res.data.id } },
          delaySeconds: 1,
        });
      }

      return { ok: true, data: res.data };
    }
    setError(res.erroGeral || null);
    setFieldErrors(res.fieldErrors || {});
    return { ok: false, erroGeral: res.erroGeral || null, fieldErrors: res.fieldErrors };
  }

  async function gerarRecomendacao(tarefaId: number): Promise<Ok<RecomendacaoApi> | Fail> {
    setBusy(true);
    const res = await gerarRecomendacaoParaTarefa(token || undefined, tarefaId);
    setBusy(false);
    if (res.ok) {
      const rec = res.data;
      setItems(prev =>
        prev.map(t => (t.id === tarefaId ? { ...t, recomendacao: rec } : t)),
      );
      setError(null);
      return { ok: true, data: rec };
    }
    setError(res.erroGeral || null);
    return { ok: false, erroGeral: res.erroGeral || null };
  }

  return {
    items: sorted,
    loading,
    busy,
    error,
    fieldErrors,
    reload,
    addTarefa,
    gerarRecomendacao,
  };
}
