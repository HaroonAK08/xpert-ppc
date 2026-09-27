/**
 * Embed routes render inside a third-party iframe. Strip the marketing site's
 * navy page chrome so only the form card shows — matching the CRM live preview.
 */
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        html, body {
          background: transparent !important;
          min-height: 0 !important;
          height: auto !important;
        }
        body > div.flex.min-h-screen {
          min-height: 0 !important;
        }
      `}</style>
      {children}
    </>
  );
}
