import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { Badge } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router';
import { useFetchUserQuery } from '../../api/hooks/useFetchUserQuery';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum, TicketSearchParam } from '../../api/searchApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { MinimizedMenuIconButton, SideMenu } from '../../components/SideMenu';
import { StyledTicketSearchFormGroup } from '../../components/styled/Wrappers';
import { TicketListDefaultValuesWrapper } from '../../components/TicketListDefaultValuesWrapper';
import { TicketTypeFilterButton } from '../../components/TicketTypeFilterButton';
import { RootState } from '../../redux/store';
import { TicketTypeEnum, TicketTypeSelection } from '../../types/publication_types/ticket.types';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { resetPaginationAndNavigate } from '../../utils/searchHelpers';
import { getNviCandidatesSearchPath, getSubUrl, UrlPathTemplate } from '../../utils/urlPaths';
import { PortfolioSearchPage } from '../editor/PortfolioSearchPage';
import NotFound from '../errorpages/NotFound';
import { RegistrationLandingPage } from '../public_registration/RegistrationLandingPage';
import { NviCandidatePage } from './components/NviCandidatePage';
import { NviCandidatesList } from './components/NviCandidatesList';
import { NviCandidatesNavigationAccordion } from './components/NviCandidatesNavigationAccordion';
import { NviCorrectionList } from './components/NviCorrectionList';
import { NviCorrectionListNavigationAccordion } from './components/NviCorrectionListNavigationAccordion';
import { NviStatusPage } from './components/NviStatusPage';
import { ResultRegistrationsNavigationListAccordion } from './components/ResultRegistrationsNavigationListAccordion';
import { TicketList } from './components/TicketList';
import { TicketTypeTag } from './components/TicketTypeTag';
import { NviDisputePage } from './components/NviDisputePage';
import { NviPublicationPointsPage } from './components/NviPublicationPointsPage';
import { useFetchTickets } from '../../api/hooks/useFetchTickets';
import { useGetNotificationCounts, useGetTicketsCounts } from './user-dialog-helpers';
import { checkPages } from './tasks-helpers';
import { checkUserRoles } from '../../utils/user-helpers';

const TasksPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state;
  const navigate = useNavigate();

  const user = useSelector((store: RootState) => store.user);
  const { isNviCurator, isPublishingCurator, isThesisCurator, isDoiCurator, isSupportCurator } = checkUserRoles(user);
  const isTicketCurator = isSupportCurator || isDoiCurator || isPublishingCurator || isThesisCurator;
  const isAnyCurator = isTicketCurator || isNviCurator;

  const { isOnTicketsPage, isOnTicketPage, isOnNviCandidatePage } = checkPages(location);

  const institutionUserQuery = useFetchUserQuery(user?.nvaUsername ?? '');

  const searchParams = new URLSearchParams(location.search);

  const [ticketTypes, setTicketTypes] = useState<TicketTypeSelection>({
    doiRequest: isDoiCurator,
    generalSupportCase: isSupportCurator,
    publishingRequest: isPublishingCurator,
    filesApprovalThesis: isThesisCurator,
  });

  const selectedTicketTypes = Object.entries(ticketTypes)
    .filter(([, selected]) => selected)
    .map(([key]) => key);

  const ticketsQuery = useFetchTickets({
    enabled: isOnTicketsPage && !institutionUserQuery.isPending,
    searchParams,
    selectedTicketTypes,
  });

  const {
    doiNotificationsCount,
    publishingNotificationsCount,
    thesisPublishingNotificationsCount,
    supportNotificationsCount,
  } = useGetNotificationCounts({
    notificationsQueryEnabled: isOnTicketsPage && !institutionUserQuery.isPending,
    user,
  });

  const { doiRequestCount, publishingRequestCount, thesisPublishingRequestCount, generalSupportCaseCount } =
    useGetTicketsCounts({ ticketsAggregations: ticketsQuery.data?.aggregations });

  return (
    <StyledPageWithSideMenu>
      <SideMenu
        expanded={!isOnTicketPage && !isOnNviCandidatePage}
        minimizedMenu={
          <MinimizedMenuIconButton
            title={t('common.tasks')}
            to={{
              pathname: isOnTicketPage
                ? UrlPathTemplate.TasksDialogue
                : locationState?.isOnDisputePage
                  ? UrlPathTemplate.TasksNviDisputes
                  : UrlPathTemplate.TasksNvi,
              search: locationState?.previousSearch,
            }}>
            <AssignmentIcon />
          </MinimizedMenuIconButton>
        }>
        <SideNavHeader icon={AssignmentIcon} text={t('common.tasks')} />

        {isTicketCurator && (
          <NavigationListAccordion
            title={t('tasks.user_dialog')}
            startIcon={<AssignmentIcon />}
            accordionPath={UrlPathTemplate.TasksDialogue}
            onClick={() => {
              if (!isOnTicketsPage) {
                searchParams.delete(TicketSearchParam.From);
              }
            }}
            dataTestId={dataTestId.tasksPage.userDialogAccordion}>
            <StyledTicketSearchFormGroup sx={{ gap: '0.5rem', mt: 0 }}>
              {isPublishingCurator && (
                <TicketTypeFilterButton
                  data-testid={dataTestId.tasksPage.typeSearch.publishingButton}
                  endIcon={<Badge badgeContent={publishingNotificationsCount} />}
                  isSelected={!!ticketTypes.publishingRequest}
                  onClick={() => {
                    setTicketTypes({ ...ticketTypes, publishingRequest: !ticketTypes.publishingRequest });
                    resetPaginationAndNavigate(searchParams, navigate);
                  }}>
                  <TicketTypeTag
                    count={ticketTypes.publishingRequest && publishingRequestCount ? publishingRequestCount : undefined}
                    type={TicketTypeEnum.PublishingRequest}
                  />
                </TicketTypeFilterButton>
              )}

              {isThesisCurator && (
                <TicketTypeFilterButton
                  data-testid={dataTestId.tasksPage.typeSearch.thesisPublishingRequestsButton}
                  endIcon={<Badge badgeContent={thesisPublishingNotificationsCount} />}
                  isSelected={!!ticketTypes.filesApprovalThesis}
                  onClick={() => {
                    setTicketTypes({ ...ticketTypes, filesApprovalThesis: !ticketTypes.filesApprovalThesis });
                    resetPaginationAndNavigate(searchParams, navigate);
                  }}>
                  <TicketTypeTag
                    count={
                      ticketTypes.filesApprovalThesis && thesisPublishingRequestCount
                        ? thesisPublishingRequestCount
                        : undefined
                    }
                    type={TicketTypeEnum.FilesApprovalThesis}
                  />
                </TicketTypeFilterButton>
              )}

              {isDoiCurator && (
                <TicketTypeFilterButton
                  data-testid={dataTestId.tasksPage.typeSearch.doiButton}
                  endIcon={<Badge badgeContent={doiNotificationsCount} />}
                  isSelected={!!ticketTypes.doiRequest}
                  onClick={() => {
                    setTicketTypes({ ...ticketTypes, doiRequest: !ticketTypes.doiRequest });
                    resetPaginationAndNavigate(searchParams, navigate);
                  }}>
                  <TicketTypeTag
                    count={ticketTypes.doiRequest && doiRequestCount ? doiRequestCount : undefined}
                    type={TicketTypeEnum.DoiRequest}
                  />
                </TicketTypeFilterButton>
              )}

              {isSupportCurator && (
                <TicketTypeFilterButton
                  data-testid={dataTestId.tasksPage.typeSearch.supportButton}
                  endIcon={<Badge badgeContent={supportNotificationsCount} />}
                  isSelected={!!ticketTypes.generalSupportCase}
                  onClick={() => {
                    setTicketTypes({ ...ticketTypes, generalSupportCase: !ticketTypes.generalSupportCase });
                    resetPaginationAndNavigate(searchParams, navigate);
                  }}>
                  <TicketTypeTag
                    count={
                      ticketTypes.generalSupportCase && generalSupportCaseCount ? generalSupportCaseCount : undefined
                    }
                    type={TicketTypeEnum.GeneralSupportCase}
                  />
                </TicketTypeFilterButton>
              )}
            </StyledTicketSearchFormGroup>
          </NavigationListAccordion>
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
                    <TicketList ticketsQuery={ticketsQuery} title={t('tasks.user_dialog')} />
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
            element={<PrivateRoute element={<NviCandidatesList />} isAuthorized={isNviCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksNviStatus, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<NviStatusPage />} isAuthorized={isNviCurator} />}
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
