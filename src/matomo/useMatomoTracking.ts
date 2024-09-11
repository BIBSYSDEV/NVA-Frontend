import { useEffect } from 'react';
import { isValidUrl } from '../utils/general-helpers';
import { initializeMatomo } from './matomo';

const matomoContainerUrl = import.meta.env.VITE_MATOMO_CONTAINER_URL;

export const useMatomoTracking = () => {
  useEffect(() => {
    if (isValidUrl(matomoContainerUrl)) {
      initializeMatomo(matomoContainerUrl);
    }
  }, []);
};
