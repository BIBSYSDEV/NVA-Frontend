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

export const orderedLanguages = [
  LanguageCodes.NORWEGIAN_BOKMAL,
  LanguageCodes.NORWEGIAN_NYNORSK,
  LanguageCodes.ENGLISH,
  LanguageCodes.DANISH,
  LanguageCodes.FINNISH,
  LanguageCodes.FRENCH,
  LanguageCodes.ICELANDIC,
  LanguageCodes.ITALIAN,
  LanguageCodes.DUTCH,
  LanguageCodes.PORTUGUESE,
  LanguageCodes.RUSSIAN,
  LanguageCodes.SAMI,
  LanguageCodes.SPANISH,
  LanguageCodes.SWEDISH,
  LanguageCodes.GERMAN,
  LanguageCodes.OTHER,
];

export const pageLanguages = [
  {
    name: 'English',
    code: LanguageCodes.ENGLISH,
  },
  {
    name: 'Norsk (bokmål)',
    code: LanguageCodes.NORWEGIAN_BOKMAL,
  },
];
