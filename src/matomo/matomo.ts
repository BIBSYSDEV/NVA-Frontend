declare global {
  interface Window {
    _mtm?: Array<Record<string, unknown>>;
    _paq?: Array<unknown>;
  }
}

export const initializeMatomo = (matomoContainerUrl: string) => {
  const _mtm = (window._mtm = window._mtm || []);
  _mtm.push({
    'mtm.startTime': new Date().getTime(),
    event: 'mtm.Start',
  });

  const _paq = (window._paq = window._paq || []);
  _paq.push(['enableJSErrorTracking']);

  const documentRef = document;
  const newScriptElement = documentRef.createElement('script');
  const firstScriptElement = documentRef.getElementsByTagName('script')[0];

  newScriptElement.async = true;
  newScriptElement.src = matomoContainerUrl;
  firstScriptElement.parentNode?.insertBefore(newScriptElement, firstScriptElement);
};
