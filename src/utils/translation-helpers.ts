import i18n from '../translations/i18n';
import { LanguageString } from '../types/common.types';
import isEmpty from 'just-is-empty';

// Map from three letter language to two ("nob" -> "no")
export const getPreferredLanguageCode = (language?: string) => {
  const currentLanguage = language || i18n.language;
  if (currentLanguage === 'nob') {
    return 'nb';
  } else {
    return 'en';
  }
};

// Get label based on selected language
export const getLanguageString = (labels?: LanguageString) => {
  if (!labels) {
    return '';
  }
  const preferredLanguageCode = getPreferredLanguageCode();
  if (Object.keys(labels).includes(preferredLanguageCode)) {
    return labels[preferredLanguageCode];
  }
  return isEmpty(Object.values(labels)[0]) ? '' : Object.values(labels)[0];
};
