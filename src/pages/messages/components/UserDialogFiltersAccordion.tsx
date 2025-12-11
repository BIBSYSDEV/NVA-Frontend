import { UrlPathTemplate } from '../../../utils/urlPaths';
import { TicketSearchParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { TasksPanelFormGroup } from '../../../components/styled/Wrappers';
import { resetPaginationAndNavigate } from '../../../utils/searchHelpers';
import { TicketTypeEnum } from '../../../types/publication_types/ticket.types';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { useTranslation } from 'react-i18next';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { checkPages } from '../tasks-helpers';
import { useLocation, useNavigate } from 'react-router';
import { checkUserRoles } from '../../../utils/user-helpers';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { TicketTypeFilterButton } from '../../../components/TicketTypeFilterButton';
import { Badge } from '@mui/material';
import { TicketTypeTag } from './TicketTypeTag';
import { useGetNotificationCounts, useGetTicketsCounts } from '../user-dialog-helpers';
import { useTasksContext } from '../TasksContext';

export const UserDialogFiltersAccordion = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((store: RootState) => store.user);
  const { isOnTicketsPage } = checkPages(location);
  const { isPublishingCurator, isThesisCurator, isDoiCurator, isSupportCurator } = checkUserRoles(user);
  const { institutionUserQuery, ticketsQuery, ticketTypes, setTicketTypes } = useTasksContext();
  const searchParams = new URLSearchParams(location.search);

  const {
    doiNotificationsCount,
    publishingNotificationsCount,
    thesisPublishingNotificationsCount,
    supportNotificationsCount,
  } = useGetNotificationCounts({
    notificationsQueryEnabled: isOnTicketsPage && !institutionUserQuery.isPending,
    user: user,
  });
  const { doiRequestCount, publishingRequestCount, thesisPublishingRequestCount, generalSupportCaseCount } =
    useGetTicketsCounts({ ticketsQuery: ticketsQuery });

  return (
    <NavigationListAccordion
      title={t('tasks.user_dialog')}
      startIcon={<AssignmentIcon />}
      accordionPath={UrlPathTemplate.TasksDialogue}
      onClick={() => {
        if (!isOnTicketsPage) {
          searchParams.delete(TicketSearchParam.From);
        }
      }}
      dataTestId={dataTestId.tasksPage.userDialogAccordion}>
      <TasksPanelFormGroup sx={{ gap: '0.5rem', mt: 0 }}>
        {isPublishingCurator && (
          <TicketTypeFilterButton
            data-testid={dataTestId.tasksPage.typeSearch.publishingButton}
            endIcon={<Badge badgeContent={publishingNotificationsCount} />}
            isSelected={!!ticketTypes.publishingRequest}
            onClick={() => {
              setTicketTypes({ ...ticketTypes, publishingRequest: !ticketTypes.publishingRequest });
              resetPaginationAndNavigate(searchParams, navigate);
            }}>
            <TicketTypeTag
              count={ticketTypes.publishingRequest && publishingRequestCount ? publishingRequestCount : undefined}
              type={TicketTypeEnum.PublishingRequest}
            />
          </TicketTypeFilterButton>
        )}

        {isThesisCurator && (
          <TicketTypeFilterButton
            data-testid={dataTestId.tasksPage.typeSearch.thesisPublishingRequestsButton}
            endIcon={<Badge badgeContent={thesisPublishingNotificationsCount} />}
            isSelected={!!ticketTypes.filesApprovalThesis}
            onClick={() => {
              setTicketTypes({ ...ticketTypes, filesApprovalThesis: !ticketTypes.filesApprovalThesis });
              resetPaginationAndNavigate(searchParams, navigate);
            }}>
            <TicketTypeTag
              count={
                ticketTypes.filesApprovalThesis && thesisPublishingRequestCount
                  ? thesisPublishingRequestCount
                  : undefined
              }
              type={TicketTypeEnum.FilesApprovalThesis}
            />
          </TicketTypeFilterButton>
        )}

        {isDoiCurator && (
          <TicketTypeFilterButton
            data-testid={dataTestId.tasksPage.typeSearch.doiButton}
            endIcon={<Badge badgeContent={doiNotificationsCount} />}
            isSelected={!!ticketTypes.doiRequest}
            onClick={() => {
              setTicketTypes({ ...ticketTypes, doiRequest: !ticketTypes.doiRequest });
              resetPaginationAndNavigate(searchParams, navigate);
            }}>
            <TicketTypeTag
              count={ticketTypes.doiRequest && doiRequestCount ? doiRequestCount : undefined}
              type={TicketTypeEnum.DoiRequest}
            />
          </TicketTypeFilterButton>
        )}

        {isSupportCurator && (
          <TicketTypeFilterButton
            data-testid={dataTestId.tasksPage.typeSearch.supportButton}
            endIcon={<Badge badgeContent={supportNotificationsCount} />}
            isSelected={!!ticketTypes.generalSupportCase}
            onClick={() => {
              setTicketTypes({ ...ticketTypes, generalSupportCase: !ticketTypes.generalSupportCase });
              resetPaginationAndNavigate(searchParams, navigate);
            }}>
            <TicketTypeTag
              count={ticketTypes.generalSupportCase && generalSupportCaseCount ? generalSupportCaseCount : undefined}
              type={TicketTypeEnum.GeneralSupportCase}
            />
          </TicketTypeFilterButton>
        )}
      </TasksPanelFormGroup>
    </NavigationListAccordion>
  );
};
