import { registrationFilters } from '../pages/search/filters/AdvancedSearchRow';

export enum SearchParam {
  From = 'from',
  OrderBy = 'orderBy',
  Query = 'query',
  Results = 'results',
  SortOrder = 'sortOrder',
}

export enum ExpressionStatement {
  Contains,
  NotContaining,
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

// Add quoatation marks if no wildcard
const formatValue = (value?: string) => {
  if (!value) {
    return '';
  }
  const hasWildcard = value.includes('*');
  const hasQuotationMarks = value.startsWith('"') && value.endsWith('"');

  if (hasWildcard || hasQuotationMarks) {
    return value;
  } else {
    return `"${value}"`;
  }
};

const stripQuotationMarks = (value: string) => value.replace(/^"+|"+$/g, '');

const createPropertyFilter = (properties?: PropertySearch[]) => {
  const propertiesWithValues = properties?.filter(({ fieldName, value }) => fieldName && value);
  if (!propertiesWithValues || propertiesWithValues.length === 0) {
    return '';
  }

  const propertyFilter = propertiesWithValues
    .map(({ fieldName, value, operator }) => {
      const prefix = operator === ExpressionStatement.NotContaining ? 'NOT' : '';

      const valueString = Array.isArray(value)
        ? value.map((v) => formatValue(v)).join(Operator.OR)
        : formatValue(value);

      return `${prefix}(${fieldName}:${valueString})`;
    })
    .join(Operator.AND);

  return propertyFilter;
};

export const createSearchQuery = (searchConfig: SearchConfig) => {
  const textSearch = formatValue(searchConfig.searchTerm);
  const propertySearch = createPropertyFilter(searchConfig.properties);

  const searchQuery = [textSearch, propertySearch].filter((search) => !!search).join(Operator.AND);
  return searchQuery;
};

export const createSearchConfigFromSearchParams = (params: URLSearchParams): SearchConfig => {
  const query = params.get(SearchParam.Query);
  const filters = query?.split('AND').map((a) => a.trim());
  if (!filters) {
    return { searchTerm: '', properties: [] };
  }
  const searchTermIndex = filters?.findIndex(
    // Find filter that does not point to specific field
    (filter) => filter && !registrationFilters.some((f) => filter.includes(`${f.field}:`))
  );
  const rawSearchTerm = searchTermIndex >= 0 ? filters.splice(searchTermIndex, 1)[0] : '';
  const searchTerm = stripQuotationMarks(rawSearchTerm);

  const properties: PropertySearch[] = filters.map((filter) => {
    // Find operator
    const isNegated = filter.startsWith('NOT');
    // Remove potential NOT prefix
    const filterWithoutOperator = isNegated ? filter.replace('NOT', '') : filter;
    // Remove parentheses
    const formattedFilter = filterWithoutOperator.substring(1, filterWithoutOperator.length - 1);
    const [fieldName, value] = formattedFilter.split(':');

    return {
      fieldName,
      value: stripQuotationMarks(value),
      operator: isNegated ? ExpressionStatement.NotContaining : ExpressionStatement.Contains,
    };
  });

  return { searchTerm, properties };
};
