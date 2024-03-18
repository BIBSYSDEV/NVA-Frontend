import { FetchTicketsParams, ResultParam } from '../api/searchApi';
import { TFunction } from 'i18next';
import { AggregationFileKeyType } from '../types/registration.types';

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

export interface PropertySearch {
  fieldName: string;
  value: string | string[]; // Can check for one or multiple values
}

export const createSearchConfigFromSearchParams = (params: URLSearchParams) => {
  const searchTerm = params.get(ResultParam.Query) ?? '';
  const titleParams = params.get(ResultParam.Title)?.split(',') ?? [];
  const contributorNameParams = params.get(ResultParam.ContributorName)?.split(',') ?? [];
  const abstractParams = params.get(ResultParam.Abstract)?.split(',') ?? [];
  const tagParams = params.get(ResultParam.Tags)?.split(',') ?? [];
  const identifierParams = params.get(ResultParam.Identifier)?.split(',') ?? [];
  const isbnParams = params.get(ResultParam.Isbn)?.split(',') ?? [];
  const issnParams = params.get(ResultParam.Issn)?.split(',') ?? [];
  const doiParams = params.get(ResultParam.Doi)?.split(',') ?? [];
  const handleParams = params.get(ResultParam.Handle)?.split(',') ?? [];
  const fundingIdentifierParams = params.get(ResultParam.FundingIdentifier)?.split(',') ?? [];
  const courseParams = params.get(ResultParam.Course)?.split(',') ?? [];
  const cristinIdentifierParams = params.get(ResultParam.CristinIdentifier)?.split(',') ?? [];

  const titleFilters = titleParams.map((title) => ({
    fieldName: ResultParam.Title,
    value: title,
  }));

  const contributorNameFilters = contributorNameParams.map((contributorName) => ({
    fieldName: ResultParam.ContributorName,
    value: contributorName,
  }));

  const abstractFilters = abstractParams.map((abstract) => ({
    fieldName: ResultParam.Abstract,
    value: abstract,
  }));

  const tagFilters = tagParams.map((tag) => ({
    fieldName: ResultParam.Tags,
    value: tag,
  }));

  const identifierFilters = identifierParams.map((identifier) => ({
    fieldName: ResultParam.Identifier,
    value: identifier,
  }));

  const isbnFilters = isbnParams.map((isbn) => ({
    fieldName: ResultParam.Isbn,
    value: isbn,
  }));

  const issnFilters = issnParams.map((issn) => ({
    fieldName: ResultParam.Issn,
    value: issn,
  }));

  const doiFilters = doiParams.map((doi) => ({
    fieldName: ResultParam.Doi,
    value: doi,
  }));

  const handleFilters = handleParams.map((handle) => ({
    fieldName: ResultParam.Handle,
    value: handle,
  }));

  const fundingIdentifierFilters = fundingIdentifierParams.map((fundingIdentifier) => ({
    fieldName: ResultParam.FundingIdentifier,
    value: fundingIdentifier,
  }));

  const courseFilters = courseParams.map((course) => ({
    fieldName: ResultParam.Course,
    value: course,
  }));

  const cristinIdentifierFilters = cristinIdentifierParams.map((cristinIdentifier) => ({
    fieldName: ResultParam.CristinIdentifier,
    value: cristinIdentifier,
  }));

  const properties = [
    ...titleFilters,
    ...contributorNameFilters,
    ...abstractFilters,
    ...tagFilters,
    ...identifierFilters,
    ...isbnFilters,
    ...issnFilters,
    ...doiFilters,
    ...handleFilters,
    ...fundingIdentifierFilters,
    ...courseFilters,
    ...cristinIdentifierFilters,
  ];

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

export const isValidIsbn = (value: string): boolean => {
  return value.startsWith('978-') && value.replaceAll('-', '').length === 13;
};

export const getFileFacetText = (key: AggregationFileKeyType, t: TFunction<'translation'>) => {
  return key === 'hasPublicFiles'
    ? t('registration.files_and_license.registration_with_file')
    : key === 'noFiles'
      ? t('registration.files_and_license.registration_without_file')
      : t('registration.missing_name');
};

export const taskNotificationsParams: FetchTicketsParams = {
  results: 0,
  aggregation: 'all',
};

export const getDialogueNotificationsParams = (username?: string): FetchTicketsParams => ({
  ...taskNotificationsParams,
  owner: username,
  viewedByNot: username,
});
