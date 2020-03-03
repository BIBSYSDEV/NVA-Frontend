// Remove duplicates filtered by SCN
export const removeDuplicatesByScn = (list: any[]) => {
  return [...new Map(list.map(item => [item.systemControlNumber, item])).values()];
};
