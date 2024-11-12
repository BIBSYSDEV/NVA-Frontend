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

export const equalUris = (uri1: string | null, uri2: string | null) =>
  uri1 && uri2 && removeTrailingSlash(uri1).toLocaleLowerCase() === removeTrailingSlash(uri2).toLocaleLowerCase();

const removeTrailingSlash = (value: string) => (value.endsWith('/') ? value.slice(0, -1) : value);

export const getInitials = (name: string) => {
  if (!name) return '';

  const splittedNames = name.split(' ');
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
