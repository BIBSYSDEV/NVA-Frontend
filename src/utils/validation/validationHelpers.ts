import { AnySchema } from 'yup';

export type YupShape<T> = Partial<Record<keyof T, AnySchema>>;

export const validateDateInterval = (startDate?: string | null, endDate?: string | null) => {
  const startDateValue = startDate ? new Date(startDate) : null;
  const endDateValue = endDate ? new Date(endDate) : null;
  if (startDateValue && endDateValue) {
    return startDateValue <= endDateValue;
  }
  return true;
};
