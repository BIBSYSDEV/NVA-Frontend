import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router';
import { useFetchTickets } from '../../api/hooks/useFetchTickets';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { StyledPageWithSideMenu } from '../../components/side-menu-components/_utils/side-menu-styles';
import { SideNavHeader } from '../../components/side-menu-components/SideNavHeader';
import { SideMenu } from '../../components/side-menu-components/SideMenu';
import { RootState } from '../../redux/store';
import { TicketTypeSelection } from '../../types/publication_types/ticket.types';
import { checkWhichTasksPage } from '../../utils/location-helpers';
import { checkUserRoles } from '../../utils/user-helpers';
import { NviCorrectionListNavigationAccordion } from '../messages/components/NviCorrectionListNavigationAccordion';
import { ResultRegistrationsNavigationListAccordion } from '../messages/components/ResultRegistrationsNavigationListAccordion';
import { NviCandidatesNavigationAccordion } from './_components/nvi-candidates-navigation-accordion/NviCandidatesNavigationAccordion';
import { TasksPageMinimizedIconButton } from './_components/TasksPageMinimizedIconButton';
import { UserDialogueNavigationAccordion } from './_components/UserDialogueNavigationAccordion';

const TasksPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);
  const { isNviCurator, isPublishingCurator, isThesisCurator, isDoiCurator, isSupportCurator } = checkUserRoles(user);
  const isTicketCurator = isSupportCurator || isDoiCurator || isPublishingCurator || isThesisCurator;
  const isAnyCurator = isTicketCurator || isNviCurator;

  const { isOnTicketsPage, isOnADetailsPage } = checkWhichTasksPage(location.pathname);

  const searchParams = new URLSearchParams(location.search);

  const [ticketTypeToggles, setTicketTypeToggles] = useState<TicketTypeSelection>({
    doiRequest: isDoiCurator,
    generalSupportCase: isSupportCurator,
    publishingRequest: isPublishingCurator,
    filesApprovalThesis: isThesisCurator,
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
      <SideMenu isVisible={!isOnADetailsPage} backToSideMenuButton={<TasksPageMinimizedIconButton />}>
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
        <Outlet context={{ ticketsQuery, selectedTicketTypes }} />
      </ErrorBoundary>
    </StyledPageWithSideMenu>
  );
};

export default TasksPage;
