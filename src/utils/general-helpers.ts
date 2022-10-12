import * as Yup from 'yup';
import { Period } from '../types/common.types';

export const isValidUrl = (value: string) => {
  try {
    const validation = Yup.string().url().validateSync(value);
    return !!validation;
  } catch {
    return false;
  }
};

export const getPeriodString = (period: Period | null) => {
  const fromDate = period?.from ? new Date(period.from).toLocaleDateString() : '';
  const toDate = period?.to ? new Date(period.to).toLocaleDateString() : '';

  if (!fromDate && !toDate) {
    return '';
  } else {
    return fromDate === toDate ? fromDate : `${fromDate ?? '?'} - ${toDate ?? '?'}`;
  }
};
