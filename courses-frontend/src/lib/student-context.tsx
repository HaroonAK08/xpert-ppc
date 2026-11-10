'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInPath } from './navigation';
import { api, setAuthToken, type CurrentStudent } from './api';

type StudentContextValue = {
  user: CurrentStudent | null;
  updateUser: (user: CurrentStudent) => void;
};

const StudentContext = createContext<StudentContextValue>({
  user: null,
  updateUser: () => {},
});

export function useStudent() {
  return useContext(StudentContext).user;
}

export function useUpdateStudent() {
  return useContext(StudentContext).updateUser;
}

export function StudentGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState<{ status: 'loading' | 'ready'; user: CurrentStudent | null }>({
    status: 'loading',
    user: null,
  });

  function updateUser(user: CurrentStudent) {
    setState((prev) => ({ ...prev, user }));
  }

  useEffect(() => {
    let active = true;
    api.get<{ user: CurrentStudent }>('/api/student/auth/me').then((res) => {
      if (!active) return;
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) router.replace(signInPath('/login'));
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
      router.replace(signInPath('/login'));
    }
    window.addEventListener('academy:student-expired', expired);
    return () => window.removeEventListener('academy:student-expired', expired);
  }, [router]);

  if (error) return <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas px-5"><p role="alert" className="text-sm text-muted">{error}</p><button type="button" onClick={() => { setError(''); setRetry((value) => value + 1); }} className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white">Try again</button></div>;

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <p className="text-sm text-muted">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <StudentContext.Provider value={{ user: state.user, updateUser }}>{children}</StudentContext.Provider>
  );
}

export async function logoutStudent() {
  await api.post('/api/student/auth/logout');
  setAuthToken(null);
}
