import { UrlPathTemplate } from '../../../utils/urlPaths';

interface SelectTasksBackPathParams {
  isOnTicketPage?: boolean;
  isOnDisputePage?: boolean;
  previousSearch?: string;
}

/**
 * Returns the navigation target for the minimized side-menu back button.
 * @param isOnTicketPage - Whether the user is currently on a ticket detail page.
 * @param isOnDisputePage - Whether the user is currently on the NVI disputes page.
 * @param previousSearch - The previous search query string to restore.
 * @returns A navigation object with pathname and search.
 */
export const selectTasksBackPath = ({
  isOnTicketPage = false,
  isOnDisputePage = false,
  previousSearch,
}: SelectTasksBackPathParams) => {
  return {
    pathname: isOnTicketPage
      ? UrlPathTemplate.TasksDialogue
      : isOnDisputePage
        ? UrlPathTemplate.TasksNviDisputes
        : UrlPathTemplate.TasksNvi,
    search: previousSearch,
  };
};
