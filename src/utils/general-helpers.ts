import { TFunction } from 'i18next';
import * as Yup from 'yup';
import { toDateString } from './date-helpers';

export const isValidUrl = (value: string) => Yup.string().url().isValidSync(value);

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

export const getTimePeriodString = (date1: Date, date2: Date, t: TFunction) => {
  const dateDiff = Math.abs(date1.getTime() - date2.getTime());
  const daysCount = Math.floor(dateDiff / 86_400_000);

  if (Number.isNaN(dateDiff) || Number.isNaN(daysCount)) {
    return '';
  } else if (daysCount === 0) {
    return t('common.today');
  } else if (daysCount < 31) {
    return t('common.x_days', { count: daysCount });
  } else if (daysCount < 365) {
    const monthsCount = Math.floor(daysCount / 31);
    return t('common.x_months', { count: monthsCount });
  } else {
    const yearsCount = Math.floor(daysCount / 365);
    return t('common.x_years', { count: yearsCount });
  }
};

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

export const getSecondsSinceEpoch = (date: Date) => Math.floor(date.getTime() / 1000);

export const isEqualToTheSecond = (a: Date, b: Date) => getSecondsSinceEpoch(a) === getSecondsSinceEpoch(b);
