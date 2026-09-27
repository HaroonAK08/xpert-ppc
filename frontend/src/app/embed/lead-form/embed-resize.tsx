'use client';

import { useEffect } from 'react';

/**
 * Tells the parent page (via embed.js) how tall this iframe's content is, so
 * the iframe can grow/shrink instead of showing a fixed-height scrollbar.
 * Runs only inside an iframe — a no-op if this page is opened directly.
 */
export function EmbedResize() {
  useEffect(() => {
    if (window.self === window.top) return;

    const send = () => {
      window.parent.postMessage(
        { source: 'xpertppc-embed', height: document.documentElement.scrollHeight },
        '*'
      );
    };

    send();
    const observer = new ResizeObserver(send);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  return null;
}
