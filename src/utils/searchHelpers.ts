interface PropertySearch {
  fieldName: string;
  value: string | string[]; // Can check for one or multiple values
}
export interface SearchConfig {
  searchTerm?: string;
  properties?: PropertySearch[];
}

// Since these Operators will be used in joins they must be enclosed by whitespaces
enum Operator {
  AND = ' AND ',
  OR = ' OR ',
}

const createPropertyFilter = (properties?: PropertySearch[]) => {
  const propertiesWithValues = properties?.filter(({ fieldName, value }) => fieldName && value);
  if (!propertiesWithValues || propertiesWithValues.length === 0) {
    return '';
  }

  const propertyFilter = propertiesWithValues
    .map(({ fieldName, value }) => {
      const valueString = Array.isArray(value) ? value.map((v) => `"${v}"`).join(Operator.OR) : `"${value}"`;
      return `(${fieldName}:${valueString})`;
    })
    .join(Operator.AND);

  return propertyFilter;
};

export const createSearchQuery = (searchConfig: SearchConfig) => {
  const textSearch = searchConfig.searchTerm;
  const propertySearch = createPropertyFilter(searchConfig.properties);

  const searchQuery = [textSearch, propertySearch].filter((search) => !!search).join(Operator.AND);
  return searchQuery;
};

export const createSearchConfigFromSearchParams = (params: URLSearchParams): SearchConfig => {
  const query = params.get('query');
  const filters = query?.split('AND').map((a) => a.trim());
  if (!filters) {
    return { searchTerm: '', properties: [] };
  }

  const searchTermIndex = filters?.findIndex((filter) => filter && !filter.startsWith('(') && !filter.endsWith(')'));
  const searchTerm = searchTermIndex >= 0 ? filters.splice(searchTermIndex, 1)[0] : '';

  const properties: PropertySearch[] = filters.map((filter) => {
    // Remove parentheses
    const formattedFilter = filter.substring(1, filter.length - 1);
    const [fieldName, value] = formattedFilter.split(':');

    return {
      fieldName,
      value:
        value.startsWith('"') && value.endsWith('"')
          ? value.substring(1, value.length - 1) // Remove surrounding "
          : value,
    };
  });

  return { searchTerm, properties };
};
