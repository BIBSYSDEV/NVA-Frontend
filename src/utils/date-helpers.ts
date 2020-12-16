import { nb as norwegianLocale, enUS as englishLocale } from 'date-fns/locale';
import { LanguageCodes } from '../types/language.types';

export const displayDate = (date: { year: string; month?: string; day?: string }): Date | string => {
  if (date.month && date.day) {
    return new Date(+date.year, +date.month - 1, +date.day).toLocaleDateString();
  } else {
    return date.year;
  }
};

export const getDateFnsLocale = (language: string) => {
  if (language === LanguageCodes.NORWEGIAN_BOKMAL || language === LanguageCodes.NORWEGIAN_NYNORSK) {
    return norwegianLocale;
  }
  return englishLocale;
};
