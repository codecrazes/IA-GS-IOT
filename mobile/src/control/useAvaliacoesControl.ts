import { useState } from 'react';
import { AvaliacaoApi } from '@model/avaliacao';
import { createAvaliacao } from '@service/avaliacaoService';
import { useNotifications } from '@notifications/NotificationsProvider';
import { triggerLocalNotification } from '@notifications/local';
import { notifyAvaliacaoCreated } from '@notifications/pushGateway';
import i18n from '@i18n';

type Ok<T> = { ok: true; data: T };
type Fail = { ok: false; erroGeral?: string | null; fieldErrors?: Record<string, string> };

const FLAGS = {
  pushEnabled: (process.env.EXPO_PUBLIC_PUSH_ENV || 'dev') !== 'off',
};

export function useAvaliacoesControl(token?: string | null) {
  const [items, setItems] = useState<AvaliacaoApi[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { expoPushToken, requestToken, upsertMyToken } = useNotifications();

  async function addAvaliacao(input: {
    nota: number;
    comentario?: string | null;
    iaId: number;
  }): Promise<Ok<AvaliacaoApi> | Fail> {
    setBusy(true);
    setFieldErrors({});
    const res = await createAvaliacao(token || undefined, input);
    setBusy(false);
    if (res.ok) {
      setItems(prev => [res.data, ...prev]);
      setError(null);

      const iaNome = res.data?.ia?.nome || null;
      const title = i18n.t('push.avaliacaoCreated.title');
      const body = i18n.t('push.avaliacaoCreated.body', { iaName: iaNome || 'IA' });

      if (FLAGS.pushEnabled) {
        await upsertMyToken();
        let to = expoPushToken;
        if (!to) {
          to = await requestToken();
        }
        if (to) {
          await notifyAvaliacaoCreated(to, { id: res.data.id, iaNome });
        } else {
          await triggerLocalNotification({
            title,
            body,
            data: {
              screen: 'Explore',
              params: { section: 'evaluations', iaId: res.data.ia?.id },
            },
            delaySeconds: 1,
          });
        }
      } else {
        await triggerLocalNotification({
          title,
          body,
          data: {
            screen: 'Explore',
            params: { section: 'evaluations', iaId: res.data.ia?.id },
          },
          delaySeconds: 1,
        });
      }

      return { ok: true, data: res.data };
    }
    setError(res.erroGeral || null);
    setFieldErrors(res.fieldErrors || {});
    return { ok: false, erroGeral: res.erroGeral || null, fieldErrors: res.fieldErrors };
  }

  return {
    items,
    busy,
    error,
    fieldErrors,
    addAvaliacao,
  };
}
