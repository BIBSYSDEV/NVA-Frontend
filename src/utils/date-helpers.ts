import { enUS as englishPickerLocale, nbNO as norwegianPickerLocale } from '@mui/x-date-pickers/locales';
import { enGB as englishDateLocale, nb as norwegianDateLocale } from 'date-fns/locale';
import { RegistrationDate } from '../types/registration.types';

export const displayDate = (date: Omit<RegistrationDate, 'type'> | undefined) => {
  if (date?.month && date?.day && date?.year) {
    const dateObject = getRegistrationDate(date);
    if (dateObject) {
      return toDateString(dateObject);
    } else {
      return '';
    }
  } else if (date?.year) {
    return date.year;
  } else {
    return '';
  }
};

export const getRegistrationDate = (date: Omit<RegistrationDate, 'type'> | undefined) => {
  if (!date || !date.year) {
    return null;
  }
  const year = date.year.padStart(4, '0');
  const month = (date?.month ?? '1').padStart(2, '0');
  const day = (date?.day ?? '1').padStart(2, '0');

  return new Date(`${year}-${month}-${day}T12:00:00.000Z`);
};

export const getDateFnsLocale = (language: string) => {
  if (language === 'nob' || language === 'nno') {
    return norwegianDateLocale;
  }
  return englishDateLocale;
};

export const getDatePickerLocaleText = (language: string) => {
  if (language === 'nob' || language === 'nno') {
    return norwegianPickerLocale.components.MuiLocalizationProvider.defaultProps.localeText;
  }
  return englishPickerLocale.components.MuiLocalizationProvider.defaultProps.localeText;
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
