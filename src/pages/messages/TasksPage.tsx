import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { Badge } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router';
import { useFetchUserQuery } from '../../api/hooks/useFetchUserQuery';
import {
  fetchCustomerTickets,
  FetchTicketsParams,
  NviCandidateGlobalStatusEnum,
  NviCandidateStatusEnum,
  SortOrder,
  TicketOrderBy,
  TicketSearchParam,
} from '../../api/searchApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { MinimizedMenuIconButton, SideMenu } from '../../components/SideMenu';
import { StyledTicketSearchFormGroup } from '../../components/styled/Wrappers';
import { TicketListDefaultValuesWrapper } from '../../components/TicketListDefaultValuesWrapper';
import { TicketTypeFilterButton } from '../../components/TicketTypeFilterButton';
import { RootState } from '../../redux/store';
import { PreviousSearchLocationState } from '../../types/locationState.types';
import { TicketTypeEnum, TicketTypeSelection } from '../../types/publication_types/ticket.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { getTaskNotificationsParams, resetPaginationAndNavigate } from '../../utils/searchHelpers';
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

const TasksPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state as PreviousSearchLocationState;
  const navigate = useNavigate();

  const user = useSelector((store: RootState) => store.user);
  const isSupportCurator = !!user?.isSupportCurator;
  const isDoiCurator = !!user?.isDoiCurator;
  const isPublishingCurator = !!user?.isPublishingCurator;
  const isThesisCurator = !!user?.isThesisCurator;
  const isTicketCurator = isSupportCurator || isDoiCurator || isPublishingCurator || isThesisCurator;
  const isNviCurator = !!user?.isNviCurator;
  const isAnyCurator = isTicketCurator || isNviCurator;

  const isOnTicketsPage = location.pathname === UrlPathTemplate.TasksDialogue;
  const isOnTicketPage = location.pathname.startsWith(UrlPathTemplate.TasksDialogue) && !isOnTicketsPage;

  const isOnNviCandidatesPage = location.pathname === UrlPathTemplate.TasksNvi;
  const isOnNviStatusPage = location.pathname === UrlPathTemplate.TasksNviStatus;
  const isOnNviCandidatePage =
    location.pathname.startsWith(UrlPathTemplate.TasksNvi) && !isOnNviCandidatesPage && !isOnNviStatusPage;

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

  const organizationIdParam = searchParams.get(TicketSearchParam.OrganizationId);

  const ticketSearchParams: FetchTicketsParams = {
    aggregation: 'all',
    query: searchParams.get(TicketSearchParam.Query),
    results: Number(searchParams.get(TicketSearchParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]),
    from: Number(searchParams.get(TicketSearchParam.From) ?? 0),
    orderBy: searchParams.get(TicketSearchParam.OrderBy) as TicketOrderBy | null,
    sortOrder: searchParams.get(TicketSearchParam.SortOrder) as SortOrder | null,
    organizationId: organizationIdParam,
    excludeSubUnits: searchParams.get(TicketSearchParam.ExcludeSubUnits) === 'true',
    assignee: searchParams.get(TicketSearchParam.Assignee),
    status: searchParams.get(TicketSearchParam.Status),
    type: selectedTicketTypes.join(','),
    viewedByNot: searchParams.get(TicketSearchParam.ViewedByNot),
    createdDate: searchParams.get(TicketSearchParam.CreatedDate),
    publicationType: searchParams.get(TicketSearchParam.PublicationType),
  };

  const ticketsQuery = useQuery({
    enabled: isOnTicketsPage && !institutionUserQuery.isPending,
    queryKey: ['tickets', ticketSearchParams],
    queryFn: () => fetchCustomerTickets(ticketSearchParams),
    meta: { errorMessage: t('feedback.error.get_messages') },
  });

  const tasksNotificationParams = getTaskNotificationsParams(user);
  const notificationsQuery = useQuery({
    enabled: isOnTicketsPage && !institutionUserQuery.isPending,
    queryKey: ['taskNotifications', tasksNotificationParams],
    queryFn: () => fetchCustomerTickets(tasksNotificationParams),
    meta: { errorMessage: t('feedback.error.get_messages') },
  });

  const doiNotificationsCount = notificationsQuery.data?.aggregations?.byUserPending?.find(
    (notification) => notification.key === 'DoiRequest'
  )?.count;
  const publishingNotificationsCount = notificationsQuery.data?.aggregations?.byUserPending?.find(
    (notification) => notification.key === 'PublishingRequest'
  )?.count;
  const thesisPublishingNotificationsCount = notificationsQuery.data?.aggregations?.byUserPending?.find(
    (notification) => notification.key === 'FilesApprovalThesis'
  )?.count;
  const supportNotificationsCount = notificationsQuery.data?.aggregations?.byUserPending?.find(
    (notification) => notification.key === 'GeneralSupportCase'
  )?.count;

  const ticketTypeBuckets = ticketsQuery.data?.aggregations?.type ?? [];
  const doiRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'DoiRequest')?.count;
  const publishingRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'PublishingRequest')?.count;
  const thesisPublishingRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'FilesApprovalThesis')?.count;
  const generalSupportCaseCount = ticketTypeBuckets.find((bucket) => bucket.key === 'GeneralSupportCase')?.count;

  return (
    <StyledPageWithSideMenu>
      <SideMenu
        expanded={!isOnTicketPage && !isOnNviCandidatePage}
        minimizedMenu={
          <MinimizedMenuIconButton
            title={t('common.tasks')}
            to={{
              pathname: isOnTicketPage ? UrlPathTemplate.TasksDialogue : UrlPathTemplate.TasksNvi,
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
