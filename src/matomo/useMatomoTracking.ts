import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useMatomoTracking = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('Sjekker om app skal tracke...');
    if (window.Matomo) {
      console.log('TRACK VISIT', location.pathname);
      // console.log(window.Matomo);
      // Oppdater URL og dokumenttittel ved navigasjon
      // window.Matomo.setCustomUrl(window.location.href);
      // window.Matomo.setDocumentTitle(document.title);

      // Spor ny sidevisning
      // window.Matomo.trackPageView();
    }
  }, [location]);
};
