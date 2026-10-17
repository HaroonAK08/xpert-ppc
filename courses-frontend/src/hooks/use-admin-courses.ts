'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';

export type AdminCourseOption = { id: string; title: string };

export function useAdminCourses() {
  const [courses, setCourses] = useState<AdminCourseOption[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.get<{ items: AdminCourseOption[] }>('/api/admin/portal/courses').then((res) => {
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setCourses(res.data.items.map((c) => ({ id: c.id, title: c.title })));
    });
  }, []);

  return { courses, error };
}
