import { CRISTIN_UNITS_BASE_URL, CRISTIN_INSTITUTIONS_BASE_URL } from './constants';

const isValidUrl = (string: string) => {
  try {
    new URL(string);
  } catch {
    return false;
  }
  return true;
};

export const getUnitUri = (unitId: string) =>
  isValidUrl(unitId)
    ? unitId
    : unitId.includes('.') // Check if root level institution
    ? `${CRISTIN_UNITS_BASE_URL}${unitId}`
    : `${CRISTIN_INSTITUTIONS_BASE_URL}${unitId}`;
