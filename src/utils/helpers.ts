// Inspired by https://stackoverflow.com/a/6394168
export const getObjectValueByFieldName = (object: any, keyString: string) => {
  return keyString.split('.').reduce((obj, key): any => obj && obj[key], object);
};
