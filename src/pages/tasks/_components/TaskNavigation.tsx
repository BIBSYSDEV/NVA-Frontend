import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useFetchTickets } from '../../../api/hooks/useFetchTickets';
import { TicketSearchParam } from '../../../api/searchApi';
import { ListNavigationButtonBack } from '../../../components/_atoms/buttons/navigation/ListNavigationButtonBack';
import { ListNavigationButtonNext } from '../../../components/_atoms/buttons/navigation/ListNavigationButtonNext';
import { TaskNavigationLocationState } from '../../../types/locationState.types';
import { getTasksRegistrationPath } from '../../../utils/urlPaths';
import { generateTaskNavigationState } from '../_utils/generate-task-navigation-state';

export const TaskNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state as TaskNavigationLocationState;

  const currentOffset = locationState?.ticketOffset;
  const hasOffset = typeof currentOffset === 'number';
  const isFirst = hasOffset && currentOffset === 0;

  const navigationSearchParams = new URLSearchParams(locationState?.previousSearch ?? '');

  if (hasOffset) {
    navigationSearchParams.set(TicketSearchParam.From, String(Math.max(currentOffset - 1, 0))); // Setting from-parameter to the offset of the previous candidate if there is one, so that the upcoming fetch will return the previous and next candidates around the current one.
    navigationSearchParams.set(TicketSearchParam.Results, '3'); // Only fetching previous, current and next candidate, since that's all we need to determine the identifiers of the previous and next candidate.
  }

  const ticketsQuery = useFetchTickets({
    enabled: hasOffset,
    searchParams: navigationSearchParams,
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
          state={generateTaskNavigationState(locationState, currentOffset! - 1)}
          title={t('tasks.dialogue.previous_ticket')}
        />
      )}
      {nextTicketIdentifier && (
        <ListNavigationButtonNext
          to={getTasksRegistrationPath(nextTicketIdentifier)}
          state={generateTaskNavigationState(locationState, currentOffset! + 1)}
          title={t('tasks.dialogue.next_ticket')}
        />
      )}
    </>
  );
};
