import { useLocation } from 'react-router-dom';
import {
  CustomerResultParam,
  FetchCustomerResultsParams,
  FetchResultsParams,
  ResultParam,
  ResultSearchOrder,
  SortOrder,
} from '../../api/searchApi';
import { PublicationInstanceType, RegistrationStatus } from '../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../constants';
import { SearchParam } from '../searchHelpers';

const defaultRowsPerPage = ROWS_PER_PAGE_OPTIONS[0];

type SearchParamType = FetchResultsParams & FetchCustomerResultsParams;

export const useRegistrationsQueryParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return {
    abstract: searchParams.get(ResultParam.Abstract),
    category: searchParams.get(ResultParam.Category) as PublicationInstanceType | null,
    contributor: searchParams.get(ResultParam.Contributor),
    contributorName: searchParams.get(ResultParam.ContributorName),
    course: searchParams.get(ResultParam.Course),
    cristinIdentifier: searchParams.get(ResultParam.CristinIdentifier),
    files: searchParams.get(ResultParam.Files),
    doi: searchParams.get(ResultParam.Doi),
    from: Number(searchParams.get(ResultParam.From) ?? 0),
    fundingIdentifier: searchParams.get(ResultParam.FundingIdentifier),
    fundingSource: searchParams.get(ResultParam.FundingSource),
    handle: searchParams.get(ResultParam.Handle),
    id: searchParams.get(ResultParam.Identifier),
    isbn: searchParams.get(ResultParam.Isbn),
    issn: searchParams.get(ResultParam.Issn),
    journal: searchParams.get(ResultParam.Journal),
    order: searchParams.get(ResultParam.Order) as ResultSearchOrder | null,
    publicationYearSince: searchParams.get(ResultParam.PublicationYearSince),
    publicationYearBefore: searchParams.get(ResultParam.PublicationYearBefore),
    publisher: searchParams.get(ResultParam.Publisher),
    query: searchParams.get(ResultParam.Query),
    results: Number(searchParams.get(SearchParam.Results) ?? defaultRowsPerPage),
    scientificIndex: searchParams.get(ResultParam.ScientificIndex),
    series: searchParams.get(ResultParam.Series),
    sort: searchParams.get(ResultParam.Sort) as SortOrder | null,
    status: searchParams.get(CustomerResultParam.Status) as RegistrationStatus[] | null,
    tags: searchParams.get(ResultParam.Tags),
    title: searchParams.get(ResultParam.Title),
    topLevelOrganization: searchParams.get(ResultParam.TopLevelOrganization),
  } satisfies SearchParamType;
};
