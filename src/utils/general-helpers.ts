import * as Yup from 'yup';
import { toDateString } from './date-helpers';

export const isValidUrl = (value: string) => value && Yup.string().url().isValidSync(value);

export const doiUrlBase = 'https://doi.org/';
const doiRegExp = new RegExp('\\b(10[.][0-9]{4,}(?:[.][0-9]+)*/(?:(?!["&\'<>])\\S)+)\\b'); // https://stackoverflow.com/a/10324802

export const makeDoiUrl = (doiInput: string) => {
  let doiUrl = doiInput.trim();

  if (!isValidUrl(doiUrl)) {
    const regexMatch = doiRegExp.exec(doiUrl);
    if (regexMatch && regexMatch.length > 0) {
      doiUrl = `${doiUrlBase}${regexMatch[0]}`;
    }
  }

  return doiUrl;
};

export const getDoiValue = (value: string) => {
  const trimmedValue = value.trim();
  const doi = isValidUrl(trimmedValue) ? new URL(trimmedValue).pathname.slice(1) : trimmedValue;
  return doi;
};

export const getPeriodString = (from: string | undefined, to: string | undefined) => {
  const fromDate = from ? toDateString(from) : '';
  const toDate = to ? toDateString(to) : '';

  if (!fromDate && !toDate) {
    return '';
  } else {
    return fromDate === toDate ? fromDate : `${fromDate || '?'} - ${toDate || '?'}`;
  }
};

export const getIdentifierFromId = (id: string) => id.split('/').pop() ?? '';

export const getInitials = (name: string) => {
  if (!name) return '';
  const cleanedName = name.trim().replace(/\s+/g, ' ');
  if (!cleanedName) return '';
  const splittedNames = cleanedName.split(' ');
  const firstNameInitial = splittedNames[0][0];
  const lastNameInitial = splittedNames.length > 1 ? splittedNames.pop()?.[0] : '';
  return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
};

export const getCurrentPath = () => {
  const { pathname, search } = window.location;
  if (search) {
    return `${pathname}${search}`;
  } else {
    return pathname;
  }
};

export const getObjectEntriesWithValue = (object: Record<string, any>) =>
  Object.fromEntries(Object.entries(object).filter(([, value]) => value !== null && value !== undefined));

export const isSimilarTime = (dateString1: string, dateString2: string, msThreshold: number) => {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);
  return Math.abs(date1.getTime() - date2.getTime()) < msThreshold;
};

export const removeTrailingYearPathFromUrl = (url: string) => {
  const urlWithoutYear = url.replace(/\/\d{4}$/, '');
  return urlWithoutYear;
};

export const getEnvVariableValue = <T = string>(value: any): T | undefined => {
  // Ignore 'none' values as they are only used for simplifying overriding env variable in AWS Amplify
  if (value === 'none') {
    return undefined;
  }
  return value?.trim() as T | undefined;
};
