import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { MinimizedMenuIconButton } from '../../../components/SideMenu';
import { dataTestId } from '../../../utils/dataTestIds';
import { checkPages } from '../../messages/tasks-helpers';
import { selectTasksBackPath } from '../_utils/select-tasks-back-path';

export const TasksPageMinimizedIconButton = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state;
  const { isOnTicketPage } = checkPages(location.pathname);

  return (
    <MinimizedMenuIconButton
      data-testid={dataTestId.tasksPage.minimizedMenuButton}
      title={t('common.tasks')}
      to={selectTasksBackPath({
        isOnTicketPage,
        isOnDisputePage: locationState?.isOnDisputePage,
        previousSearch: locationState?.previousSearch,
      })}>
      <AssignmentIcon />
    </MinimizedMenuIconButton>
  );
};
