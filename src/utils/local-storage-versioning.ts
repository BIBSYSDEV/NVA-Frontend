import { APP_VERSION } from './constants';

export const checkLocalStorageVersion = () => {
  const localStorageVersion = window.localStorage.getItem('version');

  if (APP_VERSION !== localStorageVersion) {
    window.localStorage.removeItem('publicationFormData');
    window.localStorage.setItem('version', APP_VERSION);
  }
};
