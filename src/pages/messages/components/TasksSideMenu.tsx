import { SideMenu } from '../../../components/SideMenu';
import { checkIfOnPages } from '../tasks-helpers';
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
  const { isOnTicketPage, isOnNviCandidateDetailPage } = checkIfOnPages(location);
  const isOnDetailsPage = isOnTicketPage || isOnNviCandidateDetailPage;
  const user = useSelector((store: RootState) => store.user);
  const userHasTicketCuratorRole = hasTicketCuratorRole(user);
  const userHasCuratorRole = hasCuratorRole(user);
  const userIsNviCurator = isNviCurator(user);

  return (
    <SideMenu expanded={!isOnDetailsPage} minimizedMenu={<TasksSideMenuMinimized />}>
      <SideNavHeader icon={AssignmentIcon} text={t('common.tasks')} />
      {userHasTicketCuratorRole && <UserDialogFiltersAccordion />}
      {userHasCuratorRole && <ResultRegistrationsNavigationListAccordion />}
      {userIsNviCurator && <NviCandidatesNavigationAccordion />}
      {userIsNviCurator && <NviCorrectionListNavigationAccordion />}
    </SideMenu>
  );
};
