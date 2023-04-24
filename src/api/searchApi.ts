import { SearchResponse } from '../types/common.types';
import { Ticket } from '../types/publication_types/messages.types';
import { SearchApiPath } from './apiPaths';
import { authenticatedApiRequest } from './apiRequest';

export const fetchTickets = async (results: number, from: number, query = '') => {
  const getTickets = await authenticatedApiRequest<SearchResponse<Ticket>>({
    url: query
      ? `${SearchApiPath.Tickets}?results=${results}&from=${from}&query=${query}`
      : `${SearchApiPath.Tickets}?results=${results}&from=${from}`,
  });
  return getTickets.data;
};
