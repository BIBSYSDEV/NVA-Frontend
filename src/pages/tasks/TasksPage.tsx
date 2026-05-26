import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import { useFetchTickets } from '../../api/hooks/useFetchTickets';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum } from '../../api/searchApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { SideMenu } from '../../components/SideMenu';
import { TicketListDefaultValuesWrapper } from '../../components/TicketListDefaultValuesWrapper';
import { RootState } from '../../redux/store';
import { TicketTypeSelection } from '../../types/publication_types/ticket.types';
import { PrivateRoute } from '../../utils/routes/Routes';
import { getNviCandidatesSearchPath, getSubUrl, UrlPathTemplate } from '../../utils/urlPaths';
import { checkUserRoles } from '../../utils/user-helpers';
import { PortfolioSearchPage } from '../editor/PortfolioSearchPage';
import NotFound from '../errorpages/NotFound';
import { NviCorrectionList } from '../messages/components/NviCorrectionList';
import { NviCorrectionListNavigationAccordion } from '../messages/components/NviCorrectionListNavigationAccordion';
import { NviDisputePage } from '../messages/components/NviDisputePage';
import { ResultRegistrationsNavigationListAccordion } from '../messages/components/ResultRegistrationsNavigationListAccordion';
import { TicketList } from '../messages/components/TicketList';
import { checkPages } from '../messages/tasks-helpers';
import { RegistrationLandingPage } from '../public_registration/RegistrationLandingPage';
import { NviCandidatesNavigationAccordion } from './_components/NviCandidatesNavigationAccordion';
import { TasksPageMinimizedIconButton } from './_components/TasksPageMinimizedIconButton';
import { UserDialogueNavigationAccordion } from './_components/UserDialogueNavigationAccordion';
import { NviCandidatePage } from './nvi/nvi-candidate-page/NviCandidatePage';
import { NviCandidatesListPage } from './nvi/NviCandidatesListPage';
import { NviPublicationPointsPage } from './nvi/publication-points/NviPublicationPointsPage';
import { NviReportingStatusPage } from './nvi/status/NviReportingStatusPage';

const TasksPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);
  const { isNviCurator, isPublishingCurator, isThesisCurator, isDoiCurator, isSupportCurator } = checkUserRoles(user);
  const isTicketCurator = isSupportCurator || isDoiCurator || isPublishingCurator || isThesisCurator;
  const isAnyCurator = isTicketCurator || isNviCurator;

  const { isOnTicketsPage, isOnTicketPage, isOnNviCandidatePage } = checkPages(location.pathname);
  const isOnADetailsPage = isOnTicketPage || isOnNviCandidatePage;

  const searchParams = new URLSearchParams(location.search);

  const [ticketTypeToggles, setTicketTypeToggles] = useState<TicketTypeSelection>({
    doiRequest: isDoiCurator,
    generalSupportCase: isSupportCurator,
    publishingRequest: isPublishingCurator,
    filesApprovalThesis: isThesisCurator,
  });

  const selectedTicketTypes = Object.entries(ticketTypeToggles)
    .filter(([, selected]) => selected)
    .map(([key]) => key);

  const ticketsQuery = useFetchTickets({
    enabled: isOnTicketsPage,
    searchParams,
    selectedTicketTypes,
  });

  return (
    <StyledPageWithSideMenu>
      <SideMenu expanded={!isOnADetailsPage} minimizedMenu={<TasksPageMinimizedIconButton />}>
        <SideNavHeader icon={AssignmentIcon} text={t('common.tasks')} />
        {isTicketCurator && (
          <UserDialogueNavigationAccordion
            ticketTypeToggles={ticketTypeToggles}
            setTicketTypeToggles={setTicketTypeToggles}
            ticketsAggregations={ticketsQuery.data?.aggregations}
          />
        )}
        {isAnyCurator && <ResultRegistrationsNavigationListAccordion />}
        {isNviCurator && (
          <>
            <NviCandidatesNavigationAccordion />
            <NviCorrectionListNavigationAccordion />
          </>
        )}
      </SideMenu>

      <Outlet />

      <ErrorBoundary>
        <Routes>
          <Route
            path={UrlPathTemplate.Root}
            element={
              <PrivateRoute
                isAuthorized={isAnyCurator}
                element={
                  isTicketCurator ? (
                    <Navigate to={UrlPathTemplate.TasksDialogue} replace />
                  ) : (
                    <Navigate
                      to={getNviCandidatesSearchPath({
                        username: user?.nvaUsername,
                        status: NviCandidateStatusEnum.Pending,
                        globalStatus: NviCandidateGlobalStatusEnum.Pending,
                      })}
                      replace
                    />
                  )
                }
              />
            }
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksDialogue, UrlPathTemplate.Tasks)}
            element={
              <PrivateRoute
                isAuthorized={isTicketCurator}
                element={
                  <TicketListDefaultValuesWrapper>
                    <TicketList
                      ticketsQuery={ticketsQuery}
                      title={t('tasks.user_dialog')}
                      selectedTicketTypes={selectedTicketTypes}
                    />
                  </TicketListDefaultValuesWrapper>
                }
              />
            }
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksDialogueRegistration, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<RegistrationLandingPage />} isAuthorized={isTicketCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksNvi, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<NviCandidatesListPage />} isAuthorized={isNviCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksNviStatus, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<NviReportingStatusPage />} isAuthorized={isNviCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksNviDisputes, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<NviDisputePage />} isAuthorized={isNviCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksPublicationPoints, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<NviPublicationPointsPage />} isAuthorized={isNviCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksNviCandidate, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<NviCandidatePage />} isAuthorized={isNviCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksNviCorrectionList, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<NviCorrectionList />} isAuthorized={isNviCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksResultRegistrations, UrlPathTemplate.Tasks)}
            element={
              <PrivateRoute
                element={<PortfolioSearchPage title={t('common.result_portfolio')} />}
                isAuthorized={isAnyCurator}
              />
            }
          />

          <Route path={getSubUrl(UrlPathTemplate.Tasks, UrlPathTemplate.Tasks, true)} element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </StyledPageWithSideMenu>
  );
};

export default TasksPage;
