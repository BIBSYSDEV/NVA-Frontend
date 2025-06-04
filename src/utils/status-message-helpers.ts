import { LanguageString } from '../types/common.types';

const queryParamName = 'admin';
const sessionStorageKey = 'disableStatusPage';

export const getMaintenanceInfo = () => {
  const statusPageDisabled = sessionStorage.getItem(sessionStorageKey) === 'true';
  if (statusPageDisabled) {
    return null;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const disableStatusParam = searchParams.get(queryParamName);
  if (disableStatusParam) {
    sessionStorage.setItem(sessionStorageKey, 'true');
    searchParams.delete(queryParamName);
    const queryString = searchParams.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.location.replace(newUrl);
  }

  const nbMessage = import.meta.env.VITE_STATUS_MESSAGE_NB as string | undefined;
  if (!nbMessage) {
    return null;
  }

  const startDate = import.meta.env.VITE_STATUS_START as string | undefined;
  if (startDate) {
    const currentDate = new Date();
    if (new Date(startDate) > currentDate) {
      return null;
    }
  }

  const endDate = import.meta.env.VITE_STATUS_END as string | undefined;
  if (endDate) {
    const currentDate = new Date();
    if (new Date(endDate) < currentDate) {
      return null;
    }
  }

  const message: LanguageString = { nb: nbMessage };
  if (import.meta.env.VITE_STATUS_MESSAGE_EN) {
    message.en = import.meta.env.VITE_STATUS_MESSAGE_EN as string;
  }

  return {
    message,
    startDate,
    endDate,
  };
};
