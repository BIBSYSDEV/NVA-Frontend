import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router';
import { useFetchTickets } from '../../api/hooks/useFetchTickets';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { SideMenu } from '../../components/SideMenu';
import { RootState } from '../../redux/store';
import { TicketTypeSelection } from '../../types/publication_types/ticket.types';
import { checkUserRoles } from '../../utils/user-helpers';
import { NviCorrectionListNavigationAccordion } from '../messages/components/NviCorrectionListNavigationAccordion';
import { ResultRegistrationsNavigationListAccordion } from '../messages/components/ResultRegistrationsNavigationListAccordion';
import { checkPages } from '../messages/tasks-helpers';
import { NviCandidatesNavigationAccordion } from './_components/NviCandidatesNavigationAccordion';
import { TasksPageMinimizedIconButton } from './_components/TasksPageMinimizedIconButton';
import { UserDialogueNavigationAccordion } from './_components/UserDialogueNavigationAccordion';

const TasksPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);
  const { isNviCurator, isPublishingCurator, isThesisCurator, isDoiCurator, isSupportCurator } = checkUserRoles(user);
  const isTicketCurator = isSupportCurator || isDoiCurator || isPublishingCurator || isThesisCurator;
  const isAnyCurator = isTicketCurator || isNviCurator;

  const { isOnTicketsPage, isOnTicketPage, isOnNviCandidatePage } = checkPages(location.pathname);
  const isOnADetailsPage = isOnTicketPage || isOnNviCandidatePage;

  const searchParams = new URLSearchParams(location.search);

  const [ticketTypeToggles, setTicketTypeToggles] = useState<TicketTypeSelection>({
    doiRequest: true,
    generalSupportCase: true,
    publishingRequest: true,
    filesApprovalThesis: true,
  });

  const selectedTicketTypes = Object.entries(ticketTypeToggles)
    .filter(([, selected]) => selected)
    .map(([key]) => key);

  const ticketsQuery = useFetchTickets({
    enabled: isOnTicketsPage,
    searchParams,
    selectedTicketTypes,
  });

  return (
    <StyledPageWithSideMenu>
      <SideMenu expanded={!isOnADetailsPage} minimizedMenu={<TasksPageMinimizedIconButton />}>
        <SideNavHeader icon={AssignmentIcon} text={t('common.tasks')} />
        {isTicketCurator && (
          <UserDialogueNavigationAccordion
            ticketTypeToggles={ticketTypeToggles}
            setTicketTypeToggles={setTicketTypeToggles}
            ticketsAggregations={ticketsQuery.data?.aggregations}
          />
        )}
        {isAnyCurator && <ResultRegistrationsNavigationListAccordion />}
        {isNviCurator && (
          <>
            <NviCandidatesNavigationAccordion />
            <NviCorrectionListNavigationAccordion />
          </>
        )}
      </SideMenu>
      <ErrorBoundary>
        <Outlet context={{ ticketsQuery }} />
      </ErrorBoundary>
    </StyledPageWithSideMenu>
  );
};

export default TasksPage;
