import { SideMenu } from '../../../components/SideMenu';
import { checkPages } from '../tasks-helpers';
import { useTranslation } from 'react-i18next';
import { SideNavHeader } from '../../../components/PageWithSideMenu';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { hasCuratorRole, hasTicketCuratorRole, isNviCurator } from '../../../utils/user-helpers';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { TasksSideMenuMinimized } from './TasksSideMenuMinimized';
import { UserDialogFiltersAccordion } from './UserDialogFiltersAccordion';
import { ResultRegistrationsNavigationListAccordion } from './ResultRegistrationsNavigationListAccordion';
import { NviCandidatesNavigationAccordion } from './NviCandidatesNavigationAccordion';
import { NviCorrectionListNavigationAccordion } from './NviCorrectionListNavigationAccordion';
import { useLocation } from 'react-router';

export const TasksSideMenu = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isOnTicketPage, isOnNviCandidateDetailPage } = checkPages(location);
  const isOnTaskDetailsPage = isOnTicketPage || isOnNviCandidateDetailPage;
  const user = useSelector((store: RootState) => store.user);
  const userIsNviCurator = isNviCurator(user);
  const isTicketCurator = hasTicketCuratorRole(user);
  const isAnyCurator = hasCuratorRole(user);

  return (
    <SideMenu expanded={!isOnTaskDetailsPage} minimizedMenu={<TasksSideMenuMinimized />}>
      <SideNavHeader icon={AssignmentIcon} text={t('common.tasks')} />
      {isTicketCurator && <UserDialogFiltersAccordion />}
      {isAnyCurator && <ResultRegistrationsNavigationListAccordion />}
      {userIsNviCurator && <NviCandidatesNavigationAccordion />}
      {userIsNviCurator && <NviCorrectionListNavigationAccordion />}
    </SideMenu>
  );
};
