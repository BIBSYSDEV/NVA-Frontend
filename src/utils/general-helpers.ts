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
