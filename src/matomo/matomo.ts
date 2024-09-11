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

export const initializeMatomo = () => {
  const matomoContainerUrl = import.meta.env.VITE_MATOMO_CONTAINER_URL;
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

  g.onload = () => {
    if (window.Matomo) {
      window.Matomo.trackPageView();
      window.Matomo.enableLinkTracking();
    }
  };
};
