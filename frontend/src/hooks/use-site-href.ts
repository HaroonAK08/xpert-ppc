'use client';

import { useEffect, useState } from 'react';
import { publicHref } from '@/lib/site-href';

export function useSiteHref() {
  const [host, setHost] = useState('');

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  return (href: string) => publicHref(href, host);
}
