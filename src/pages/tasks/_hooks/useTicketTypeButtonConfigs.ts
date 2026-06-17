import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { RootState } from '../../../redux/store';
import {
  CustomerTicketAggregations,
  TicketTypeEnum,
  TicketTypeSelection,
} from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { checkUserRoles } from '../../../utils/user-helpers';
import { checkPages } from '../../messages/tasks-helpers';
import { useGetNotificationCounts, useGetTicketsCounts } from '../../messages/user-dialog-helpers';

interface TicketTypeButtonConfig {
  testId: string;
  badgeCount: number | undefined;
  ticketTypeKey: keyof TicketTypeSelection;
  count: number | undefined;
  ticketType: TicketTypeEnum;
}

export const useTicketTypeButtonConfigs = (
  ticketsAggregations?: CustomerTicketAggregations
): TicketTypeButtonConfig[] => {
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);
  const { isPublishingCurator, isThesisCurator, isDoiCurator, isSupportCurator } = checkUserRoles(user);
  const { isOnTicketsPage } = checkPages(location.pathname);
  const {
    doiNotificationsCount,
    publishingNotificationsCount,
    thesisPublishingNotificationsCount,
    supportNotificationsCount,
  } = useGetNotificationCounts({ notificationsQueryEnabled: isOnTicketsPage, user });
  const { doiRequestCount, publishingRequestCount, thesisPublishingRequestCount, generalSupportCaseCount } =
    useGetTicketsCounts({ ticketsAggregations });

  return [
    isPublishingCurator && {
      testId: dataTestId.tasksPage.typeSearch.publishingButton,
      badgeCount: publishingNotificationsCount,
      ticketTypeKey: 'publishingRequest' as const,
      count: publishingRequestCount,
      ticketType: TicketTypeEnum.PublishingRequest,
    },
    isThesisCurator && {
      testId: dataTestId.tasksPage.typeSearch.thesisPublishingRequestsButton,
      badgeCount: thesisPublishingNotificationsCount,
      ticketTypeKey: 'filesApprovalThesis' as const,
      count: thesisPublishingRequestCount,
      ticketType: TicketTypeEnum.FilesApprovalThesis,
    },
    isDoiCurator && {
      testId: dataTestId.tasksPage.typeSearch.doiButton,
      badgeCount: doiNotificationsCount,
      ticketTypeKey: 'doiRequest' as const,
      count: doiRequestCount,
      ticketType: TicketTypeEnum.DoiRequest,
    },
    isSupportCurator && {
      testId: dataTestId.tasksPage.typeSearch.supportButton,
      badgeCount: supportNotificationsCount,
      ticketTypeKey: 'generalSupportCase' as const,
      count: generalSupportCaseCount,
      ticketType: TicketTypeEnum.GeneralSupportCase,
    },
  ].filter(Boolean) as TicketTypeButtonConfig[];
};
