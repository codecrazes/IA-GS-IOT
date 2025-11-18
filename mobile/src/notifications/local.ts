import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function ensureLocalPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  let status = current.status;
  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
  return status === 'granted';
}

type LocalPayload = {
  title: string;
  body: string;
  data?: Record<string, any>;
  delaySeconds?: number;
};

export async function triggerLocalNotification(p: LocalPayload) {
  const ok = await ensureLocalPermissions();
  if (!ok) return { ok: false as const, error: 'permission_not_granted' };
  await Notifications.scheduleNotificationAsync({
    content: { title: p.title, body: p.body, data: p.data || {} },
    trigger: { seconds: Math.max(1, p.delaySeconds ?? 1) },
  });
  return { ok: true as const };
}
