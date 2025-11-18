import { useCallback, useEffect, useMemo, useState } from 'react';
import { PromptApi, PromptInput } from '@model/prompt';
import { createPrompt, deletePrompt, listPrompts, updatePrompt } from '@service/promptService';
import { useNotifications } from '@notifications/NotificationsProvider';
import { triggerLocalNotification } from '@notifications/local';
import { notifyPromptCreated } from '@notifications/pushGateway';
import i18n from '@i18n';

type Ok<T> = { ok: true; data: T };
type Fail = { ok: false; erroGeral?: string | null; fieldErrors?: Record<string, string> };

const FLAGS = {
  pushEnabled: (process.env.EXPO_PUBLIC_PUSH_ENV || 'dev') !== 'off',
};

export function usePromptsControl(token?: string | null) {
  const [items, setItems] = useState<PromptApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { expoPushToken, requestToken, upsertMyToken } = useNotifications();

  const reload = useCallback(async () => {
    setLoading(true);
    const res = await listPrompts(token || undefined);
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

  async function addPrompt(input: PromptInput): Promise<Ok<PromptApi> | Fail> {
    setBusy(true);
    setFieldErrors({});
    const res = await createPrompt(token || undefined, input);
    setBusy(false);

    if (res.ok) {
      setItems(prev => [res.data, ...prev]);
      setError(null);

      const title = i18n.t('push.promptCreated.title');
      const body = i18n.t('push.promptCreated.body', { title: res.data.titulo });

      if (FLAGS.pushEnabled) {
        await upsertMyToken();
        let to = expoPushToken;
        if (!to) {
          to = await requestToken();
        }
        if (to) {
          await notifyPromptCreated(to, { id: res.data.id, titulo: res.data.titulo });
        } else {
          await triggerLocalNotification({
            title,
            body,
            data: { screen: 'Explore', params: { section: 'prompts', promptId: res.data.id } },
            delaySeconds: 1,
          });
        }
      } else {
        await triggerLocalNotification({
          title,
          body,
          data: { screen: 'Explore', params: { section: 'prompts', promptId: res.data.id } },
          delaySeconds: 1,
        });
      }

      return { ok: true, data: res.data };
    }

    setError(res.erroGeral || null);
    return { ok: false, erroGeral: res.erroGeral || null, fieldErrors: res.fieldErrors };
  }

  async function editPrompt(id: number, input: PromptInput): Promise<Ok<PromptApi> | Fail> {
    setBusy(true);
    setFieldErrors({});
    const res = await updatePrompt(token || undefined, id, input);
    setBusy(false);
    if (res.ok) {
      setItems(prev => prev.map(p => (p.id === id ? res.data : p)));
      setError(null);
      return { ok: true, data: res.data };
    }
    setError(res.erroGeral || null);
    return { ok: false, erroGeral: res.erroGeral || null, fieldErrors: res.fieldErrors };
  }

  async function removePrompt(id: number): Promise<Ok<null> | Fail> {
    setBusy(true);
    setFieldErrors({});
    const res = await deletePrompt(token || undefined, id);
    setBusy(false);
    if (res.ok) {
      setItems(prev => prev.filter(p => p.id !== id));
      setError(null);
      return { ok: true, data: null };
    }
    setError(res.erroGeral || null);
    return { ok: false, erroGeral: res.erroGeral || null, fieldErrors: res.fieldErrors };
  }

  return {
    items: sorted,
    loading,
    busy,
    error,
    fieldErrors,
    reload,
    addPrompt,
    editPrompt,
    removePrompt,
  };
}
