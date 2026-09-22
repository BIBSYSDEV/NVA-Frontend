import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { BackToMenuButton } from '../../../components/side-menu-components/BackToMenuButton';
import { dataTestId } from '../../../utils/dataTestIds';
import { checkWhichTasksPage } from '../../../utils/location-helpers/check-which-tasks-page';
import { selectTasksBackPath } from '../_utils/select-tasks-back-path';

export const TasksPageMinimizedIconButton = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state;
  const { isOnTicketPage } = checkWhichTasksPage(location.pathname);

  return (
    <BackToMenuButton
      data-testid={dataTestId.tasksPage.minimizedMenuButton}
      title={t('common.tasks')}
      to={selectTasksBackPath({
        isOnTicketPage,
        isOnDisputePage: locationState?.isOnDisputePage,
        previousSearch: locationState?.previousSearch,
      })}>
      <AssignmentIcon />
    </BackToMenuButton>
  );
};
