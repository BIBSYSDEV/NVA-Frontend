export enum ExpressionStatement {
  Excludes = 'NOT',
  Includes = '',
}

export interface PropertySearch {
  fieldName: string;
  value: string | string[]; // Can check for one or multiple values
  operator?: ExpressionStatement;
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

  const propertyFilter = propertiesWithValues
    .map(({ fieldName, value, operator }) => {
      const valueString = Array.isArray(value) ? value.join(Operator.OR) : value;
      return `${operator}(${fieldName}:${valueString})`;
    })
    .join(canMatchAnyProperty ? Operator.OR : Operator.AND);

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
