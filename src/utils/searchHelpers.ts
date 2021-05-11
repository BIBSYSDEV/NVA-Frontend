export enum ExpressionStatement {
  Contains,
  Equals,
  NotContaining,
  NotEqual,
}

export interface PropertySearch {
  fieldName: string;
  value: string | string[]; // Can check for one or multiple values
  operator: ExpressionStatement;
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

const createSearchTermFilter = (searchTerm?: string) => {
  if (!searchTerm) {
    return '';
  }
  return `*${searchTerm}*`;
};

const createPropertyFilter = (properties?: PropertySearch[]) => {
  const propertiesWithValues = properties?.filter(({ fieldName, value }) => fieldName && value);
  if (!propertiesWithValues || propertiesWithValues.length === 0) {
    return '';
  }

  const propertyFilter = propertiesWithValues
    .map(({ fieldName, value, operator }) => {
      const prefix =
        operator === ExpressionStatement.NotEqual || operator === ExpressionStatement.NotContaining ? 'NOT' : '';
      const wildcard = operator === ExpressionStatement.Contains || operator === ExpressionStatement.NotContaining;

      const valueString = Array.isArray(value)
        ? value.map((val) => (wildcard ? `*${val}*` : `"${val}"`)).join(Operator.OR)
        : wildcard
        ? `*${value}*`
        : `"${value}"`;
      return `${prefix}(${fieldName}:${valueString})`;
    })
    .join(Operator.AND);

  return propertyFilter;
};

export const createSearchQuery = (searchConfig: SearchConfig) => {
  const textSearch = createSearchTermFilter(searchConfig.searchTerm);
  const propertySearch = createPropertyFilter(searchConfig.properties);

  const searchQuery = [textSearch, propertySearch].filter((search) => !!search).join(Operator.AND);
  return searchQuery;
};

export const createSearchConfigFromSearchParams = (params: URLSearchParams): SearchConfig => {
  const query = params.get('query');
  const filters = query?.split('AND').map((a) => a.trim());

  const textFilter =
    filters
      ?.find((f) => f.match(/\*/g)?.length === 2 && !f.includes('(') && !f.includes(')')) // Text query will have two asterisks and no parentheses
      ?.replaceAll('*', '') ?? '';
  const propertyFilters = textFilter ? filters?.slice(1) : filters;

  const properties: PropertySearch[] =
    propertyFilters?.map((propertyFilter) => {
      // Find what to test for (contains, does not contain, etc)
      const isNegated = propertyFilter.startsWith('NOT');
      // Remove negation from text
      const formattedPropertyFilter = isNegated ? propertyFilter.replace('NOT', '') : propertyFilter;
      // Remove parentheses
      const filter = formattedPropertyFilter.slice(1, formattedPropertyFilter.length - 1);
      const isExactMatch = filter.match(/\*/g)?.length === 2;
      // Remove wildcards
      const formattedFilter = isExactMatch ? filter.replaceAll('*', '') : filter;
      const [fieldName, value] = formattedFilter.split(':');

      const operator =
        isNegated && isExactMatch
          ? ExpressionStatement.NotEqual
          : isNegated && !isExactMatch
          ? ExpressionStatement.NotContaining
          : !isNegated && isExactMatch
          ? ExpressionStatement.Equals
          : ExpressionStatement.Contains;

      return { fieldName, value, operator };
    }) ?? [];

  const intialSearchValues: SearchConfig = {
    searchTerm: textFilter,
    properties,
  };
  return intialSearchValues;
};
