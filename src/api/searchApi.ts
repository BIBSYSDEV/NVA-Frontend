import { SearchResponse, SearchResponse2 } from '../types/common.types';
import { ImportCandidateAggregations, ImportCandidateSummary } from '../types/importCandidate.types';
import { NviCandidate, NviCandidateSearchResponse } from '../types/nvi.types';
import { TicketSearchResponse } from '../types/publication_types/ticket.types';
import { PublicationInstanceType, Registration, RegistrationAggregations } from '../types/registration.types';
import { CristinPerson } from '../types/user.types';
import { SearchApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest2 } from './apiRequest';

export const fetchTickets = async (results: number, from: number, query = '', onlyCreator = false) => {
  const paginationQuery = `results=${results}&from=${from}`;
  const roleQuery = onlyCreator ? 'role=creator' : '';
  const searchQuery = query ? `query=${query}` : '';
  const fullQuery = [paginationQuery, roleQuery, searchQuery].filter(Boolean).join('&');

  const getTickets = await authenticatedApiRequest2<TicketSearchResponse>({
    url: `${SearchApiPath.Tickets}?${fullQuery}`,
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

export const fetchRegistrationsExport = async (searchParams: string) => {
  const url = `${SearchApiPath.Registrations}${searchParams}`;

  const fetchExport = await apiRequest2<string>({ url, headers: { Accept: 'text/csv' } });
  return fetchExport.data;
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
  const nameQueryParam = nameQuery ? `&name=${nameQuery}` : '';
  const url = `${organizationId}/persons?page=${page}&results=${results}${nameQueryParam}`;

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
  Category = 'category',
  CategoryNot = 'categoryNot',
  CategoryShould = 'categoryShould',
  Contributor = 'contributor',
  ContributorShould = 'contributorShould',
  Sort = 'sort',
  FundingSource = 'fundingSource',
  Doi = 'doi',
  Identifier = 'id',
  IdentifierNot = 'idNot',
  Issn = 'issn',
  Order = 'order',
  Project = 'project',
  PublicationYear = 'publicationYear',
  Query = 'query',
  Title = 'title',
  TopLevelOrganization = 'topLevelOrganization',
}

export interface FetchResultsParams {
  [ResultParam.Category]?: PublicationInstanceType | null;
  [ResultParam.CategoryNot]?: PublicationInstanceType | null;
  [ResultParam.CategoryShould]?: PublicationInstanceType[];
  [ResultParam.Contributor]?: string | null;
  [ResultParam.ContributorShould]?: string | null;
  [ResultParam.Sort]?: SortOrder | null;
  [ResultParam.FundingSource]?: string | null;
  [ResultParam.Doi]?: string | null;
  [ResultParam.Identifier]?: string | null;
  [ResultParam.IdentifierNot]?: string | null;
  [ResultParam.Issn]?: string | null;
  [ResultParam.Order]?: string | null;
  [ResultParam.Project]?: string | null;
  [ResultParam.PublicationYear]?: string | null;
  [ResultParam.Query]?: string | null;
  [ResultParam.Title]?: string | null;
  [ResultParam.TopLevelOrganization]?: string | null;
}

export const fetchResults = async (results: number, from: number, params: FetchResultsParams) => {
  let fullQuery = `results=${results}&from=${from}&order=${params.order ?? 'modifiedDate'}&sort=${
    params.sort ?? 'desc'
  }`;

  if (params.category) {
    fullQuery += `&${ResultParam.Category}=${params.category}`;
  }
  if (params.categoryNot) {
    fullQuery += `&${ResultParam.CategoryNot}=${params.categoryNot}`;
  }
  if (params.categoryShould) {
    fullQuery += `&${ResultParam.CategoryShould}=${params.categoryShould.join(',')}`;
  }
  if (params.contributor) {
    fullQuery += `&${ResultParam.Contributor}=${encodeURIComponent(params.contributor)}`;
  }
  if (params.contributorShould) {
    fullQuery += `&${ResultParam.ContributorShould}=${params.contributorShould}`;
  }
  if (params.fundingSource) {
    fullQuery += `&${ResultParam.FundingSource}=${params.fundingSource}`;
  }
  if (params.doi) {
    fullQuery += `&${ResultParam.Doi}=${params.doi}`;
  }
  if (params.id) {
    fullQuery += `&${ResultParam.Identifier}=${params.id}`;
  }
  if (params.idNot) {
    fullQuery += `&${ResultParam.IdentifierNot}=${params.idNot}`;
  }
  if (params.issn) {
    fullQuery += `&${ResultParam.Issn}=${params.issn}`;
  }
  if (params.project) {
    fullQuery += `&${ResultParam.Project}=${params.project}`;
  }
  if (params.publicationYear) {
    fullQuery += `&${ResultParam.PublicationYear}=${params.publicationYear}`;
  }
  if (params.query) {
    fullQuery += `&${ResultParam.Query}=${params.query}`;
  }
  if (params.title) {
    fullQuery += `&${ResultParam.Title}=${params.title}`;
  }
  if (params.topLevelOrganization) {
    fullQuery += `&${ResultParam.TopLevelOrganization}=${encodeURIComponent(params.topLevelOrganization)}`;
  }

  const getResults = await apiRequest2<SearchResponse2<Registration, RegistrationAggregations>>({
    url: `${SearchApiPath.Registrations}?${fullQuery}`,
  });

  return getResults.data;
};
