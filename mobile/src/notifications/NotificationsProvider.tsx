import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-modules-core';
import { Platform } from 'react-native';
import { registerForPushNotificationsAsync, PushRegisterResult } from './register';
import { navigate } from '../navigation/navigationRef';

type Ctx = {
  expoPushToken: string | null;
  permissionStatus: string | null;
  projectId: string | null;
  isDevice: boolean;
  lastError: string | null;
  lastSendResult: string | null;
  requestToken: () => Promise<string | null>;
  setLastSendResult: (v: string | null) => void;
  upsertMyToken: () => Promise<void>;
};

const NotificationsContext = createContext<Ctx>({
  expoPushToken: null,
  permissionStatus: null,
  projectId: null,
  isDevice: false,
  lastError: null,
  lastSendResult: null,
  requestToken: async () => null,
  setLastSendResult: () => {},
  upsertMyToken: async () => {},
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function InnerNotificationsProvider({ children }: { children: React.ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isDevice, setIsDevice] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastSendResult, setLastSendResult] = useState<string | null>(null);

  useEffect(() => {
    const rcv: Subscription = Notifications.addNotificationReceivedListener(() => {});
    const rsp: Subscription = Notifications.addNotificationResponseReceivedListener((res) => {
      const data = res.notification.request.content.data as Record<string, any> | undefined;
      const screen = data?.screen as string | undefined;
      const params = (data?.params as Record<string, any>) || undefined;
      if (screen) navigate(screen, params);
    });
    return () => {
      rcv.remove();
      rsp.remove();
    };
  }, []);

  const requestToken = async (): Promise<string | null> => {
    setLastError(null);
    const info: PushRegisterResult = await registerForPushNotificationsAsync();
    setIsDevice(info.isDevice);
    setPermissionStatus(info.permissionStatus || null);
    setProjectId(info.projectId);

    console.log(
      'push: projectId',
      info.projectId,
      'token',
      info.token,
      'error',
      info.error,
      'isDevice',
      info.isDevice,
    );

    if (info.error) {
      setLastError(info.error);
      setExpoPushToken(null);
      return null;
    }

    setExpoPushToken(info.token);
    if (info.token) {
      await upsertPushToken(info.token);
    }
    return info.token;
  };

  useEffect(() => {
    requestToken();
  }, []);

  const upsertMyToken = async () => {
    let token = expoPushToken;
    if (!token) {
      token = await requestToken();
    }
    if (token) {
      await upsertPushToken(token);
    }
  };

  const value = useMemo<Ctx>(
    () => ({
      expoPushToken,
      permissionStatus,
      projectId,
      isDevice,
      lastError,
      lastSendResult,
      requestToken,
      setLastSendResult,
      upsertMyToken,
    }),
    [expoPushToken, permissionStatus, projectId, isDevice, lastError, lastSendResult],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

function cleanJoin(base: string, path: string) {
  const b = (base || '').replace(/\/+$/, '');
  const p = (path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
}

async function upsertPushToken(token: string) {
  try {
    const base = process.env.EXPO_PUBLIC_URL || '';
    if (!base || !token) return;
    const url = cleanJoin(base, '/push-tokens');
    const body = JSON.stringify({ token, platform: Platform.OS, userId: null, deviceId: null });

    let lastErr: any = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });
        if (res.ok) {
          if (__DEV__) console.log('push: upsert OK', res.status);
          return;
        }
        lastErr = `status=${res.status}`;
      } catch (e: any) {
        lastErr = String(e?.message || e);
      }
      await new Promise((r) => setTimeout(r, attempt * 250));
    }
    console.log('push: upsert failed', lastErr);
  } catch (e) {
    console.log('push: upsert error', String(e));
  }
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  return <InnerNotificationsProvider>{children}</InnerNotificationsProvider>;
}

export default NotificationsProvider;

export function useNotifications() {
  return useContext(NotificationsContext);
}
