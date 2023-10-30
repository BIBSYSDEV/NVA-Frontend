import { SearchResponse } from '../types/common.types';
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

export const fetchImportCandidates = async (results: number, from: number, query = '') => {
  const paginationQuery = `results=${results}&from=${from}`;
  const searchQuery = query ? `query=${query}` : '';
  const fullQuery = [searchQuery, paginationQuery].filter(Boolean).join('&');

  const getImportCandidates = await authenticatedApiRequest2<
    SearchResponse<ImportCandidateSummary, ImportCandidateAggregations>
  >({
    url: `${SearchApiPath.ImportCandidates}?${fullQuery}`,
  });

  return getImportCandidates.data;
};

export const fetchRegistrationsExport = async (searchParams: string) => {
  const url = `${SearchApiPath.Registrations}${searchParams}`;

  const fetchExport = await apiRequest2<string>({ url, headers: { Accept: 'text/csv' } });
  return fetchExport.data;
};

export const fetchResults = async (results: number, from: number, query = '') => {
  const paginationQuery = `results=${results}&from=${from}`;
  const searchQuery = query ? `query=${query}` : '';

  const fullQuery = [paginationQuery, searchQuery].filter(Boolean).join('&');

  const getResults = await apiRequest2<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?${fullQuery}`,
  });
  return getResults.data;
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

interface FetchResultsQuery {
  doi?: string;
  identifier?: string;
  contributor?: string;
  query?: string;
  category?: PublicationInstanceType[];
}

export const fetchResults2 = async (
  results: number,
  from: number,
  { doi, identifier, contributor, query, category }: FetchResultsQuery
) => {
  const paginationQuery = `results=${results}&from=${from}`;
  const doiQuery = doi ? `doi="${doi}"` : '';
  const idQuery = identifier ? `id="${identifier}"` : '';
  const contributorQuery = contributor ? `contributor="${contributor}"` : '';
  const freetextQuery = query ? `query="${query}"` : '';
  const categoryQuery = category ? `category="${category.join(',')}"` : '';

  const fullQuery = [paginationQuery, doiQuery, idQuery, contributorQuery, freetextQuery, categoryQuery]
    .filter(Boolean)
    .join('&');

  const getResults = await apiRequest2<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations2}?${fullQuery}`,
  });
  return getResults.data;
};
