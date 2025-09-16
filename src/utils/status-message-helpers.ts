import { LanguageString } from '../types/common.types';
import { getEnvVariableValue } from './general-helpers';

const queryParamName = 'admin';
const sessionStorageKey = 'disableMaintenancePage';

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
  const nbMessage = getEnvVariableValue(import.meta.env.VITE_MAINTENANCE_MESSAGE_NB);
  if (!nbMessage) {
    return null;
  }

  const startDate = getEnvVariableValue(import.meta.env.VITE_MAINTENANCE_START);
  if (startDate) {
    const currentDate = new Date();
    if (new Date(startDate) > currentDate) {
      return null;
    }
  }

  const endDate = getEnvVariableValue(import.meta.env.VITE_MAINTENANCE_END);
  if (endDate) {
    const currentDate = new Date();
    if (new Date(endDate) < currentDate) {
      return null;
    }
  }

  const message: LanguageString = { nb: nbMessage };
  const enMessage = getEnvVariableValue(import.meta.env.VITE_MAINTENANCE_MESSAGE_EN);
  if (enMessage) {
    message.en = enMessage;
  }

  const severity = getEnvVariableValue<'block'>(import.meta.env.VITE_MAINTENANCE_SEVERITY);

  return {
    message,
    startDate,
    endDate,
    severity,
  };
};
