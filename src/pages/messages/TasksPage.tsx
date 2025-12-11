import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router';
import { useFetchUserQuery } from '../../api/hooks/useFetchUserQuery';
import { StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { RootState } from '../../redux/store';
import { TicketTypeSelection } from '../../types/publication_types/ticket.types';
import { TasksSideMenu } from './components/TasksSideMenu';
import { TasksContext } from './TasksContext';
import { useFetchTickets } from '../../api/hooks/useFetchTickets';
import { checkPages } from './tasks-helpers';
import { TasksRoutes } from './components/TasksRoutes';
import { checkUserRoles } from '../../utils/user-helpers';

const TasksPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user = useSelector((store: RootState) => store.user);
  const { isPublishingCurator, isThesisCurator, isDoiCurator, isSupportCurator } = checkUserRoles(user);
  const { isOnTicketsPage } = checkPages(location);

  const [ticketTypes, setTicketTypes] = useState<TicketTypeSelection>({
    doiRequest: isDoiCurator,
    generalSupportCase: isSupportCurator,
    publishingRequest: isPublishingCurator,
    filesApprovalThesis: isThesisCurator,
  });

  const selectedTicketTypes = Object.entries(ticketTypes)
    .filter(([, selected]) => selected)
    .map(([key]) => key);

  const institutionUserQuery = useFetchUserQuery(user?.nvaUsername ?? '');

  const ticketsQuery = useFetchTickets({
    searchParams: searchParams,
    enabled: isOnTicketsPage && !institutionUserQuery.isPending,
    selectedTicketTypes: selectedTicketTypes,
  });

  return (
    <TasksContext value={{ institutionUserQuery, ticketsQuery, ticketTypes, setTicketTypes }}>
      <StyledPageWithSideMenu>
        <TasksSideMenu />
        <Outlet />
        <TasksRoutes />
      </StyledPageWithSideMenu>
    </TasksContext>
  );
};

export default TasksPage;
