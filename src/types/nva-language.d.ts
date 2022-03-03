declare module 'nva-language' {
  interface Language {
    uri: string;
    iso6391Code: string;
    iso6392Codes: string;
    iso6393Code: string;
    eng: string;
    nob: string;
    nno: string;
    sme: string;
  }

  export function getLanguageByBokmaalName(name: string): Language;
  export function getLanguageByEnglishName(name: string): Language;
  export function getLanguageByIso6391Code(code: string): Language;
  export function getLanguageByIso6392Code(code: string): Language;
  export function getLanguageByIso6393Code(code: string): Language;
  export function getLanguageByNynorskName(name: string): Language;
  export function getLanguageBySamiName(name: string): Language;
  export function getLanguageByUri(uri: string): Language;
}
