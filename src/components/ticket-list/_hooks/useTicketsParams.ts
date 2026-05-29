import { useLocation } from 'react-router';
import { TicketSearchParam } from '../../../api/searchApi';
import { TicketStatus } from '../../../types/publication_types/ticket.types';

export const SHOW_ALL_VIEWED_BY_VALUE = 'show-all';

export const useTicketsParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const viewedByNot = searchParams.get(TicketSearchParam.ViewedByNot) || SHOW_ALL_VIEWED_BY_VALUE;
  const results = searchParams.get(TicketSearchParam.Results);
  const from = searchParams.get(TicketSearchParam.From);
  const assignee = searchParams.get(TicketSearchParam.Assignee);
  const status = (searchParams.get(TicketSearchParam.Status)?.split(',') ?? []) as TicketStatus[];

  return {
    searchParams,
    viewedByNot,
    results,
    from,
    assignee,
    status,
  };
};
