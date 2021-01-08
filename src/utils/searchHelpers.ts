interface PropertySearch {
  key: string;
  value: string | string[]; // Can check for one of multiple values
}
interface SearchConfig {
  searchTerm?: string;
  properties?: PropertySearch[];
  mustMatchAllProperties?: boolean; // Whether to use "AND" or "OR" operator for each property check
  mustMatchAllSubqueries?: boolean; // Whether to use "AND" or "OR" operator for each subquery
}

const createSearchTermFilter = (searchTerm?: string) => (searchTerm ? `*${searchTerm}*` : '');

const createPropertyFilter = (properties?: PropertySearch[], mustMatchAllProperties = true) =>
  properties && properties.length > 0
    ? `(${properties
        .map(({ key, value }) => `${key}="${Array.isArray(value) ? value.join('" OR "') : value}"`)
        .join(mustMatchAllProperties ? ' AND ' : ' OR ')})`
    : '';

export const createSearchQuery = ({
  searchTerm,
  properties,
  mustMatchAllProperties = true,
  mustMatchAllSubqueries = true,
}: SearchConfig) => {
  const textSearch = createSearchTermFilter(searchTerm);
  const propertySearch = createPropertyFilter(properties, mustMatchAllProperties);

  const searchQuery = [textSearch, propertySearch]
    .filter((search) => !!search)
    .join(mustMatchAllSubqueries ? ' AND ' : ' OR ');
  return searchQuery;
};
