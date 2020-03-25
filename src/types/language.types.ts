import { EnumDictionary } from './common.types';

export enum LanguageCodes {
  NORWEGIAN_BOKMAL = 'nb',
  NORWEGIAN_NYNORSK = 'nn',
  ENGLISH = 'en',
  DANISH = 'da',
  FINNISH = 'fi',
  FRENCH = 'fr',
  ICELANDIC = 'is',
  ITALIAN = 'it',
  DUTCH = 'nl',
  PORTUGUESE = 'pt',
  RUSSIAN = 'ru',
  SAMI = 'se',
  SPANISH = 'es',
  SWEDISH = 'sv',
  GERMAN = 'de',
  OTHER = 'xx',
}

export enum PageLanguageCodes {
  NORWEGIAN_BOKMAL = 'nb-NO',
  ENGLISH = 'en-US',
}

export const pageLanguages: EnumDictionary<string, string> = {
  [PageLanguageCodes.NORWEGIAN_BOKMAL]: 'Norsk (bokmål)',
  [PageLanguageCodes.ENGLISH]: 'English',
};

export enum LanguageValues {
  NORWEGIAN_BOKMAL = 'http://lexvo.org/id/iso639-3/nob',
  NORWEGIAN_NYNORSK = 'http://lexvo.org/id/iso639-3/nno',
  ENGLISH = 'http://lexvo.org/id/iso639-3/eng',
}

export const publicationLanguages = [
  { id: LanguageCodes.ENGLISH, value: LanguageValues.ENGLISH },
  { id: LanguageCodes.NORWEGIAN_BOKMAL, value: LanguageValues.NORWEGIAN_BOKMAL },
  { id: LanguageCodes.NORWEGIAN_NYNORSK, value: LanguageValues.NORWEGIAN_NYNORSK },
];
