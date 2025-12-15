import { UrlPathTemplate } from '../../utils/urlPaths';
import { LocationWithNviCandidatePageState } from '../../types/locationState.types';

export const checkPages = (location: LocationWithNviCandidatePageState) => {
  const isOnTicketsPage = location.pathname === UrlPathTemplate.TasksDialogue;
  const isOnTicketPage = location.pathname.startsWith(UrlPathTemplate.TasksDialogue) && !isOnTicketsPage;

  // The NVI search / overview pages that correspond to the buttons in the NVI side panel
  const isOnNviCandidatesPage = location.pathname === UrlPathTemplate.TasksNvi;
  const isOnNviStatusPage = location.pathname === UrlPathTemplate.TasksNviStatus;
  const isOnNviDisputesPage = location.pathname === UrlPathTemplate.TasksNviDisputes;
  const isOnNviPublicationPointsPage = location.pathname === UrlPathTemplate.TasksPublicationPoints;

  // The NVI candidate detail page that is reached by clicking a candidate from the NVI search
  const isOnNviCandidatePage =
    location.pathname.startsWith(UrlPathTemplate.TasksNvi) &&
    !isOnNviCandidatesPage &&
    !isOnNviStatusPage &&
    !isOnNviDisputesPage &&
    !isOnNviPublicationPointsPage;

  return { isOnTicketsPage, isOnTicketPage, isOnNviCandidatePage };
};
