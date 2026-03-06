import { UrlPathTemplate } from '../../utils/urlPaths';

export const checkPages = (pathname: string) => {
  const isOnTicketsPage = pathname === UrlPathTemplate.TasksDialogue;
  const isOnTicketPage = pathname.startsWith(UrlPathTemplate.TasksDialogue) && !isOnTicketsPage;

  // The NVI search / overview pages that correspond to the buttons in the NVI side panel
  const isOnNviCandidatesPage = pathname === UrlPathTemplate.TasksNvi;
  const isOnNviStatusPage = pathname === UrlPathTemplate.TasksNviStatus;
  const isOnNviDisputesPage = pathname === UrlPathTemplate.TasksNviDisputes;
  const isOnNviPublicationPointsPage = pathname === UrlPathTemplate.TasksPublicationPoints;

  // The NVI candidate detail page that is reached by clicking a candidate from the NVI search
  const isOnNviCandidatePage =
    pathname.startsWith(UrlPathTemplate.TasksNvi) &&
    !isOnNviCandidatesPage &&
    !isOnNviStatusPage &&
    !isOnNviDisputesPage &&
    !isOnNviPublicationPointsPage;

  return { isOnTicketsPage, isOnTicketPage, isOnNviCandidatePage };
};
