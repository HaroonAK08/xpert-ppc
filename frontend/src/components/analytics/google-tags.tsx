import Script from 'next/script';

const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();

export function GoogleTags() {
  return (
    <>
      {gtmId ? <Gtm snipId={gtmId} /> : null}
      {!gtmId && gaId ? <Ga4 measurementId={gaId} /> : null}
    </>
  );
}

function Gtm({ snipId }: { snipId: string }) {
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${snipId}');
      `}</Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${snipId}`}
          height={0}
          width={0}
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}

function Ga4({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}');
      `}</Script>
    </>
  );
}
