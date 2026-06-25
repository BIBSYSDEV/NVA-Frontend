import { getLanguages } from 'nva-language';
import { LanguageCode } from '../../layout/header/LanguageSelector';
import { getPreferredLanguageCode } from '../translation-helpers';

// Languages that are used by most registrations and should be displayed at the top of the list in the language selector
const primaryLanguageCodes = ['eng', 'nob', 'nno', 'sme', 'sma', 'smj', 'mul'];

/**
 * Returns languages from the nva-language package split into two groups:
 * primary languages in a fixed order, and the remaining languages sorted alphabetically in the current UI language.
 * @param appLanguage - The current UI language code, used to sort restOfLanguages alphabetically
 */
export const getLanguageOptions = (appLanguage: LanguageCode) => {
  const allLanguages = getLanguages();
  const locale = getPreferredLanguageCode(appLanguage);

  const primaryLanguages = primaryLanguageCodes.flatMap((code) => {
    const language = allLanguages.find((lang) => lang.iso6393Code === code);
    return language ? [language] : [];
  });

  const restOfLanguages = allLanguages
    .filter((lang) => !primaryLanguageCodes.includes(lang.iso6393Code))
    .sort((a, b) => a[appLanguage].localeCompare(b[appLanguage], locale));

  return { primaryLanguages, restOfLanguages };
};
