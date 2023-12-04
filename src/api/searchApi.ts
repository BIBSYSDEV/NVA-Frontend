import { SearchResponse, SearchResponse2 } from '../types/common.types';
import { ImportCandidateAggregations, ImportCandidateSummary } from '../types/importCandidate.types';
import { NviCandidate, NviCandidateSearchResponse } from '../types/nvi.types';
import { ExpandedTicket } from '../types/publication_types/ticket.types';
import { PublicationInstanceType, Registration } from '../types/registration.types';
import { CristinPerson } from '../types/user.types';
import { SearchApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest2 } from './apiRequest';

export const fetchTickets = async (results: number, from: number, query = '', onlyCreator = false) => {
  const paginationQuery = `results=${results}&from=${from}`;
  const roleQuery = onlyCreator ? 'role=creator' : '';
  const searchQuery = query ? `query=${query}` : '';
  const fullQuery = [paginationQuery, roleQuery, searchQuery].filter(Boolean).join('&');

  const getTickets = await authenticatedApiRequest2<SearchResponse<ExpandedTicket>>({
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

export interface FetchResultsParams {
  category?: PublicationInstanceType;
  categoryNot?: PublicationInstanceType;
  categorySome?: PublicationInstanceType[];
  contributor?: string;
  contributorShould?: string;
  doi?: string;
  identifier?: string;
  identifierNot?: string;
  issn?: string;
  project?: string;
  publicationYear?: string;
  query?: string;
  title?: string;
}

export const fetchResults = async (results: number, from: number, params: FetchResultsParams) => {
  let fullQuery = `results=${results}&from=${from}`;

  if (params.category) {
    fullQuery += `&category=${params.category}`;
  }
  if (params.categoryNot) {
    fullQuery += `&category_not=${params.categoryNot}`;
  }
  if (params.categorySome) {
    fullQuery += `&category_should=${params.categorySome.join(',')}`;
  }
  if (params.contributor) {
    fullQuery += `&contributor=${params.contributor}`;
  }
  if (params.contributorShould) {
    fullQuery += `&contributor_should=${params.contributorShould}`;
  }
  if (params.doi) {
    fullQuery += `&doi=${params.doi}`;
  }
  if (params.identifier) {
    fullQuery += `&id=${params.identifier}`;
  }
  if (params.identifierNot) {
    fullQuery += `&id_not=${params.identifierNot}`;
  }
  if (params.issn) {
    fullQuery += `&issn_should=${params.issn}`;
  }
  if (params.project) {
    fullQuery += `&project=${params.project}`;
  }
  if (params.publicationYear) {
    fullQuery += `&publication_year=${params.publicationYear}`;
  }
  if (params.query) {
    fullQuery += `&query=${params.query}`;
  }
  if (params.title) {
    fullQuery += `&title=${params.title}`;
  }

  const getResults = await apiRequest2<SearchResponse2<Registration>>({
    url: `${SearchApiPath.Registrations2}?${fullQuery}`,
  });

  return getResults.data;
};
