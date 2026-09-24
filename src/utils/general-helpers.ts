import * as Yup from 'yup';
import { toDateString } from './date-helpers';

export const isOnPage = (url: string) => window.location.pathname.startsWith(url);

/** Web URL check. Also accepts protocol-relative URLs like `//example.com`. */
export const isValidUrl = (value: string) => value && Yup.string().url().isValidSync(value);

export const doiUrlBase = 'https://doi.org/';
export const doiUrlPlaceholder = `${doiUrlBase}10.1000/xyz123`;
const doiPattern = '10[.][0-9]{4,}(?:[.][0-9]+)*/(?:(?!["&\'<>])\\S)+'; // https://stackoverflow.com/a/10324802
const doiRegExp = new RegExp(`\\b(${doiPattern})\\b`); // Finds a DOI anywhere in a text
const wholeDoiRegExp = new RegExp(`^${doiPattern}$`); // Matches only if the whole text is a DOI

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

/** Web URL check that also requires a protocol (rejects `//example.com`). */
const isAbsoluteWebUrl = (value: string) => !!isValidUrl(value) && URL.canParse(value);

/** True if the value is an absolute web URL or a bare DOI, ignoring surrounding whitespace. */
export const isValidResourceLink = (value: string) => {
  const trimmedValue = value.trim();
  return isAbsoluteWebUrl(trimmedValue) || wholeDoiRegExp.test(trimmedValue);
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

export const setDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const nbNoNumberFormat = new Intl.NumberFormat('nb-NO');

export const formatLocaleNumber = (n: number) => nbNoNumberFormat.format(n);
