declare global {
  interface Window {
    _mtm?: Array<Record<string, unknown>>;
    Matomo?: {
      trackPageView: () => void;
      enableLinkTracking: () => void;
      setCustomUrl: (url: string) => void;
      setDocumentTitle: (title: string) => void;
    };
  }
}

export const initializeMatomo = (matomoContainerUrl: string) => {
  if (!matomoContainerUrl) {
    return;
  }
  const _mtm = (window._mtm = window._mtm || []);
  _mtm.push({
    'mtm.startTime': new Date().getTime(),
    event: 'mtm.Start',
  });

  const d = document;
  const g = d.createElement('script');
  const s = d.getElementsByTagName('script')[0];

  g.async = true;
  g.src = matomoContainerUrl;
  s.parentNode?.insertBefore(g, s);
};
