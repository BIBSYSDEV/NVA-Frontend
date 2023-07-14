import { SearchResponse } from '../types/common.types';
import { ExpandedTicket } from '../types/publication_types/ticket.types';
import { SearchApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest2 } from './apiRequest';
import { ImportCandidateSummary } from '../types/importCandidate.types';

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

  const getImportCandidates = await authenticatedApiRequest2<SearchResponse<ImportCandidateSummary>>({
    url: `${SearchApiPath.ImportCandidates}?${fullQuery}`,
  });

  return getImportCandidates.data;
};

export const fetchRegistrationsExport = async (searchParams: string) => {
  const url = `${SearchApiPath.Registrations}${searchParams}`;

  const fetchExport = await apiRequest2<string>({ url, headers: { Accept: 'text/csv' } });
  return fetchExport.data;
};
