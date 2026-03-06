import { useQuery } from '@tanstack/react-query';
import { fetchCustomerTickets, FetchTicketsParams, SortOrder, TicketOrderBy, TicketSearchParam } from '../searchApi';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { useTranslation } from 'react-i18next';

interface FetchTicketsOptions {
  searchParams: URLSearchParams;
  selectedTicketTypes: string[];
  enabled?: boolean;
}

export const useFetchTickets = ({ searchParams, enabled = false, selectedTicketTypes }: FetchTicketsOptions) => {
  const { t } = useTranslation();

  const ticketSearchParams: FetchTicketsParams = {
    aggregation: 'all',
    query: searchParams.get(TicketSearchParam.Query),
    results: Number(searchParams.get(TicketSearchParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]),
    from: Number(searchParams.get(TicketSearchParam.From) ?? 0),
    orderBy: searchParams.get(TicketSearchParam.OrderBy) as TicketOrderBy | null,
    sortOrder: searchParams.get(TicketSearchParam.SortOrder) as SortOrder | null,
    organizationId: searchParams.get(TicketSearchParam.OrganizationId),
    excludeSubUnits: searchParams.get(TicketSearchParam.ExcludeSubUnits) === 'true',
    assignee: searchParams.get(TicketSearchParam.Assignee),
    status: searchParams.get(TicketSearchParam.Status),
    type: selectedTicketTypes.join(','),
    viewedByNot: searchParams.get(TicketSearchParam.ViewedByNot),
    createdDate: searchParams.get(TicketSearchParam.CreatedDate),
    publicationType: searchParams.get(TicketSearchParam.PublicationType),
  };

  return useQuery({
    enabled: enabled,
    queryKey: ['tickets', ticketSearchParams],
    queryFn: () => fetchCustomerTickets(ticketSearchParams),
    meta: { errorMessage: t('feedback.error.get_messages') },
  });
};
