// Remove duplicates filtered by id
export const removeContributorDuplicatesById = (list: any[]) => {
  return [...new Map(list.map(item => [item.identity.id, item])).values()];
};
