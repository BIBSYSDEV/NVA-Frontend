import { useTranslation } from 'react-i18next';
import { LanguageCode6391, LanguageCode6393 } from './language.types';

export const samiLanguageCodes = [
  'smi', // General for all sami languages
  'se', // Northern Sami
  'sme', // Northern Sami
  'sma', // Southern Sami
  'smj', // Lule Sami
  'smn', // Inari Sami
  'sms', // Skolt Sami
  'sje', // Pite Sami
  'sju', // Ume Sami
  'sjd', // Kildin Sami
  'sjt', // Ter Sami
];
const norwegianBokmaalLanguages = ['nob', 'nb', 'nb-NO', 'no', 'no-NO', 'nor'];
const norwegianNynorskLanguages = ['nn', 'nno', 'nn-NO'];
const englishLanguages = ['eng', 'en', 'en-US', 'en-GB'];
const handledLanguages = [
  ...englishLanguages,
  ...norwegianBokmaalLanguages,
  ...norwegianNynorskLanguages,
  ...samiLanguageCodes,
];
// langCode can be a stringified 'undefined'/'null' when read from localStorage
const isMissingLanguageCode = (langCode: string | undefined | null): langCode is null | undefined =>
  !langCode || langCode === 'undefined' || langCode === 'null';

/**
 * Maps an arbitrary language code to one of the three ISO 639-3 codes supported by the application:
 * `'eng'`, `'nob'` (Bokmål), or `'nno'` (Nynorsk).
 *
 * Falls back to `'nob'` when the code is missing, `null`, the string `'undefined'`/`'null'`
 * (which can appear when reading from localStorage).
 * Falls back to `'eng'` for unrecognised language codes.
 *
 * @param langCode - BCP 47 tag, ISO 639-1/2/3 code, or a raw localStorage value.
 * @returns The resolved ISO 639-3 code: `'eng'`, `'nob'`, or `'nno'`.
 */
export const normalizeToIso6393 = (langCode: string | undefined | null): LanguageCode6393 => {
  if (isMissingLanguageCode(langCode)) {
    return 'nob'; // When the user's language is not specified, then the service should display in Bokmål
  } else if (englishLanguages.includes(langCode)) {
    return 'eng';
  } else if (!handledLanguages.includes(langCode)) {
    // When the selected language is not handled, then the service should display in English by default
    return 'eng';
  } else if (norwegianNynorskLanguages.includes(langCode)) {
    return 'nno';
  }
  return 'nob';
};
/**
 * Maps an arbitrary language code to one of the three ISO 639-1 codes supported by the application:
 * `'en'`, `'nb'` (Bokmål), or `'nn'` (Nynorsk).
 *
 * Pipes through `normalizeToIso6393` first, so it handles the same range of inputs: BCP 47 tags,
 * ISO 639-1/2/3 codes, raw localStorage values, `null`, and `undefined`.
 * Falls back to `'nb'` when no language code is provided, and to `'en'` for unrecognised language codes.
 *
 * @param language - BCP 47 tag, ISO 639-1/2/3 code, a raw localStorage value, or `null`/`undefined`.
 * @returns The resolved ISO 639-1 code: `'en'`, `'nb'`, or `'nn'`.
 */
export const normalizeToIso6391 = (language?: string | null): LanguageCode6391 => {
  const lang = normalizeToIso6393(language);
  if (lang === 'eng') {
    return 'en';
  } else if (lang === 'nno') {
    return 'nn';
  } else {
    return 'nb';
  }
};
/**
 * React hook that returns the app's current display language normalised to one of the three
 * supported codes languages as an ISO 639-3 code (`'eng'`, `'nob'`, `'nno'`).
 *
 * Subscribes to language changes via `useTranslation`, so the component re-renders automatically
 * when the user switches language. For two-letter codes use `useAppLanguageIn6391Format`.
 *
 * @returns The current app language as an ISO 639-3 code.
 */
export const useAppLanguageInIso6393Format = (): LanguageCode6393 => {
  const { i18n } = useTranslation();
  return normalizeToIso6393(i18n.language);
};
/**
 * React hook that returns the app's current display language as an ISO 639-1 code normalised to one of the three
 * supported codes languages as an ISO 639-1 code (`'en'`, `'nb'`, `'nn'`).
 *
 * Subscribes to language changes via `useTranslation`, so the component re-renders automatically
 * when the user switches language.
 *
 * Use this when the consuming code requires a two-letter code, e.g. for HTML `lang` attributes
 * or third-party APIs that expect ISO 639-1. For three-letter codes use `useAppLanguageInIso6393Format`.
 *
 * @returns The current app language as an ISO 639-1 code.
 */
export const useAppLanguageInIso6391Format = (): LanguageCode6391 => {
  const { i18n } = useTranslation();
  return normalizeToIso6391(i18n.language);
};
