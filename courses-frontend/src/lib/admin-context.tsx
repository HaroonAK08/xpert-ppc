'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, type AdminUser } from './admin-api';

const AdminContext = createContext<AdminUser | null>(null);

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<{ status: 'loading' | 'ready'; user: AdminUser | null }>({
    status: 'loading',
    user: null,
  });

  useEffect(() => {
    let active = true;
    adminApi.get<{ user: AdminUser }>('/api/auth/me').then((res) => {
      if (!active) return;
      if (!res.ok) {
        router.replace('/admin/login');
        return;
      }
      setState({ status: 'ready', user: res.data.user });
    });
    return () => {
      active = false;
    };
  }, [router]);

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <p className="text-sm text-muted">Loading admin…</p>
      </div>
    );
  }

  return <AdminContext.Provider value={state.user}>{children}</AdminContext.Provider>;
}
