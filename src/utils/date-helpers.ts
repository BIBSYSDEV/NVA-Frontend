import { nb as norwegianLocale, enUS as englishLocale } from 'date-fns/locale';
import { RegistrationDate } from '../types/registration.types';

export const displayDate = (date: RegistrationDate | undefined) => {
  if (date?.month && date?.day) {
    return new Date(+date.year, +date.month - 1, +date.day).toLocaleDateString();
  } else if (date?.year) {
    return date.year;
  } else {
    return '';
  }
};

export const getDateFnsLocale = (language: string) => {
  if (language === 'nob') {
    return norwegianLocale;
  }
  return englishLocale;
};
