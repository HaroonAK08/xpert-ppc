import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useOfflineStore } from '@/store/offline';
import { apiRequest } from '@/api/client';

export function useNetworkStatus() {
  const setOnline = useOfflineStore((s) => s.setOnline);
  const isOnline = useOfflineStore((s) => s.isOnline);
  const queue = useOfflineStore((s) => s.queue);
  const dequeue = useOfflineStore((s) => s.dequeue);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });
    return () => unsub();
  }, [setOnline]);

  useEffect(() => {
    if (!isOnline || queue.length === 0) return;

    let cancelled = false;
    (async () => {
      while (!cancelled) {
        const item = dequeue();
        if (!item) break;
        try {
          await apiRequest(item.path, {
            method: item.method,
            body: item.body,
          });
        } catch {
          useOfflineStore.getState().enqueue({
            method: item.method,
            path: item.path,
            body: item.body,
          });
          break;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOnline, queue.length, dequeue]);

  return { isOnline, pending: queue.length };
}
