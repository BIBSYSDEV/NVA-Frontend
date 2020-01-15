// Method that retrieves the value of a (potentially) dotted keyString from a object
export const getObjectValueByFieldName = (object: any, keyString: string) => {
  return keyString.split('.').reduce((obj, key): any => obj && obj[key], object);
};

// Function that removes duplicates in a list by a compareBy string
export const getUniqueList = (list: any[], compareBy: string) => {
  const unique = list
    .map((e: any) => e[compareBy])

    // store the keys of the unique objects
    .map((e: any, i: any, final: any) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter((e: any) => list[e])
    .map((e: any) => list[e]);

  return unique;
};
