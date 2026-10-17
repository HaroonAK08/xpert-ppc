'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
        router.replace('/login');
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
