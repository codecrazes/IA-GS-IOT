import i18n from '@i18n';
import { sendPush } from '../service/pushService';

export async function notifyPromptCreated(
  to: string,
  payload: { id: number; titulo: string },
) {
  return sendPush({
    to,
    title: i18n.t('push.promptCreated.title'),
    body: i18n.t('push.promptCreated.body', { title: payload.titulo }),
    data: {
      screen: 'Explore',
      params: { section: 'prompts', promptId: payload.id },
    },
  });
}

export async function notifyTarefaCreated(
  to: string,
  payload: { id: number; titulo: string },
) {
  return sendPush({
    to,
    title: i18n.t('push.tarefaCreated.title'),
    body: i18n.t('push.tarefaCreated.body', { title: payload.titulo }),
    data: {
      screen: 'Explore',
      params: { section: 'tasks', tarefaId: payload.id },
    },
  });
}

export async function notifyAvaliacaoCreated(
  to: string,
  payload: { id: number; iaNome?: string | null },
) {
  return sendPush({
    to,
    title: i18n.t('push.avaliacaoCreated.title'),
    body: i18n.t('push.avaliacaoCreated.body', {
      iaName: payload.iaNome || 'IA',
    }),
    data: {
      screen: 'Explore',
      params: { section: 'evaluations', iaId: payload.id },
    },
  });
}
