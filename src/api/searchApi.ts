import { SearchResponse, SearchResponse2 } from '../types/common.types';
import {
  CollaborationType,
  ImportCandidateAggregations,
  ImportCandidateStatus,
  ImportCandidateSummary,
} from '../types/importCandidate.types';
import {
  NviCandidate,
  NviCandidateSearchResponse,
  NviCandidateSearchStatus,
  ScientificIndexStatuses,
} from '../types/nvi.types';
import { CustomerTicketSearchResponse } from '../types/publication_types/ticket.types';
import {
  AggregationFileKeyType,
  PublicationInstanceType,
  Registration,
  RegistrationAggregations,
  RegistrationStatus,
} from '../types/registration.types';
import { CristinPerson } from '../types/user.types';
import { SearchApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest2 } from './apiRequest';

export enum TicketSearchParam {
  Aggregation = 'aggregation',
  Assignee = 'assignee',
  CreatedDate = 'createdDate',
  ExcludeSubUnits = 'excludeSubUnits',
  From = 'from',
  OrderBy = 'orderBy',
  Owner = 'owner',
  PublicationType = 'publicationType',
  Query = 'query',
  Results = 'results',
  Role = 'role',
  SortOrder = 'sortOrder',
  Status = 'status',
  Type = 'type',
  ViewedByNot = 'viewedByNot',
  OrganizationId = 'organizationId',
}

export interface FetchTicketsParams {
  [TicketSearchParam.Aggregation]?: 'all' | null;
  [TicketSearchParam.Assignee]?: string | null;
  [TicketSearchParam.CreatedDate]?: string | null;
  [TicketSearchParam.ExcludeSubUnits]?: boolean | null;
  [TicketSearchParam.From]?: number | null;
  [TicketSearchParam.OrderBy]?: 'createdDate' | null;
  [TicketSearchParam.Owner]?: string | null;
  [TicketSearchParam.PublicationType]?: string | null;
  [TicketSearchParam.Query]?: string | null;
  [TicketSearchParam.Results]?: number | null;
  [TicketSearchParam.Role]?: 'creator';
  [TicketSearchParam.SortOrder]?: 'desc' | 'asc' | null;
  [TicketSearchParam.Status]?: string | null;
  [TicketSearchParam.Type]?: string | null;
  [TicketSearchParam.ViewedByNot]?: string | null;
  [TicketSearchParam.OrganizationId]?: string | null;
}

export const fetchCustomerTickets = async (params: FetchTicketsParams) => {
  const searchParams = new URLSearchParams();

  if (params.aggregation) {
    searchParams.set(TicketSearchParam.Aggregation, params.aggregation);
  }

  if (params.assignee) {
    searchParams.set(TicketSearchParam.Assignee, params.assignee);
  }

  if (params.createdDate) {
    searchParams.set(TicketSearchParam.CreatedDate, params.createdDate);
  }

  if (params.excludeSubUnits) {
    searchParams.set(TicketSearchParam.ExcludeSubUnits, 'true');
  }

  if (params.organizationId) {
    searchParams.set(TicketSearchParam.OrganizationId, params.organizationId);
  }

  if (params.owner) {
    searchParams.set(TicketSearchParam.Owner, params.owner);
  }

  if (params.publicationType) {
    searchParams.set(TicketSearchParam.PublicationType, params.publicationType);
  }

  if (params.query) {
    searchParams.set(TicketSearchParam.Query, params.query);
  }

  if (params.role) {
    searchParams.set(TicketSearchParam.Role, params.role);
  }

  if (params.status) {
    searchParams.set(TicketSearchParam.Status, params.status);
  }

  if (params.type) {
    searchParams.set(TicketSearchParam.Type, params.type);
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
export type ImportCandidateOrderBy = 'createdDate';

export enum ImportCandidatesSearchParam {
  Aggregation = 'aggregation',
  CollaborationType = 'collaborationType',
  Files = 'files',
  From = 'from',
  Identifier = 'id',
  ImportStatus = 'importStatus',
  OrderBy = 'orderBy',
  PublicationYear = 'publicationYear',
  Query = 'query',
  Size = 'size',
  SortOrder = 'sortOrder',
  TopLevelOrganization = 'topLevelOrganization',
  Type = 'type',
}

export interface FetchImportCandidatesParams {
  [ImportCandidatesSearchParam.Aggregation]?: 'all' | null;
  [ImportCandidatesSearchParam.CollaborationType]?: CollaborationType | null;
  [ImportCandidatesSearchParam.Files]?: AggregationFileKeyType | null;
  [ImportCandidatesSearchParam.From]?: number | null;
  [ImportCandidatesSearchParam.Identifier]?: string | null;
  [ImportCandidatesSearchParam.ImportStatus]?: ImportCandidateStatus | null;
  [ImportCandidatesSearchParam.OrderBy]?: ImportCandidateOrderBy | null;
  [ImportCandidatesSearchParam.PublicationYear]?: number | null;
  [ImportCandidatesSearchParam.Query]?: string | null;
  [ImportCandidatesSearchParam.Size]?: number | null;
  [ImportCandidatesSearchParam.SortOrder]?: SortOrder | null;
  [ImportCandidatesSearchParam.TopLevelOrganization]?: string | null;
  [ImportCandidatesSearchParam.Type]?: PublicationInstanceType | null;
}

export const fetchImportCandidates = async (params: FetchImportCandidatesParams) => {
  const searchParams = new URLSearchParams();

  searchParams.set(ImportCandidatesSearchParam.Size, (params.size ?? 10).toString());
  searchParams.set(ImportCandidatesSearchParam.From, (params.from ?? 0).toString());

  if (params.aggregation) {
    searchParams.set(ImportCandidatesSearchParam.Aggregation, params.aggregation);
  }
  if (params.collaborationType) {
    searchParams.set(ImportCandidatesSearchParam.CollaborationType, params.collaborationType);
  }
  if (params.files) {
    searchParams.set(ImportCandidatesSearchParam.Files, params.files);
  }
  if (params.id) {
    searchParams.set(ImportCandidatesSearchParam.Identifier, params.id);
  }
  if (params.importStatus) {
    searchParams.set(ImportCandidatesSearchParam.ImportStatus, params.importStatus);
  }
  if (params.orderBy) {
    searchParams.set(ImportCandidatesSearchParam.OrderBy, params.orderBy);
  }
  if (params.publicationYear) {
    const yearString = params.publicationYear.toString();
    searchParams.set(ImportCandidatesSearchParam.PublicationYear, `${yearString},${yearString}`);
  }
  if (params.query) {
    searchParams.set(ImportCandidatesSearchParam.Query, params.query);
  }
  if (params.sortOrder) {
    searchParams.set(ImportCandidatesSearchParam.SortOrder, params.sortOrder);
  }
  if (params.topLevelOrganization) {
    searchParams.set(ImportCandidatesSearchParam.TopLevelOrganization, params.topLevelOrganization);
  }
  if (params.type) {
    searchParams.set(ImportCandidatesSearchParam.Type, params.type);
  }

  const paramsString = searchParams.toString();

  const getImportCandidates = await authenticatedApiRequest2<
    SearchResponse2<ImportCandidateSummary, ImportCandidateAggregations>
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

export enum NviCandidatesSearchParam {
  Affiliations = 'affiliations',
  Aggregation = 'aggregation',
  Assignee = 'assignee',
  ExcludeSubUnits = 'excludeSubUnits',
  Filter = 'filter',
  Offset = 'offset',
  OrderBy = 'orderBy',
  Query = 'query',
  Size = 'size',
  SortOrder = 'sortOrder',
  Year = 'year',
}

export type NviCandidateOrderBy = 'createdDate';

export interface FetchNviCandidatesParams {
  [NviCandidatesSearchParam.Affiliations]?: string[] | null;
  [NviCandidatesSearchParam.Aggregation]?: 'all' | NviCandidateSearchStatus | null;
  [NviCandidatesSearchParam.Assignee]?: string | null;
  [NviCandidatesSearchParam.ExcludeSubUnits]?: boolean | null;
  [NviCandidatesSearchParam.Filter]?: NviCandidateSearchStatus | null;
  [NviCandidatesSearchParam.Offset]?: number | null;
  [NviCandidatesSearchParam.OrderBy]?: NviCandidateOrderBy | null;
  [NviCandidatesSearchParam.Query]?: string | null;
  [NviCandidatesSearchParam.Size]?: number | null;
  [NviCandidatesSearchParam.SortOrder]?: SortOrder | null;
  [NviCandidatesSearchParam.Year]?: number | null;
}

export const fetchNviCandidates = async (params: FetchNviCandidatesParams) => {
  const searchParams = new URLSearchParams();

  searchParams.set(NviCandidatesSearchParam.Size, params.size?.toString() || '10');
  searchParams.set(NviCandidatesSearchParam.Offset, params.offset?.toString() || '0');

  if (params.affiliations && params.affiliations.length > 0) {
    searchParams.set(NviCandidatesSearchParam.Affiliations, params.affiliations.join(','));
  }
  if (params.aggregation) {
    searchParams.set(NviCandidatesSearchParam.Aggregation, params.aggregation);
  }
  if (params.assignee) {
    searchParams.set(NviCandidatesSearchParam.Assignee, params.assignee);
  }
  if (params.excludeSubUnits === true || params.excludeSubUnits === false) {
    searchParams.set(NviCandidatesSearchParam.ExcludeSubUnits, params.excludeSubUnits.toString());
  }
  if (params.filter) {
    searchParams.set(NviCandidatesSearchParam.Filter, params.filter);
  }
  if (params.query) {
    searchParams.set(NviCandidatesSearchParam.Query, params.query);
  }
  if (params.year) {
    searchParams.set(NviCandidatesSearchParam.Year, params.year.toString());
  }
  if (params.orderBy) {
    searchParams.set(NviCandidatesSearchParam.OrderBy, params.orderBy);
  }
  if (params.sortOrder) {
    searchParams.set(NviCandidatesSearchParam.SortOrder, params.sortOrder);
  }

  const paramsString = searchParams.toString();
  const getNviCandidates = await authenticatedApiRequest2<NviCandidateSearchResponse>({
    url: `${SearchApiPath.NviCandidate}?${paramsString}`,
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
  HasNoChildren = 'hasNoChildren',
  Identifier = 'id',
  IdentifierNot = 'idNot',
  Isbn = 'isbn',
  Issn = 'issn',
  Journal = 'journal',
  Order = 'order',
  Project = 'project',
  PublicationLanguageShould = 'publicationLanguageShould',
  PublicationPages = 'publicationPages',
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
  Vocabulary = 'vocabulary',
}

export enum ResultSearchOrder {
  ModifiedDate = 'modifiedDate',
  PublicationDate = 'publicationDate',
  Relevance = 'relevance',
  Title = 'title',
}

export interface FetchResultsParams {
  [ResultParam.Abstract]?: string | null;
  [ResultParam.Aggregation]?: 'all' | 'none' | null;
  [ResultParam.Category]?: PublicationInstanceType | null;
  [ResultParam.CategoryNot]?: PublicationInstanceType | PublicationInstanceType[] | null;
  [ResultParam.CategoryShould]?: PublicationInstanceType[] | null;
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
  [ResultParam.HasNoChildren]?: boolean | null;
  [ResultParam.Identifier]?: string | null;
  [ResultParam.IdentifierNot]?: string | null;
  [ResultParam.Isbn]?: string | null;
  [ResultParam.Issn]?: string | null;
  [ResultParam.Journal]?: string | null;
  [ResultParam.Order]?: ResultSearchOrder | null;
  [ResultParam.Project]?: string | null;
  [ResultParam.PublicationLanguageShould]?: string | null;
  [ResultParam.PublicationPages]?: string | null;
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
  [ResultParam.Vocabulary]?: string | null;
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
    const paramValue = Array.isArray(params.categoryNot) ? params.categoryNot.join(',') : params.categoryNot;
    searchParams.set(ResultParam.CategoryNot, paramValue);
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
  if (params.hasNoChildren === true || params.hasNoChildren === false) {
    searchParams.set(ResultParam.HasNoChildren, params.hasNoChildren.toString());
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
  if (params.publicationPages) {
    searchParams.set(ResultParam.PublicationPages, params.publicationPages);
  }
  if (params.publicationYearBefore) {
    if (!params.publicationYearSince || +params.publicationYearSince <= +params.publicationYearBefore) {
      searchParams.set(ResultParam.PublicationYearBefore, params.publicationYearBefore);
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
  if (params.vocabulary) {
    searchParams.set(ResultParam.Vocabulary, params.vocabulary);
  }

  searchParams.set(ResultParam.From, typeof params.from === 'number' ? params.from.toString() : '0');
  searchParams.set(ResultParam.Results, typeof params.results === 'number' ? params.results.toString() : '10');
  searchParams.set(ResultParam.Order, params.order ?? ResultSearchOrder.Relevance);
  searchParams.set(ResultParam.Sort, params.sort ?? 'desc');

  const getResults = await apiRequest2<SearchResponse2<Registration, RegistrationAggregations>>({
    url: `${SearchApiPath.Registrations}?${searchParams.toString()}`,
    signal,
  });

  return getResults.data;
};

export enum CustomerResultParam {
  Status = 'status',
}

export interface FetchCustomerResultsParams
  extends Pick<
    FetchResultsParams,
    ResultParam.From | ResultParam.Order | ResultParam.Query | ResultParam.Results | ResultParam.Sort
  > {
  [CustomerResultParam.Status]?: RegistrationStatus[] | null;
}

export const fetchCustomerResults = async (params: FetchCustomerResultsParams, signal?: AbortSignal) => {
  const searchParams = new URLSearchParams();

  if (params.status && params.status.length > 0) {
    searchParams.set(CustomerResultParam.Status, params.status.join(','));
  }
  if (params.query) {
    searchParams.set(ResultParam.Title, params.query);
  }

  searchParams.set(ResultParam.From, typeof params.from === 'number' ? params.from.toString() : '0');
  searchParams.set(ResultParam.Results, typeof params.results === 'number' ? params.results.toString() : '10');
  searchParams.set(ResultParam.Order, params.order ?? ResultSearchOrder.Relevance);
  searchParams.set(ResultParam.Sort, params.sort ?? 'desc');

  const getCustomerResults = await authenticatedApiRequest2<SearchResponse2<Registration, RegistrationAggregations>>({
    url: `${SearchApiPath.CustomerRegistrations}?${searchParams.toString()}`,
    signal,
  });

  return getCustomerResults.data;
};
