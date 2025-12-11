import { useTranslation } from 'react-i18next';
import { MinimizedMenuIconButton } from '../../../components/SideMenu';
import { findBackPathFromTasksLocation } from '../tasks-helpers';
import { useLocation } from 'react-router';
import { TasksPageLocationState } from '../../../types/locationState.types';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';

/* This is the minimized version of the menu that is displayed as a back-arrow when going into a specific search result.
 * When clicked, the arrow leads back to the search the user came from  */
export const TasksSideMenuMinimized = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state as TasksPageLocationState;
  const cameFrom = findBackPathFromTasksLocation(location);

  return (
    <MinimizedMenuIconButton
      title={t('common.tasks')}
      to={{ pathname: cameFrom, search: locationState?.previousSearch }}>
      <AssignmentIcon />
    </MinimizedMenuIconButton>
  );
};
