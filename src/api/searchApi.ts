import { SearchResponse } from '../types/common.types';
import { Ticket } from '../types/publication_types/messages.types';
import { SearchApiPath } from './apiPaths';
import { authenticatedApiRequest2 } from './apiRequest';

export const fetchTickets = async (results: number, from: number, onlyCreator = false, query = '') => {
  const paginationQuery = `results=${results}&from=${from}`;
  const roleQuery = onlyCreator ? 'role=creator' : '';
  const searchQuery = query ? `query=${query}` : '';
  const fullQuery = [paginationQuery, roleQuery, searchQuery].filter(Boolean).join('&');

  const getTickets = await authenticatedApiRequest2<SearchResponse<Ticket>>({
    url: `${SearchApiPath.Tickets}?${fullQuery}`,
  });
  return getTickets.data;
};
