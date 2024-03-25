import { SearchResponse, SearchResponse2 } from '../types/common.types';
import { ImportCandidateAggregations, ImportCandidateSummary } from '../types/importCandidate.types';
import { NviCandidate, NviCandidateSearchResponse, ScientificIndexStatuses } from '../types/nvi.types';
import { CustomerTicketSearchResponse, TicketSearchResponse } from '../types/publication_types/ticket.types';
import { PublicationInstanceType, Registration, RegistrationAggregations } from '../types/registration.types';
import { CristinPerson } from '../types/user.types';
import { SearchApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest2 } from './apiRequest';

export enum TicketSearchParam {
  Aggregation = 'aggregation',
  Assignee = 'assignee',
  ExcludeSubUnits = 'excludeSubUnits',
  From = 'from',
  OrderBy = 'orderBy',
  Owner = 'owner',
  Query = 'query',
  Results = 'results',
  Role = 'role',
  SortOrder = 'sortOrder',
  Status = 'status',
  ViewedByNot = 'viewedByNot',
  ViewingScope = 'viewingScope',
}

export interface FetchTicketsParams {
  [TicketSearchParam.Aggregation]?: 'all' | null;
  [TicketSearchParam.Assignee]?: string | null;
  [TicketSearchParam.ExcludeSubUnits]?: boolean | null;
  [TicketSearchParam.From]?: number | null;
  [TicketSearchParam.OrderBy]?: 'createdDate' | null;
  [TicketSearchParam.Owner]?: string | null;
  [TicketSearchParam.Query]?: string | null;
  [TicketSearchParam.Results]?: number | null;
  [TicketSearchParam.Role]?: 'creator';
  [TicketSearchParam.SortOrder]?: 'desc' | 'asc' | null;
  [TicketSearchParam.Status]?: string | null;
  [TicketSearchParam.ViewedByNot]?: string | null;
  [TicketSearchParam.ViewingScope]?: string | null;
}

export const fetchTickets = async (params: FetchTicketsParams) => {
  const searchParams = new URLSearchParams();
  if (params.query) {
    searchParams.set(TicketSearchParam.Query, params.query);
  }
  if (params.role) {
    searchParams.set(TicketSearchParam.Role, params.role);
  }
  if (params.viewingScope) {
    searchParams.set(TicketSearchParam.ViewingScope, params.viewingScope);
  }
  if (params.excludeSubUnits) {
    searchParams.set(TicketSearchParam.ExcludeSubUnits, 'true');
  }

  searchParams.set(TicketSearchParam.From, (params.from ?? 0).toString());
  searchParams.set(TicketSearchParam.Results, (params.results ?? 10).toString());
  searchParams.set(TicketSearchParam.OrderBy, params.orderBy || 'createdDate');
  searchParams.set(TicketSearchParam.SortOrder, params.sortOrder || 'desc');

  const getTickets = await authenticatedApiRequest2<TicketSearchResponse>({
    url: `${SearchApiPath.Tickets}?${searchParams.toString()}`,
  });

  return getTickets.data;
};

export const fetchCustomerTickets = async (params: FetchTicketsParams) => {
  const searchParams = new URLSearchParams();

  if (params.aggregation) {
    searchParams.set(TicketSearchParam.Aggregation, params.aggregation);
  }

  if (params.owner) {
    searchParams.set(TicketSearchParam.Owner, params.owner);
  }

  if (params.viewedByNot) {
    searchParams.set(TicketSearchParam.ViewedByNot, params.viewedByNot);
  }

  searchParams.set(TicketSearchParam.From, (params.from ?? 0).toString());
  searchParams.set(TicketSearchParam.Results, (params.results ?? 10).toString());
  searchParams.set(TicketSearchParam.OrderBy, params.orderBy || 'createdDate');
  searchParams.set(TicketSearchParam.SortOrder, params.sortOrder || 'desc');

  const getTickets = await authenticatedApiRequest2<CustomerTicketSearchResponse>({
    url: `${SearchApiPath.CustomerTickets}?${searchParams.toString()}`,
  });

  return getTickets.data;
};

export type SortOrder = 'desc' | 'asc';
export type ImportCandidateOrderBy = 'createdDate' | 'importStatus.modifiedDate';

export interface FetchImportCandidatesParams {
  query?: string;
  orderBy?: ImportCandidateOrderBy;
  sortOrder?: SortOrder;
}

export const fetchImportCandidates = async (
  results: number,
  from: number,
  { query, orderBy, sortOrder }: FetchImportCandidatesParams
) => {
  const params = new URLSearchParams();
  params.set('results', results.toString());
  params.set('from', from.toString());
  if (query) {
    params.set('query', query);
  }
  if (orderBy) {
    params.set('orderBy', orderBy);
  }
  if (sortOrder) {
    params.set('sortOrder', sortOrder);
  }
  const paramsString = params.toString();

  const getImportCandidates = await authenticatedApiRequest2<
    SearchResponse<ImportCandidateSummary, ImportCandidateAggregations>
  >({
    url: `${SearchApiPath.ImportCandidates}?${paramsString}`,
  });

  return getImportCandidates.data;
};

export const fetchEmployees = async (
  organizationId: string,
  results: number,
  page: number,
  nameQuery = '',
  signal?: AbortSignal
) => {
  if (!organizationId) {
    return;
  }
  const sortQueryParam = 'sort=name';
  const nameQueryParam = nameQuery ? `&name=${nameQuery}` : '';
  const url = `${organizationId}/persons?page=${page}&${sortQueryParam}&results=${results}${nameQueryParam}`;

  const getEmployees = await authenticatedApiRequest2<SearchResponse<CristinPerson>>({ url, signal });

  return getEmployees.data;
};

export const fetchNviCandidates = async (results: number, from: number, query = '') => {
  const paginationQuery = `size=${results}&offset=${from}`;
  const fullQuery = [query, paginationQuery].filter(Boolean).join('&');

  const getNviCandidates = await authenticatedApiRequest2<NviCandidateSearchResponse>({
    url: `${SearchApiPath.NviCandidate}?${fullQuery}`,
  });

  return getNviCandidates.data;
};

export const fetchNviCandidate = async (identifier: string) => {
  if (!identifier) {
    return;
  }

  const getNviCandidates = await authenticatedApiRequest2<NviCandidate>({
    url: `${SearchApiPath.NviCandidate}/${identifier}`,
  });

  return getNviCandidates.data;
};

export enum ResultParam {
  Abstract = 'abstract',
  Aggregation = 'aggregation',
  Category = 'category',
  CategoryNot = 'categoryNot',
  CategoryShould = 'categoryShould',
  Contributor = 'contributor',
  ContributorName = 'contributorName',
  Course = 'course',
  CristinIdentifier = 'cristinIdentifier',
  Doi = 'doi',
  ExcludeSubunits = 'excludeSubunits',
  Files = 'files',
  From = 'from',
  FundingIdentifier = 'fundingIdentifier',
  FundingSource = 'fundingSource',
  Handle = 'handle',
  Identifier = 'id',
  IdentifierNot = 'idNot',
  Isbn = 'isbn',
  Issn = 'issn',
  Journal = 'journal',
  Order = 'order',
  Project = 'project',
  PublicationLanguageShould = 'publicationLanguageShould',
  PublicationYearBefore = 'publicationYearBefore',
  PublicationYearSince = 'publicationYearSince',
  PublicationYearShould = 'publicationYearShould',
  Publisher = 'publisher',
  Query = 'query',
  Results = 'results',
  ScientificIndex = 'scientificIndex',
  ScientificIndexStatus = 'scientificIndexStatus',
  ScientificReportPeriodBeforeParam = 'scientificReportPeriodBefore',
  ScientificReportPeriodSinceParam = 'scientificReportPeriodSince',
  ScientificValue = 'scientificValue',
  Series = 'series',
  Sort = 'sort',
  Tags = 'tags',
  Title = 'title',
  TopLevelOrganization = 'topLevelOrganization',
  Unit = 'unit',
}

export enum ResultSearchOrder {
  ModifiedDate = 'modifiedDate',
  PublicationDate = 'publicationDate',
}

export interface FetchResultsParams {
  [ResultParam.Abstract]?: string | null;
  [ResultParam.Aggregation]?: 'all' | 'none' | null;
  [ResultParam.Category]?: PublicationInstanceType | null;
  [ResultParam.CategoryNot]?: PublicationInstanceType | null;
  [ResultParam.CategoryShould]?: PublicationInstanceType[];
  [ResultParam.Contributor]?: string | null;
  [ResultParam.ContributorName]?: string | null;
  [ResultParam.Course]?: string | null;
  [ResultParam.CristinIdentifier]?: string | null;
  [ResultParam.Doi]?: string | null;
  [ResultParam.ExcludeSubunits]?: boolean | null;
  [ResultParam.Files]?: string | null;
  [ResultParam.From]?: number | null;
  [ResultParam.FundingIdentifier]?: string | null;
  [ResultParam.FundingSource]?: string | null;
  [ResultParam.Handle]?: string | null;
  [ResultParam.Identifier]?: string | null;
  [ResultParam.IdentifierNot]?: string | null;
  [ResultParam.Isbn]?: string | null;
  [ResultParam.Issn]?: string | null;
  [ResultParam.Journal]?: string | null;
  [ResultParam.Order]?: ResultSearchOrder | null;
  [ResultParam.Project]?: string | null;
  [ResultParam.PublicationLanguageShould]?: string | null;
  [ResultParam.PublicationYearBefore]?: string | null;
  [ResultParam.PublicationYearSince]?: string | null;
  [ResultParam.PublicationYearShould]?: string | null;
  [ResultParam.Publisher]?: string | null;
  [ResultParam.Query]?: string | null;
  [ResultParam.Results]?: number | null;
  [ResultParam.Series]?: string | null;
  [ResultParam.ScientificIndex]?: string | null;
  [ResultParam.ScientificIndexStatus]?: ScientificIndexStatuses | null;
  [ResultParam.ScientificReportPeriodBeforeParam]?: string | null;
  [ResultParam.ScientificReportPeriodSinceParam]?: string | null;
  [ResultParam.ScientificValue]?: string | null;
  [ResultParam.Sort]?: SortOrder | null;
  [ResultParam.Tags]?: string | null;
  [ResultParam.Title]?: string | null;
  [ResultParam.TopLevelOrganization]?: string | null;
  [ResultParam.Unit]?: string | null;
}

export const fetchResults = async (params: FetchResultsParams, signal?: AbortSignal) => {
  const searchParams = new URLSearchParams();

  if (params.abstract) {
    searchParams.set(ResultParam.Abstract, encodeURIComponent(params.abstract));
  }
  if (params.aggregation) {
    searchParams.set(ResultParam.Aggregation, params.aggregation);
  } else {
    searchParams.set(ResultParam.Aggregation, 'none');
  }
  if (params.category) {
    searchParams.set(ResultParam.Category, params.category);
  }
  if (params.categoryNot) {
    searchParams.set(ResultParam.CategoryNot, params.categoryNot);
  }
  if (params.categoryShould && params.categoryShould.length > 0) {
    searchParams.set(ResultParam.CategoryShould, params.categoryShould.join(','));
  }
  if (params.contributor) {
    searchParams.set(ResultParam.Contributor, encodeURIComponent(params.contributor));
  }
  if (params.contributorName) {
    searchParams.set(ResultParam.ContributorName, params.contributorName);
  }
  if (params.course) {
    searchParams.set(ResultParam.Course, params.course);
  }
  if (params.cristinIdentifier) {
    searchParams.set(ResultParam.CristinIdentifier, params.cristinIdentifier);
  }
  if (params.doi) {
    searchParams.set(ResultParam.Doi, params.doi);
  }
  if (params.excludeSubunits) {
    searchParams.set(ResultParam.ExcludeSubunits, params.excludeSubunits.toString());
  }
  if (params.files) {
    searchParams.set(ResultParam.Files, params.files);
  }
  if (params.fundingIdentifier) {
    searchParams.set(ResultParam.FundingIdentifier, params.fundingIdentifier);
  }
  if (params.fundingSource) {
    searchParams.set(ResultParam.FundingSource, params.fundingSource);
  }
  if (params.handle) {
    searchParams.set(ResultParam.Handle, params.handle);
  }
  if (params.id) {
    searchParams.set(ResultParam.Identifier, params.id);
  }
  if (params.idNot) {
    searchParams.set(ResultParam.IdentifierNot, params.idNot);
  }
  if (params.isbn) {
    searchParams.set(ResultParam.Isbn, params.isbn.replace(/-/g, ''));
  }
  if (params.issn) {
    searchParams.set(ResultParam.Issn, params.issn);
  }
  if (params.journal) {
    searchParams.set(ResultParam.Journal, params.journal);
  }
  if (params.project) {
    searchParams.set(ResultParam.Project, params.project);
  }
  if (params.publicationLanguageShould) {
    searchParams.set(ResultParam.PublicationLanguageShould, params.publicationLanguageShould);
  }
  if (params.publicationYearBefore) {
    const beforeYearNumber = +params.publicationYearBefore;
    if (!params.publicationYearSince || +params.publicationYearSince <= beforeYearNumber) {
      // Add one year, to include the "before" year as well
      searchParams.set(ResultParam.PublicationYearBefore, (beforeYearNumber + 1).toString());
    }
  }
  if (params.publicationYearSince) {
    if (!params.publicationYearBefore || +params.publicationYearSince <= +params.publicationYearBefore) {
      searchParams.set(ResultParam.PublicationYearSince, params.publicationYearSince);
    }
  }
  if (params.publicationYearShould) {
    searchParams.set(ResultParam.PublicationYearShould, params.publicationYearShould);
  }
  if (params.publisher) {
    searchParams.set(ResultParam.Publisher, params.publisher);
  }
  if (params.query) {
    searchParams.set(ResultParam.Query, params.query);
  }
  if (params.scientificIndex) {
    searchParams.set(ResultParam.ScientificReportPeriodBeforeParam, (+params.scientificIndex + 1).toString());
    searchParams.set(ResultParam.ScientificReportPeriodSinceParam, params.scientificIndex);
  }
  if (params.scientificIndexStatus) {
    searchParams.set(ResultParam.ScientificIndexStatus, params.scientificIndexStatus);
  }
  if (params.scientificValue) {
    searchParams.set(ResultParam.ScientificValue, params.scientificValue);
  }
  if (params.series) {
    searchParams.set(ResultParam.Series, params.series);
  }
  if (params.tags) {
    searchParams.set(ResultParam.Tags, encodeURIComponent(params.tags));
  }
  if (params.title) {
    searchParams.set(ResultParam.Title, params.title);
  }
  if (params.topLevelOrganization) {
    searchParams.set(ResultParam.TopLevelOrganization, encodeURIComponent(params.topLevelOrganization));
  }
  if (params.unit) {
    searchParams.set(ResultParam.Unit, params.unit);
  }

  searchParams.set(ResultParam.From, typeof params.from === 'number' ? params.from.toString() : '0');
  searchParams.set(ResultParam.Results, typeof params.results === 'number' ? params.results.toString() : '10');
  searchParams.set(ResultParam.Order, params.order ?? 'modifiedDate');
  searchParams.set(ResultParam.Sort, params.sort ?? 'desc');

  const getResults = await apiRequest2<SearchResponse2<Registration, RegistrationAggregations>>({
    url: `${SearchApiPath.Registrations}?${searchParams.toString()}`,
    signal,
  });

  return getResults.data;
};

export const fetchRegistrationsExport = async (searchParams: URLSearchParams) => {
  searchParams.set(ResultParam.From, '0');
  searchParams.set(ResultParam.Results, '1000');
  const url = `${SearchApiPath.Registrations}?${searchParams.toString()}`;

  const fetchExport = await apiRequest2<string>({ url, headers: { Accept: 'text/csv' } });
  return fetchExport.data;
};
