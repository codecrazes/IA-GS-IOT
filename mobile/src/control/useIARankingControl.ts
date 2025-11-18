import { useCallback, useEffect, useMemo, useState } from 'react';
import { IaRankingItem, IaRankingViewItem } from '@model/ia';
import { listIas } from '@service/iaService';

const safeString = (v: unknown) => (typeof v === 'string' ? v : '');

export function useIaRankingControl(token?: string | null) {
  const [items, setItems] = useState<IaRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const res = await listIas(token || undefined);
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

  const ranked: IaRankingViewItem[] = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      if (b.score0to10 !== a.score0to10) return b.score0to10 - a.score0to10;
      if (b.totalRatings !== a.totalRatings) return b.totalRatings - a.totalRatings;
      return safeString(a.name).localeCompare(safeString(b.name));
    });
    return sorted.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [items]);

  return {
    items,
    ranked,
    loading,
    error,
    reload,
  };
}
