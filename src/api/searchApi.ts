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

export interface FetchResultsQuery {
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

export const fetchResults = async (
  results: number,
  from: number,
  {
    category,
    categoryNot,
    categorySome,
    contributor,
    contributorShould,
    doi,
    identifier,
    identifierNot,
    issn,
    project,
    publicationYear,
    query,
    title,
  }: FetchResultsQuery
) => {
  let fullQuery = `results=${results}&from=${from}`;

  if (category) {
    fullQuery += `&category=${category}`;
  }
  if (categoryNot) {
    fullQuery += `&category_not=${categoryNot}`;
  }
  if (categorySome) {
    fullQuery += `&category_should=${categorySome.join(',')}`;
  }
  if (contributor) {
    fullQuery += `&contributor=${contributor}`;
  }
  if (contributorShould) {
    fullQuery += `&contributor_should=${contributorShould}`;
  }
  if (doi) {
    fullQuery += `&doi=${doi}`;
  }
  if (identifier) {
    fullQuery += `&id=${identifier}`;
  }
  if (identifierNot) {
    fullQuery += `&id_not=${identifierNot}`;
  }
  if (issn) {
    fullQuery += `&issn_should=${issn}`;
  }
  if (project) {
    fullQuery += `&project=${project}`;
  }
  if (publicationYear) {
    fullQuery += `&publication_year=${publicationYear}`;
  }
  if (query) {
    fullQuery += `&query=${query}`;
  }
  if (title) {
    fullQuery += `&title=${title}`;
  }

  const getResults = await apiRequest2<SearchResponse2<Registration>>({
    url: `${SearchApiPath.Registrations2}?${fullQuery}`,
  });

  return getResults.data;
};
