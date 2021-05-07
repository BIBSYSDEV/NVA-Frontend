interface PropertySearch {
  fieldName: string;
  value: string | string[]; // Can check for one or multiple values
  wildcard?: boolean;
}
export interface SearchConfig {
  searchTerm?: string;
  properties?: PropertySearch[];
  canMatchAnyProperty?: boolean; // Whether to use "OR" or "AND" operator for each property check
  canMatchAnySubquery?: boolean; // Whether to use "OR" or "AND" operator for each subquery
}

// Since these Operators will be used in joins they must be enclosed by whitespaces
enum Operator {
  AND = ' AND ',
  OR = ' OR ',
}

const createSearchTermFilter = (searchTerm?: string) => {
  if (!searchTerm) {
    return '';
  }
  return `*${searchTerm}*`;
};

const createPropertyFilter = (properties?: PropertySearch[], canMatchAnyProperty?: boolean) => {
  const propertiesWithValues = properties?.filter(({ fieldName, value }) => fieldName && value);
  if (!propertiesWithValues || propertiesWithValues.length === 0) {
    return '';
  }
  const propertyFilter = `(${propertiesWithValues
    .map(({ fieldName, value, wildcard }) => {
      let valueString = '';
      if (Array.isArray(value)) {
        valueString = wildcard
          ? value.map((v) => `"*${v}*"`).join(Operator.OR)
          : value.map((v) => `"${v}"`).join(Operator.OR);
      } else {
        valueString = wildcard ? `"*${value}*"` : `"${value}"`;
      }

      return `${fieldName}:${valueString}`;
    })
    .join(canMatchAnyProperty ? Operator.OR : Operator.AND)})`;

  return propertyFilter;
};

export const createSearchQuery = (searchConfig: SearchConfig) => {
  const textSearch = createSearchTermFilter(searchConfig.searchTerm);
  const propertySearch = createPropertyFilter(searchConfig.properties, searchConfig.canMatchAnyProperty);

  const searchQuery = [textSearch, propertySearch]
    .filter((search) => !!search)
    .join(searchConfig.canMatchAnySubquery ? Operator.OR : Operator.AND);
  return searchQuery;
};
