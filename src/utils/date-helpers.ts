import { enUS as englishLocale, nb as norwegianLocale } from 'date-fns/locale';
import { RegistrationDate } from '../types/registration.types';

export const displayDate = (date: Omit<RegistrationDate, 'type'> | undefined) => {
  if (date?.month && date?.day) {
    return toDateString(new Date(+date.year, +date.month - 1, +date.day));
  } else if (date?.year) {
    return date.year;
  } else {
    return '';
  }
};

export const getDateFnsLocale = (language: string) => {
  if (language === 'nob' || language === 'nno') {
    return norwegianLocale;
  }
  return englishLocale;
};

export const formatDateStringToISO = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export const toDateString = (date: Date | string | number) => {
  if (!date) {
    return '';
  }

  const dateObject = date instanceof Date ? date : new Date(date);

  return dateObject.toLocaleDateString('nb-NO', { year: 'numeric', month: '2-digit', day: '2-digit' });
};
