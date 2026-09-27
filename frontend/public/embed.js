/**
 * Xpert PPC lead-form embed.
 *
 * Usage — paste this where the form should appear on any page/site. Each form
 * built in the CRM's Form Builder has its own id; the snippet shown there
 * already includes it:
 *
 *   <script src="https://xpertppc.com/embed.js" data-form="<form id>" async></script>
 *
 * The form renders inside an iframe hosted on xpertppc.com (so the CRM's own
 * API calls stay same-origin from the iframe's point of view — nothing about
 * this needs CORS changes on the embedding site). The iframe auto-resizes to
 * fit its content via postMessage; no configuration required.
 */
(function () {
  'use strict';

  // document.currentScript is null for async/defer in some browsers, so fall
  // back to the last matching <script src$="embed.js"> on the page.
  var currentScript = document.currentScript;
  if (!currentScript) {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src || '';
      if (/\/embed\.js(\?|$)/.test(src)) {
        currentScript = scripts[i];
        break;
      }
    }
  }
  if (!currentScript) return;

  var origin = new URL(currentScript.src).origin;
  var initialHeight = Number(currentScript.getAttribute('data-height')) || 480;
  var formId = currentScript.getAttribute('data-form');

  if (!formId) {
    console.error('[xpertppc embed] Missing data-form attribute on the script tag.');
    return;
  }

  var iframe = document.createElement('iframe');
  iframe.src = origin + '/embed/lead-form?form=' + encodeURIComponent(formId);
  iframe.title = 'Contact form';
  iframe.style.width = '100%';
  iframe.style.maxWidth = '100%';
  iframe.style.border = '0';
  iframe.style.height = initialHeight + 'px';
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('allowtransparency', 'true');
  iframe.style.backgroundColor = 'transparent';
  iframe.style.colorScheme = 'normal';

  currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);

  window.addEventListener('message', function (event) {
    if (event.origin !== origin) return;
    var data = event.data;
    if (!data || data.source !== 'xpertppc-embed' || event.source !== iframe.contentWindow) return;
    if (typeof data.height === 'number' && data.height > 0) {
      iframe.style.height = data.height + 'px';
    }
  });
})();
