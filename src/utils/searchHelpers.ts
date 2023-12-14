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
}

export const createSearchConfigFromSearchParams = (params: URLSearchParams) => {
  const searchTerm = params.get(ResultParam.Query) ?? '';
  const titleParams = params.get(ResultParam.Title)?.split(',') ?? [];
  const contributorNameParams = params.get(ResultParam.ContributorName)?.split(',') ?? [];

  const titleFilters = titleParams.map((title) => ({
    fieldName: ResultParam.Title,
    value: title,
  }));

  const contributorNameFilters = contributorNameParams.map((contributorName) => ({
    fieldName: ResultParam.ContributorName,
    value: contributorName,
  }));
  const properties = [...titleFilters, ...contributorNameFilters];

  return { searchTerm, properties };
};

export const removeSearchParamValue = (params: URLSearchParams, key: string, value: string) => {
  const selectedValues = params.get(key)?.split(',') ?? [];
  const newValues = selectedValues.filter((selectedValue) => selectedValue !== value);
  if (newValues.length === 0) {
    params.delete(key);
  } else {
    params.set(key, newValues.join(','));
  }
  return params;
};
