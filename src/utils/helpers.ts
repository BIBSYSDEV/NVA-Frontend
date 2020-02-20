// Method that retrieves the value of a (potentially) dotted keyString from a object
export const getObjectValueByFieldName = (object: any, keyString: string) => {
  return keyString.split('.').reduce((obj, key): any => obj && obj[key], object);
};

// Remove duplicates filtered by SCN
export const removeDuplicatesByScn = (list: any[]) => {
  return [...new Map(list.map(item => [item.systemControlNumber, item])).values()];
};
