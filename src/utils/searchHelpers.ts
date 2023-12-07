import { ResultParam } from '../api/searchApi';

export enum SearchParam {
  From = 'from',
  OrderBy = 'orderBy',
  Query = 'query',
  Results = 'results',
  SortOrder = 'sortOrder',
  Type = 'type',
  Page = 'page',
  Name = 'name',
}

export enum ExpressionStatement {
  Contains,
  NotContaining,
}

export interface PropertySearch {
  fieldName: string;
  value: string | string[]; // Can check for one or multiple values
  operator?: ExpressionStatement;
}
export interface SearchConfig {
  searchTerm?: string;
  properties?: PropertySearch[];
}

export const emptySearchConfig: SearchConfig = {
  searchTerm: '',
  properties: [],
};

export const createSearchConfigFromSearchParams = (params: URLSearchParams): SearchConfig => {
  const searchTerm = params.get(ResultParam.Query) ?? '';
  const titleParams = params.get(ResultParam.Title)?.split(',') ?? [];
  const contributorNameParams = params.get(ResultParam.ContributorShould)?.split(',') ?? [];

  const titleFilters = titleParams.map((title) => ({
    fieldName: ResultParam.Title,
    value: title,
    operator: ExpressionStatement.Contains,
  }));

  const contributorNameFilters = contributorNameParams.map((contributorName) => ({
    fieldName: ResultParam.ContributorShould,
    value: contributorName,
    operator: ExpressionStatement.Contains,
  }));
  const properties = [...titleFilters, ...contributorNameFilters];

  return { searchTerm, properties };
};

export const removeSearchParamValue = (params: URLSearchParams, key: string, value: string) => {
  // TODO: reuse for person and project
  const selectedValues = params.get(key)?.split(',') ?? [];
  const newValues = selectedValues.filter((selectedValue) => selectedValue !== value);
  if (newValues.length === 0) {
    params.delete(key);
  } else {
    params.set(key, newValues.join(','));
  }
  return params;
};
