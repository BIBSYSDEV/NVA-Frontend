import { useThreeLetterLanguageCode } from '../translation-helpers';
import { getLanguageOptions } from './language-helpers';

/**
 * Returns language options from the nva-language package split into primary and rest groups,
 * sorted according to the current UI language.
 * @returns primaryLanguages, restOfLanguages, allLanguages, appLanguage
 */
export const useLanguageOptions = () => {
  const appLanguage = useThreeLetterLanguageCode();
  const { primaryLanguages, restOfLanguages } = getLanguageOptions(appLanguage);
  const allLanguages = [...primaryLanguages, ...restOfLanguages];

  return { primaryLanguages, restOfLanguages, allLanguages, appLanguage };
};
