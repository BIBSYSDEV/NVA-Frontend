import { SearchResponse } from '../types/common.types';
import { ExpandedTicket } from '../types/publication_types/ticket.types';
import { SearchApiPath } from './apiPaths';
import { authenticatedApiRequest2 } from './apiRequest';
import { ExpandedImportCandidate } from '../types/importCandidate.types';

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

export const fetchImportCandidates = async () => {
  const getImportCandidates = await authenticatedApiRequest2<SearchResponse<ExpandedImportCandidate>>({
    url: `${SearchApiPath.ImportCandidates}`,
  });
  return getImportCandidates.data;
};
