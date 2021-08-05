export type EnumDictionary<T extends string, U> = {
  [K in T]: U;
};

export interface LanguageString {
  [key: string]: string;
}
