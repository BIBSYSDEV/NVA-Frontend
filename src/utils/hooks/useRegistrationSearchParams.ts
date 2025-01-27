import { useLocation } from 'react-router';
import {
  CustomerResultParam,
  FetchCustomerResultsParams,
  FetchResultsParams,
  ResultParam,
  ResultSearchOrder,
  SortOrder,
} from '../../api/searchApi';
import { ScientificIndexStatuses } from '../../types/nvi.types';
import { PublicationInstanceType, RegistrationStatus } from '../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../constants';
import { getObjectEntriesWithValue } from '../general-helpers';
import { SearchParam } from '../searchHelpers';

const defaultRowsPerPage = ROWS_PER_PAGE_OPTIONS[0];

type SearchParamType = FetchResultsParams & FetchCustomerResultsParams;

export const useRegistrationsQueryParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const status = searchParams.get(CustomerResultParam.Status);
  const categoryShould = searchParams.get(ResultParam.CategoryShould);

  const allParams = {
    abstract: searchParams.get(ResultParam.Abstract),
    category: searchParams.get(ResultParam.Category) as PublicationInstanceType | null,
    categoryShould: categoryShould ? (categoryShould.split(',') as PublicationInstanceType[]) : null,
    contributor: searchParams.get(ResultParam.Contributor),
    contributorName: searchParams.get(ResultParam.ContributorName),
    course: searchParams.get(ResultParam.Course),
    cristinIdentifier: searchParams.get(ResultParam.CristinIdentifier),
    excludeSubunits: searchParams.get(ResultParam.ExcludeSubunits) === 'true',
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
    publicationLanguageShould: searchParams.get(ResultParam.PublicationLanguageShould),
    publicationYearSince: searchParams.get(ResultParam.PublicationYearSince),
    publicationYearBefore: searchParams.get(ResultParam.PublicationYearBefore),
    publisher: searchParams.get(ResultParam.Publisher),
    query: searchParams.get(ResultParam.Query),
    results: Number(searchParams.get(SearchParam.Results) ?? defaultRowsPerPage),
    scientificIndexStatus: searchParams.get(ResultParam.ScientificIndexStatus) as ScientificIndexStatuses | null,
    scientificValue: searchParams.get(ResultParam.ScientificValue),
    scientificReportPeriodSince: searchParams.get(ResultParam.ScientificReportPeriodSinceParam),
    scientificReportPeriodBefore: searchParams.get(ResultParam.ScientificReportPeriodBeforeParam),
    series: searchParams.get(ResultParam.Series),
    sort: searchParams.get(ResultParam.Sort) as SortOrder | null,
    status: status ? (status.split(',') as RegistrationStatus[]) : null,
    tags: searchParams.get(ResultParam.Tags),
    title: searchParams.get(ResultParam.Title),
    topLevelOrganization: searchParams.get(ResultParam.TopLevelOrganization),
    unit: searchParams.get(ResultParam.Unit),
    vocabulary: searchParams.get(ResultParam.Vocabulary),
  } satisfies SearchParamType;

  const paramsWithValues: SearchParamType = getObjectEntriesWithValue(allParams);
  return paramsWithValues;
};
