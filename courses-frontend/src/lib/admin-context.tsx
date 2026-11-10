'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInPath } from './navigation';
import { adminApi, type AdminUser } from './admin-api';

const AdminContext = createContext<AdminUser | null>(null);

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState<{ status: 'loading' | 'ready'; user: AdminUser | null }>({
    status: 'loading',
    user: null,
  });

  useEffect(() => {
    let active = true;
    adminApi.get<{ user: AdminUser }>('/api/auth/me').then((res) => {
      if (!active) return;
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) router.replace(signInPath('/admin/login'));
        else setError(res.error);
        return;
      }
      setState({ status: 'ready', user: res.data.user });
    });
    return () => {
      active = false;
    };
  }, [router, retry]);

  useEffect(() => {
    function expired() {
      setState({ status: 'loading', user: null });
      router.replace(signInPath('/admin/login'));
    }
    window.addEventListener('academy:admin-expired', expired);
    return () => window.removeEventListener('academy:admin-expired', expired);
  }, [router]);

  if (error) return <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas px-5"><p role="alert" className="text-sm text-muted">{error}</p><button type="button" onClick={() => { setError(''); setRetry((value) => value + 1); }} className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white">Try again</button></div>;

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <p className="text-sm text-muted">Loading admin…</p>
      </div>
    );
  }

  return <AdminContext.Provider value={state.user}>{children}</AdminContext.Provider>;
}
