import countries from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import nbCountries from 'i18n-iso-countries/langs/nb.json';
import nnCountries from 'i18n-iso-countries/langs/nn.json';
import { normalizeToIso6391 } from '../translations/translation-helpers';

countries.registerLocale(enCountries);
countries.registerLocale(nbCountries);
countries.registerLocale(nnCountries);

export const getCountries = (language: string) => {
  const lang = normalizeToIso6391(language);
  return countries.getNames(lang);
};
