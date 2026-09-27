'use client';

import { createContext, useContext } from 'react';
import type { CurrentUser } from './api';

export const CurrentUserContext = createContext<CurrentUser | null>(null);

/** Only usable inside <AppShell>, which guarantees the user is loaded. */
export function useCurrentUser(): CurrentUser {
  const user = useContext(CurrentUserContext);
  if (!user) {
    throw new Error('useCurrentUser must be used within AppShell');
  }
  return user;
}
