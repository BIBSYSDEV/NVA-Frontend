import countries from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import nbCountries from 'i18n-iso-countries/langs/nb.json';
import nnCountries from 'i18n-iso-countries/langs/nn.json';
import { getIso6393Language } from '../translations/i18n';
import { getIso6391InPreferredLanguage } from './translation-helpers';

countries.registerLocale(enCountries);
countries.registerLocale(nbCountries);
countries.registerLocale(nnCountries);

export const getCountries = (language: string) => {
  const preferredLanguageCode = getIso6391InPreferredLanguage(getIso6393Language(language));
  const countryNames = countries.getNames(preferredLanguageCode);
  return countryNames;
};
