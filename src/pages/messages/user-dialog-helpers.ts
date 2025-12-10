import { useFetchNotifications } from '../../api/hooks/useFetchNotifications';
import { User } from '../../types/user.types';
import { TicketTypeSelection } from '../../types/publication_types/ticket.types';
import { useFetchTickets } from '../../api/hooks/useFetchTickets';

interface GetNotificationCountsProps {
  notificationsQueryEnabled: boolean;
  user: User | null;
}

export const useGetNotificationCounts = ({ notificationsQueryEnabled, user }: GetNotificationCountsProps) => {
  const notificationsQuery = useFetchNotifications({
    enabled: notificationsQueryEnabled,
    user: user,
  });

  const doiNotificationsCount = notificationsQuery.data?.aggregations?.byUserPending?.find(
    (notification) => notification.key === 'DoiRequest'
  )?.count;
  const publishingNotificationsCount = notificationsQuery.data?.aggregations?.byUserPending?.find(
    (notification) => notification.key === 'PublishingRequest'
  )?.count;
  const thesisPublishingNotificationsCount = notificationsQuery.data?.aggregations?.byUserPending?.find(
    (notification) => notification.key === 'FilesApprovalThesis'
  )?.count;
  const supportNotificationsCount = notificationsQuery.data?.aggregations?.byUserPending?.find(
    (notification) => notification.key === 'GeneralSupportCase'
  )?.count;

  return {
    doiNotificationsCount,
    publishingNotificationsCount,
    thesisPublishingNotificationsCount,
    supportNotificationsCount,
  };
};

interface GetTicketsCountsProps {
  ticketsQueryEnabled: boolean;
  searchParams: URLSearchParams;
  ticketTypes: TicketTypeSelection;
}

export const useGetTicketsCounts = ({ ticketsQueryEnabled, searchParams, ticketTypes }: GetTicketsCountsProps) => {
  const selectedTicketTypes = Object.entries(ticketTypes)
    .filter(([, selected]) => selected)
    .map(([key]) => key);

  const ticketsQuery = useFetchTickets({
    searchParams: searchParams,
    enabled: ticketsQueryEnabled,
    selectedTicketTypes: selectedTicketTypes,
  });

  const ticketTypeBuckets = ticketsQuery.data?.aggregations?.type ?? [];

  const doiRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'DoiRequest')?.count;
  const publishingRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'PublishingRequest')?.count;
  const thesisPublishingRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'FilesApprovalThesis')?.count;
  const generalSupportCaseCount = ticketTypeBuckets.find((bucket) => bucket.key === 'GeneralSupportCase')?.count;

  return { doiRequestCount, publishingRequestCount, thesisPublishingRequestCount, generalSupportCaseCount };
};
