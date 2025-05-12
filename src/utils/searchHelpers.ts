import { FilterOptionsState } from '@mui/material';
import { Query, QueryClient } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { NavigateFunction } from 'react-router';
import { FetchTicketsParams, ResultParam, TicketSearchParam } from '../api/searchApi';
import { FundingSource } from '../types/project.types';
import { TicketType } from '../types/publication_types/ticket.types';
import { AggregationFileKeyType } from '../types/registration.types';
import { User } from '../types/user.types';

export enum SearchParam {
  From = 'from',
  Query = 'query',
  Results = 'results',
  Type = 'type',
  Page = 'page',
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
    if (key === ResultParam.ScientificReportPeriodSinceParam) {
      params.delete(ResultParam.ScientificReportPeriodBeforeParam);
    }
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

const commonTaskNotificationsParams: FetchTicketsParams = {
  results: 0,
  aggregation: 'all',
};

export const getTaskNotificationsParams = (user: User | null): FetchTicketsParams => {
  const typeParam = [
    user?.isPublishingCurator && ('PublishingRequest' satisfies TicketType),
    user?.isThesisCurator && ('FilesApprovalThesis' satisfies TicketType),
    user?.isDoiCurator && ('DoiRequest' satisfies TicketType),
    user?.isSupportCurator && ('GeneralSupportCase' satisfies TicketType),
  ]
    .filter(Boolean)
    .join(',');

  return {
    ...commonTaskNotificationsParams,
    type: typeParam,
  };
};

export const getDialogueNotificationsParams = (username?: string): FetchTicketsParams => ({
  ...commonTaskNotificationsParams,
  owner: username,
  viewedByNot: username,
});

export const keepSimilarPreviousData = <T>(
  previousData: T | undefined,
  query: Query<T, Error, T, (string | number)[]> | undefined,
  searchTerm: string
) => {
  // Keep previous data if query has the same search term
  if (searchTerm && query?.queryKey.includes(searchTerm)) {
    return previousData;
  }
};

export const dataSearchFieldAttributeName = 'data-searchfield';
/**
 * Takes one URLSearchParams object and adds or removes values from other HTML input nodes with
 * the "data-searchfield" attribute to ensure that all params are in sync with the HTML.
 */
export const syncParamsWithSearchFields = (params: URLSearchParams) => {
  const searchFieldElements = document.querySelectorAll(
    `input[${dataSearchFieldAttributeName}]`
  ) as NodeListOf<HTMLInputElement>;

  searchFieldElements.forEach((element) => {
    const fieldName = element.getAttribute(dataSearchFieldAttributeName);
    if (fieldName) {
      if (element.value) {
        params.set(fieldName, element.value);
      } else if (params.has(fieldName)) {
        params.delete(fieldName);
      }
    }
  });

  return params;
};

export const resetPaginationAndNavigate = (params: URLSearchParams, navigate: NavigateFunction) => {
  const syncedParams = syncParamsWithSearchFields(params);
  syncedParams.delete(TicketSearchParam.From);
  navigate({ search: syncedParams.toString() });
};

export const fundingSourceAutocompleteFilterOptions = (
  options: FundingSource[],
  state: FilterOptionsState<FundingSource>
) => {
  const filter = state.inputValue.toLocaleLowerCase();
  return options.filter((option) => {
    const names = Object.values(option.name).map((name) => name.toLocaleLowerCase());
    const identifier = option.identifier.toLocaleLowerCase();
    return identifier.includes(filter) || names.some((name) => name.includes(filter));
  });
};

// Note: The waiting time is a bit arbitrary, but it should be enough time for the reindexing to finish in many cases.
export const invalidateQueryKeyDueToReindexing = (queryClient: QueryClient, key: string, waitMs = 6_000) => {
  setTimeout(() => {
    queryClient.invalidateQueries({ queryKey: [key] });
  }, waitMs);
};
