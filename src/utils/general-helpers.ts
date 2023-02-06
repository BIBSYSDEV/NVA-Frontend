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
