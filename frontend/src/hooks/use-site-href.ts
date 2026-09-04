'use client';

import { useEffect, useState } from 'react';
import { isNetHost, publicHref } from '@/lib/site-href';

export function useSiteHref() {
  const [host, setHost] = useState(() =>
    typeof window !== 'undefined' ? window.location.host : ''
  );

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  return {
    to: (href: string) => publicHref(href, host),
    isNet: isNetHost(host),
    host,
  };
}
