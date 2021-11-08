import i18n from '../translations/i18n';
import { LanguageString } from '../types/common.types';
import { LanguageCodes } from '../types/language.types';

// Map from three letter language to two ("nob" -> "no")
export const getPreferredLanguageCode = (language?: string) => {
  const currentLanguage = language || i18n.language;
  if (currentLanguage === LanguageCodes.NORWEGIAN_BOKMAL || currentLanguage === LanguageCodes.NORWEGIAN_NYNORSK) {
    return 'nb';
  } else {
    return 'en';
  }
};

// Get label based on selected language
export const getLanguageString = (labels: LanguageString) => {
  const preferredLanguageCode = getPreferredLanguageCode();
  if (Object.keys(labels).includes(preferredLanguageCode)) {
    return labels[preferredLanguageCode];
  }
  return Object.values(labels)[0];
};
