export type EnumDictionary<T extends string, U> = {
  [K in T]: U;
};
