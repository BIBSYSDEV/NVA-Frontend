import { TFunction } from 'i18next';
import i18n, { selectThreeLetterLanguageCode } from '../translations/i18n';
import { LanguageString } from '../types/common.types';
import { UrlPathTemplate } from './urlPaths';
import { LanguageCode } from '../layout/header/LanguageSelector';
import { useTranslation } from 'react-i18next';

/* The internal i18n system seems to operate with a two letter code which will be returned if you only use i18n.language.
 * This hook runs it through a converter before its returned */
export const useThreeLetterLanguageCode = (): LanguageCode => {
  const { i18n } = useTranslation();
  return selectThreeLetterLanguageCode(i18n.language) as LanguageCode;
};

// Map from three letter language to two ("nob" -> "no")
export const getPreferredLanguageCode = (language?: string) => {
  const currentLanguage = language || i18n.language;
  if (currentLanguage === 'nob') {
    return 'nb';
  } else if (currentLanguage === 'nno') {
    return 'nn';
  } else if (currentLanguage === 'nor') {
    return 'no';
  } else {
    return 'en';
  }
};

// Get label based on selected language
export const getLanguageString = (labels?: LanguageString, preferredLanguageCode?: 'nb' | 'nn' | 'no' | 'en') => {
  if (!labels || Object.keys(labels).length === 0) {
    return '';
  }
  preferredLanguageCode = preferredLanguageCode ?? getPreferredLanguageCode();

  let translatedString = '';

  switch (preferredLanguageCode) {
    case 'nb':
      translatedString = labels['nb'] || labels['no'] || labels['nn'] || labels['en'];
      break;
    case 'nn':
      translatedString = labels['nn'] || labels['no'] || labels['nb'] || labels['en'];
      break;
    case 'no':
      translatedString = labels['no'] || labels['nb'] || labels['nn'] || labels['en'];
      break;
    case 'en':
      translatedString = labels['en'] || labels['no'] || labels['nb'] || labels['nn'];
      break;
    default:
      translatedString = labels[preferredLanguageCode];
      break;
  }

  if (!translatedString) {
    translatedString = labels[Object.keys(labels)[0]];
  }

  return translatedString;
};

/**
 * Returns the appropriate heading for the source registration based on the current context.
 * @param t - Translation function from i18next
 * @returns Localized string for either "Import candidate" or "Unpublished result"
 */
export const getSourceRegistrationHeading = (t: TFunction) => {
  if (location.pathname.startsWith(UrlPathTemplate.BasicDataCentralImport)) {
    return t('basic_data.central_import.import_candidate');
  }
  return t('unpublished_result');
};
