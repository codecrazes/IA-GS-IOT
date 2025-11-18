export type ExpoPushMessage = {
  to: string;
  title?: string;
  body?: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
  priority?: 'default' | 'normal' | 'high';
};

export async function sendPush(
  msg: ExpoPushMessage,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data[0] : json?.data;
    if (data?.status === 'ok') return { ok: true, id: data?.id };
    return {
      ok: false,
      error: String(data?.message || json?.errors?.[0]?.message || 'send_failed'),
    };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) };
  }
}
