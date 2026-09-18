import { create } from 'zustand';

type OfflineQueueItem = {
  id: string;
  method: 'POST' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  createdAt: string;
};

type OfflineState = {
  isOnline: boolean;
  queue: OfflineQueueItem[];
  setOnline: (online: boolean) => void;
  enqueue: (item: Omit<OfflineQueueItem, 'id' | 'createdAt'>) => void;
  dequeue: () => OfflineQueueItem | undefined;
  clear: () => void;
};

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOnline: true,
  queue: [],
  setOnline: (online) => set({ isOnline: online }),
  enqueue: (item) =>
    set({
      queue: [
        ...get().queue,
        {
          ...item,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date().toISOString(),
        },
      ],
    }),
  dequeue: () => {
    const [first, ...rest] = get().queue;
    set({ queue: rest });
    return first;
  },
  clear: () => set({ queue: [] }),
}));
