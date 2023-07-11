import { TFunction } from 'i18next';
import * as Yup from 'yup';

export const isValidUrl = (value: string) => Yup.string().url().isValidSync(value);

export const getPeriodString = (from: string | undefined, to: string | undefined) => {
  const fromDate = from ? new Date(from).toLocaleDateString() : '';
  const toDate = to ? new Date(to).toLocaleDateString() : '';

  if (!fromDate && !toDate) {
    return '';
  } else {
    return fromDate === toDate ? fromDate : `${fromDate ?? '?'} - ${toDate ?? '?'}`;
  }
};

export const getIdentifierFromId = (id: string) => id.split('/').pop() ?? '';

export const equalUris = (uri1: string | null, uri2: string | null) =>
  uri1 && uri2 && removeTrailingSlash(uri1).toLocaleLowerCase() === removeTrailingSlash(uri2).toLocaleLowerCase();

const removeTrailingSlash = (value: string) => (value.endsWith('/') ? value.slice(0, -1) : value);

export const getTimePeriodString = (date1: string, date2: string, t: TFunction) => {
  const date1Obj = new Date(date1);
  const date2Obj = new Date(date2);

  // Convert minutes to milliseconds
  const timezoneOffset1 = date1Obj.getTimezoneOffset() * 60 * 1000;
  const timezoneOffset2 = date2Obj.getTimezoneOffset() * 60 * 1000;

  const dateDiff = Math.abs(date1Obj.getTime() - timezoneOffset1 - (date2Obj.getTime() - timezoneOffset2));
  const minutesDiff = Math.floor(dateDiff / (1000 * 60));
  const hoursDiff = Math.floor(dateDiff / (1000 * 3600));
  const daysDiff = Math.floor(dateDiff / (1000 * 3600 * 24));

  if (minutesDiff < 1) {
    return t('common.now');
  } else if (minutesDiff < 60) {
    return t('common.x_minutes', { count: minutesDiff });
  } else if (hoursDiff < 24) {
    return t('common.x_hours', { count: hoursDiff });
  } else if (daysDiff < 30) {
    return t('common.x_days', { count: daysDiff });
  } else if (daysDiff < 365) {
    const monthsCount = Math.floor(daysDiff / 30);
    return t('common.x_months', { count: monthsCount });
  } else {
    const yearsCount = Math.floor(daysDiff / 365);
    return t('common.x_years', { count: yearsCount });
  }
};
