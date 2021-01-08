interface PropertySearch {
  key: string;
  value: string | string[]; // Can check for one of multiple values
}
export interface SearchConfig {
  searchTerm?: string;
  properties?: PropertySearch[];
  canMatchAnyProperty?: boolean; // Whether to use "OR" or "AND" operator for each property check
  canMatchAnySubquery?: boolean; // Whether to use "OR" or "AND" operator for each subquery
}

const createSearchTermFilter = (searchTerm?: string) => (searchTerm ? `*${searchTerm}*` : '');

const createPropertyFilter = (properties?: PropertySearch[], canMatchAnyProperty?: boolean) =>
  properties && properties.length > 0
    ? `(${properties
        .map(({ key, value }) => `${key}="${Array.isArray(value) ? value.join('" OR "') : value}"`)
        .join(canMatchAnyProperty ? ' OR ' : ' AND ')})`
    : '';

export const createSearchQuery = (searchConfig: SearchConfig) => {
  const textSearch = createSearchTermFilter(searchConfig.searchTerm);
  const propertySearch = createPropertyFilter(searchConfig.properties, searchConfig.canMatchAnyProperty);

  const searchQuery = [textSearch, propertySearch]
    .filter((search) => !!search)
    .join(searchConfig.canMatchAnySubquery ? ' OR ' : ' AND ');
  return searchQuery;
};
