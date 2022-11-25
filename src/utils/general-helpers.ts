import * as Yup from 'yup';
import { Period } from '../types/common.types';

export const isValidUrl = (value: string) => Yup.string().url().isValidSync(value);

export const getPeriodString = (period: Period | null) => {
  const fromDate = period?.from ? new Date(period.from).toLocaleDateString() : '';
  const toDate = period?.to ? new Date(period.to).toLocaleDateString() : '';

  if (!fromDate && !toDate) {
    return '';
  } else {
    return fromDate === toDate ? fromDate : `${fromDate ?? '?'} - ${toDate ?? '?'}`;
  }
};
