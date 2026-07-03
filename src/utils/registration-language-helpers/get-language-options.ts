import { getLanguages } from 'nva-language';
import { LanguageCode6393 } from '../../translations/language.types';

// Languages that are used by most registrations and should be displayed at the top of the list in the language selector
const primaryLanguageCodesIso6393 = ['eng', 'nob', 'nno', 'sme', 'sma', 'smj', 'mul'];

/**
 * Returns languages from the nva-language package split into two groups:
 * primary languages in a fixed order, and the remaining languages sorted alphabetically in the current UI language.
 * @param appLanguage - The current UI language code, used to sort restOfLanguages alphabetically
 */
export const getLanguageOptions = (appLanguage: LanguageCode6393) => {
  const allLanguages = getLanguages();

  const primaryLanguages = primaryLanguageCodesIso6393.flatMap((code) => {
    const language = allLanguages.find((lang) => lang.iso6393Code === code);
    return language ? [language] : [];
  });

  const restOfLanguages = allLanguages
    .filter((lang) => !primaryLanguageCodesIso6393.includes(lang.iso6393Code))
    .sort((a, b) => {
      if (a.iso6393Code === 'und') return 1;
      if (b.iso6393Code === 'und') return -1;
      return a.iso6393Code.localeCompare(b.iso6393Code, appLanguage);
    });

  return { primaryLanguages, restOfLanguages };
};
