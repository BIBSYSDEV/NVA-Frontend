import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useFetchTickets } from '../../../api/hooks/useFetchTickets';
import { TicketSearchParam } from '../../../api/searchApi';
import { TaskNavigationLocationState } from '../../../types/locationState.types';
import { getTasksRegistrationPath } from '../../../utils/urlPaths';
import { updateNavigationOffset } from '../_utils/task-navigation-state';
import { ListNavigationButtonBack } from './ListNavigationButtonBack';
import { ListNavigationButtonNext } from './ListNavigationButtonNext';

export const TaskNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state as TaskNavigationLocationState;

  const currentOffset = locationState?.ticketOffset;
  const hasOffset = typeof currentOffset === 'number';
  const isFirst = hasOffset && currentOffset === 0;

  const ticketSearchParams = new URLSearchParams(locationState?.previousSearch ?? '');

  if (hasOffset) {
    ticketSearchParams.set(TicketSearchParam.From, String(Math.max(currentOffset - 1, 0))); // Setting from-parameter to the offset of the previous ticket if there is one.
    ticketSearchParams.set(TicketSearchParam.Results, '3'); // Only fetching previous, current and next ticket.
  }

  const ticketsQuery = useFetchTickets({
    enabled: hasOffset,
    searchParams: ticketSearchParams,
    selectedTicketTypes: locationState?.ticketTypeFilters ?? [],
  });

  const previousTicketIdentifier =
    ticketsQuery.isSuccess && !isFirst ? ticketsQuery.data.hits[0]?.publication.identifier : null;

  const nextTicketIdentifier = ticketsQuery.isSuccess
    ? ticketsQuery.data.hits[isFirst ? 1 : 2]?.publication.identifier
    : null;

  return (
    <>
      {previousTicketIdentifier && (
        <ListNavigationButtonBack
          to={getTasksRegistrationPath(previousTicketIdentifier)}
          state={updateNavigationOffset(locationState, currentOffset! - 1)}
          title={t('tasks.dialogue.previous_ticket')}
        />
      )}
      {nextTicketIdentifier && (
        <ListNavigationButtonNext
          to={getTasksRegistrationPath(nextTicketIdentifier)}
          state={updateNavigationOffset(locationState, currentOffset! + 1)}
          title={t('tasks.dialogue.next_ticket')}
        />
      )}
    </>
  );
};
