import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { Badge } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useFetchUserQuery } from '../../api/hooks/useFetchUserQuery';
import { fetchCustomerTickets, FetchTicketsParams, TicketSearchParam } from '../../api/searchApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { MinimizedMenuIconButton, SideMenu } from '../../components/SideMenu';
import { StyledTicketSearchFormGroup } from '../../components/styled/Wrappers';
import { TicketListDefaultValuesWrapper } from '../../components/TicketListDefaultValuesWrapper';
import { TicketTypeFilterButton } from '../../components/TicketTypeFilterButton';
import { RootState } from '../../redux/store';
import { PreviousSearchLocationState } from '../../types/locationState.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { getTaskNotificationsParams } from '../../utils/searchHelpers';
import { getSubUrl, UrlPathTemplate } from '../../utils/urlPaths';
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

const TasksPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state as PreviousSearchLocationState;
  const user = useSelector((store: RootState) => store.user);
  const isSupportCurator = !!user?.isSupportCurator;
  const isDoiCurator = !!user?.isDoiCurator;
  const isPublishingCurator = !!user?.isPublishingCurator;
  const isTicketCurator = isSupportCurator || isDoiCurator || isPublishingCurator;
  const isNviCurator = !!user?.isNviCurator;
  const isAnyCurator = isTicketCurator || isNviCurator;

  const isOnTicketsPage = location.pathname === UrlPathTemplate.TasksDialogue;
  const isOnTicketPage = location.pathname.startsWith(UrlPathTemplate.TasksDialogue) && !isOnTicketsPage;
  const isOnNviCandidatesPage = location.pathname === UrlPathTemplate.TasksNvi;
  const isOnNviStatusPage = location.pathname === UrlPathTemplate.TasksNviStatus;
  const isOnCorrectionListPage = location.pathname === UrlPathTemplate.TasksNviCorrectionList;
  const isOnResultRegistrationsPage = location.pathname === UrlPathTemplate.TasksResultRegistrations;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const institutionUserQuery = useFetchUserQuery(user?.nvaUsername ?? '');

  const searchParams = new URLSearchParams(location.search);

  const [ticketTypes, setTicketTypes] = useState({
    doiRequest: isDoiCurator,
    generalSupportCase: isSupportCurator,
    publishingRequest: isPublishingCurator,
  });

  const selectedTicketTypes = Object.entries(ticketTypes)
    .filter(([, selected]) => selected)
    .map(([key]) => key);

  const organizationIdParam = searchParams.get(TicketSearchParam.OrganizationId);

  const ticketSearchParams: FetchTicketsParams = {
    aggregation: 'all',
    query: searchParams.get(TicketSearchParam.Query),
    results: rowsPerPage,
    from: (page - 1) * rowsPerPage,
    orderBy: searchParams.get(TicketSearchParam.OrderBy) as 'createdDate' | null,
    sortOrder: searchParams.get(TicketSearchParam.SortOrder) as 'asc' | 'desc' | null,
    organizationId: organizationIdParam,
    excludeSubUnits: organizationIdParam ? true : undefined,
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
  const supportNotificationsCount = notificationsQuery.data?.aggregations?.byUserPending?.find(
    (notification) => notification.key === 'GeneralSupportCase'
  )?.count;

  const ticketTypeBuckets = ticketsQuery.data?.aggregations?.type ?? [];
  const doiRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'DoiRequest')?.count;
  const publishingRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'PublishingRequest')?.count;
  const generalSupportCaseCount = ticketTypeBuckets.find((bucket) => bucket.key === 'GeneralSupportCase')?.count;

  return (
    <StyledPageWithSideMenu>
      <SideMenu
        expanded={
          isOnTicketsPage ||
          isOnNviCandidatesPage ||
          isOnNviStatusPage ||
          isOnCorrectionListPage ||
          isOnResultRegistrationsPage
        }
        minimizedMenu={
          <Link
            to={{
              pathname: isOnTicketPage ? UrlPathTemplate.TasksDialogue : UrlPathTemplate.TasksNvi,
              search: locationState?.previousSearch,
            }}>
            <MinimizedMenuIconButton title={t('common.tasks')}>
              <AssignmentIcon />
            </MinimizedMenuIconButton>
          </Link>
        }>
        <SideNavHeader icon={AssignmentIcon} text={t('common.tasks')} />

        {isTicketCurator && (
          <NavigationListAccordion
            title={t('tasks.user_dialog')}
            startIcon={<AssignmentIcon sx={{ bgcolor: 'white' }} />}
            accordionPath={UrlPathTemplate.TasksDialogue}
            onClick={() => {
              if (!isOnTicketsPage) {
                setPage(1);
              }
            }}
            dataTestId={dataTestId.tasksPage.userDialogAccordion}>
            <StyledTicketSearchFormGroup sx={{ gap: '0.5rem' }}>
              {isPublishingCurator && (
                <TicketTypeFilterButton
                  data-testid={dataTestId.tasksPage.typeSearch.publishingButton}
                  endIcon={<Badge badgeContent={publishingNotificationsCount} />}
                  showCheckbox
                  isSelected={ticketTypes.publishingRequest}
                  color="publishingRequest"
                  onClick={() => setTicketTypes({ ...ticketTypes, publishingRequest: !ticketTypes.publishingRequest })}>
                  {ticketTypes.publishingRequest && publishingRequestCount
                    ? `${t('my_page.messages.types.PublishingRequest')} (${publishingRequestCount})`
                    : t('my_page.messages.types.PublishingRequest')}
                </TicketTypeFilterButton>
              )}

              {isDoiCurator && (
                <TicketTypeFilterButton
                  data-testid={dataTestId.tasksPage.typeSearch.doiButton}
                  endIcon={<Badge badgeContent={doiNotificationsCount} />}
                  showCheckbox
                  isSelected={ticketTypes.doiRequest}
                  color="doiRequest"
                  onClick={() => setTicketTypes({ ...ticketTypes, doiRequest: !ticketTypes.doiRequest })}>
                  {ticketTypes.doiRequest && doiRequestCount
                    ? `${t('my_page.messages.types.DoiRequest')} (${doiRequestCount})`
                    : t('my_page.messages.types.DoiRequest')}
                </TicketTypeFilterButton>
              )}

              {isSupportCurator && (
                <TicketTypeFilterButton
                  data-testid={dataTestId.tasksPage.typeSearch.supportButton}
                  endIcon={<Badge badgeContent={supportNotificationsCount} />}
                  showCheckbox
                  isSelected={ticketTypes.generalSupportCase}
                  color="generalSupportCase"
                  onClick={() =>
                    setTicketTypes({ ...ticketTypes, generalSupportCase: !ticketTypes.generalSupportCase })
                  }>
                  {ticketTypes.generalSupportCase && generalSupportCaseCount
                    ? `${t('my_page.messages.types.GeneralSupportCase')} (${generalSupportCaseCount})`
                    : t('my_page.messages.types.GeneralSupportCase')}
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
                    <Navigate to={UrlPathTemplate.TasksNvi} replace />
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
                      rowsPerPage={rowsPerPage}
                      setRowsPerPage={setRowsPerPage}
                      page={page}
                      setPage={setPage}
                      title={t('common.tasks')}
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
                element={<PortfolioSearchPage title={t('common.result_registrations')} />}
                isAuthorized={isNviCurator}
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
