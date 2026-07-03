import { useAppLanguageInIso6393Format } from '../../translations/translation-helpers';
import { getLanguageOptions } from './get-language-options';

/**
 * Returns language options from the nva-language package split into primary and rest groups,
 * sorted according to the current UI language.
 * @returns primaryLanguages, restOfLanguages, allLanguages, appLanguage
 */
export const useLanguageOptions = () => {
  const appLanguage = useAppLanguageInIso6393Format();
  const { primaryLanguages, restOfLanguages } = getLanguageOptions(appLanguage);
  const allLanguages = [...primaryLanguages, ...restOfLanguages];

  return { primaryLanguages, restOfLanguages, allLanguages, appLanguage };
};
