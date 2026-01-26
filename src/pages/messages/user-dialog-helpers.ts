import { useFetchNotifications } from '../../api/hooks/useFetchNotifications';
import { User } from '../../types/user.types';
import { CustomerTicketAggregations } from '../../types/publication_types/ticket.types';

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
  ticketsAggregations?: CustomerTicketAggregations;
}

export const useGetTicketsCounts = ({ ticketsAggregations }: GetTicketsCountsProps) => {
  const ticketTypeBuckets = ticketsAggregations?.type ?? [];

  const doiRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'DoiRequest')?.count;
  const publishingRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'PublishingRequest')?.count;
  const thesisPublishingRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'FilesApprovalThesis')?.count;
  const generalSupportCaseCount = ticketTypeBuckets.find((bucket) => bucket.key === 'GeneralSupportCase')?.count;

  return { doiRequestCount, publishingRequestCount, thesisPublishingRequestCount, generalSupportCaseCount };
};
