'use client';

import { useEffect, useState } from 'react';
import { isCoursesHost, publicHref } from '@/lib/site-href';

export function useSiteHref() {
  const [host, setHost] = useState(() =>
    typeof window !== 'undefined' ? window.location.host : ''
  );

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const isCourses = isCoursesHost(host);

  return {
    to: (href: string) => publicHref(href, host),
    isCourses,
    /** @deprecated Use isCourses — courses site is xpertppc.ai */
    isNet: isCourses,
    host,
  };
}
