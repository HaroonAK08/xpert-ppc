'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#101828',
          color: '#fff',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div style={{ maxWidth: 420, padding: 32 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#1d6ff2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            X
          </div>
          <h1 style={{ fontSize: 28, margin: '0 0 8px', letterSpacing: '-0.03em' }}>Something went wrong</h1>
          <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.5 }}>
            The CRM hit an unexpected error. Try loading this page again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              height: 40,
              padding: '0 16px',
              border: 0,
              borderRadius: 8,
              background: '#1d6ff2',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
