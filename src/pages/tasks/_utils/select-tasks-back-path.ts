import { UrlPathTemplate } from '../../../utils/urlPaths';

interface selectTasksBackButtonPathParams {
  isOnTicketPage?: boolean;
  isOnDisputePage?: boolean;
  previousSearch?: string;
}

export const selectTasksBackPath = ({
  isOnTicketPage = false,
  isOnDisputePage = false,
  previousSearch,
}: selectTasksBackButtonPathParams) => {
  return {
    pathname: isOnTicketPage
      ? UrlPathTemplate.TasksDialogue
      : isOnDisputePage
        ? UrlPathTemplate.TasksNviDisputes
        : UrlPathTemplate.TasksNvi,
    search: previousSearch,
  };
};
