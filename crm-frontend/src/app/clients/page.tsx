'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Old Clients route → Users. */
export default function ClientsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/users');
  }, [router]);
  return null;
}
