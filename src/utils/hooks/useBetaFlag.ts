import { LocalStorageKey } from '../constants';

export const useBetaFlag = () => {
  return localStorage.getItem(LocalStorageKey.Beta) === 'true';
};
