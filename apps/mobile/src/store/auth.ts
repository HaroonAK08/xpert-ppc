import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import type { CrmUser } from '@/types/crm';

const TOKEN_KEY = 'xppc_crm_jwt';
const USER_KEY = 'xppc_crm_user';

type AuthState = {
  token: string | null;
  user: CrmUser | null;
  hydrated: boolean;
  setSession: (token: string, user: CrmUser) => Promise<void>;
  clearSession: () => Promise<void>;
  hydrate: () => Promise<void>;
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('SecureStore timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

async function writeSecure(key: string, value: string): Promise<void> {
  try {
    await withTimeout(SecureStore.setItemAsync(key, value), 2000);
  } catch {
    // Emulator/keystore issues — keep session in memory only
  }
}

async function deleteSecure(key: string): Promise<void> {
  try {
    await withTimeout(SecureStore.deleteItemAsync(key), 2000);
  } catch {
    // ignore
  }
}

async function readSecure(key: string): Promise<string | null> {
  try {
    return await withTimeout(SecureStore.getItemAsync(key), 2000);
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  setSession: async (token, user) => {
    await writeSecure(TOKEN_KEY, token);
    await writeSecure(USER_KEY, JSON.stringify(user));
    set({ token, user });
  },

  clearSession: async () => {
    await deleteSecure(TOKEN_KEY);
    await deleteSecure(USER_KEY);
    set({ token: null, user: null });
  },

  hydrate: async () => {
    const token = await readSecure(TOKEN_KEY);
    const rawUser = token ? await readSecure(USER_KEY) : null;
    let user: CrmUser | null = null;
    if (rawUser) {
      try {
        user = JSON.parse(rawUser) as CrmUser;
      } catch {
        user = null;
      }
    }
    set({ token: token && user ? token : null, user: token && user ? user : null, hydrated: true });
  },
}));
