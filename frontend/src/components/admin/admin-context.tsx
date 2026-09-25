'use client';

import { createContext, useContext } from 'react';
import type { AdminUser } from '@/lib/api';

export const AdminUserContext = createContext<AdminUser | null>(null);

/** Only usable inside <AdminShell>, which guarantees the user is loaded. */
export function useAdminUser(): AdminUser {
  const user = useContext(AdminUserContext);
  if (!user) {
    throw new Error('useAdminUser must be used within AdminShell');
  }
  return user;
}
