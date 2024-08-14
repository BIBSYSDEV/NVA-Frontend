import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { Badge, Button, styled } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Redirect, Switch, useHistory } from 'react-router-dom';
import { useFetchUserQuery } from '../../api/hooks/useFetchUserQuery';
import { FetchTicketsParams, TicketSearchParam, fetchCustomerTickets } from '../../api/searchApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { LinkButton, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { SideMenu, StyledMinimizedMenuButton } from '../../components/SideMenu';
import { TicketListDefaultValuesWrapper } from '../../components/TicketListDefaultValuesWrapper';
import { TicketTypeFilterButton } from '../../components/TicketTypeFilterButton';
import { StyledTicketSearchFormGroup } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { PreviousSearchLocationState } from '../../types/locationState.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { taskNotificationsParams } from '../../utils/searchHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { RegistrationLandingPage } from '../public_registration/RegistrationLandingPage';
import { NviCandidatePage } from './components/NviCandidatePage';
import { NviCandidatesList } from './components/NviCandidatesList';
import { NviCandidatesNavigationAccordion } from './components/NviCandidatesNavigationAccordion';
import { NviCorrectionList } from './components/NviCorrectionList';
import { NviCorrectionListNavigationAccordion } from './components/NviCorrectionListNavigationAccordion';
import { NviStatusPage } from './components/NviStatusPage';
import { TicketList } from './components/TicketList';

export const StyledSearchModeButton = styled(LinkButton)({
  borderRadius: '1.5rem',
  textTransform: 'none',
});

const TasksPage = () => {
  const { t } = useTranslation();
  const history = useHistory<PreviousSearchLocationState>();
  const user = useSelector((store: RootState) => store.user);
  const isSupportCurator = !!user?.isSupportCurator;
  const isDoiCurator = !!user?.isDoiCurator;
  const isPublishingCurator = !!user?.isPublishingCurator;
  const isTicketCurator = isSupportCurator || isDoiCurator || isPublishingCurator;
  const isNviCurator = !!user?.isNviCurator;

  const isOnTicketsPage = history.location.pathname === UrlPathTemplate.TasksDialogue;
  const isOnTicketPage = history.location.pathname.startsWith(UrlPathTemplate.TasksDialogue) && !isOnTicketsPage;
  const isOnNviCandidatesPage = history.location.pathname === UrlPathTemplate.TasksNvi;
  const isOnNviStatusPage = history.location.pathname === UrlPathTemplate.TasksNviStatus;
  const isOnCorrectionListPage = history.location.pathname === UrlPathTemplate.TasksNviCorrectionList;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const institutionUserQuery = useFetchUserQuery(user?.nvaUsername ?? '');

  const searchParams = new URLSearchParams(history.location.search);

  const [ticketUnreadFilter, setTicketUnreadFilter] = useState(false);

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
    viewedByNot: ticketUnreadFilter && user ? user.nvaUsername : '',
    createdDate: searchParams.get(TicketSearchParam.CreatedDate),
    publicationType: searchParams.get(TicketSearchParam.PublicationType),
  };

  const ticketsQuery = useQuery({
    enabled: isOnTicketsPage && !institutionUserQuery.isPending,
    queryKey: ['tickets', ticketSearchParams],
    queryFn: () => fetchCustomerTickets(ticketSearchParams),
    meta: { errorMessage: t('feedback.error.get_messages') },
  });

  const notificationsQuery = useQuery({
    enabled: isOnTicketsPage && !institutionUserQuery.isPending,
    queryKey: ['taskNotifications', taskNotificationsParams],
    queryFn: () => fetchCustomerTickets(taskNotificationsParams),
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
        expanded={isOnTicketsPage || isOnNviCandidatesPage || isOnNviStatusPage || isOnCorrectionListPage}
        minimizedMenu={
          <Link
            to={{
              pathname: isOnTicketPage ? UrlPathTemplate.TasksDialogue : UrlPathTemplate.TasksNvi,
              search: history.location.state?.previousSearch,
            }}>
            <StyledMinimizedMenuButton title={t('common.tasks')}>
              <AssignmentIcon />
            </StyledMinimizedMenuButton>
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
            <StyledTicketSearchFormGroup>
              <Button
                data-testid={dataTestId.tasksPage.unreadSearchCheckbox}
                sx={{
                  width: 'fit-content',
                  background: ticketUnreadFilter ? undefined : 'white',
                  textTransform: 'none',
                }}
                variant={ticketUnreadFilter ? 'contained' : 'outlined'}
                startIcon={<MarkEmailUnreadIcon />}
                onClick={() => setTicketUnreadFilter(!ticketUnreadFilter)}>
                {t('tasks.unread')}
              </Button>
            </StyledTicketSearchFormGroup>

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

        {isNviCurator && (
          <>
            <NviCandidatesNavigationAccordion />
            <NviCorrectionListNavigationAccordion />
          </>
        )}
      </SideMenu>

      <ErrorBoundary>
        <Switch>
          <PrivateRoute exact path={UrlPathTemplate.Tasks} isAuthorized={isTicketCurator || isNviCurator}>
            {isTicketCurator ? (
              <Redirect to={UrlPathTemplate.TasksDialogue} />
            ) : (
              <Redirect to={UrlPathTemplate.TasksNvi} />
            )}
          </PrivateRoute>

          <PrivateRoute exact path={UrlPathTemplate.TasksDialogue} isAuthorized={isTicketCurator}>
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
          </PrivateRoute>
          <PrivateRoute
            exact
            path={UrlPathTemplate.TasksDialogueRegistration}
            component={RegistrationLandingPage}
            isAuthorized={isTicketCurator}
          />

          <PrivateRoute exact path={UrlPathTemplate.TasksNvi} isAuthorized={isNviCurator}>
            <NviCandidatesList />
          </PrivateRoute>
          <PrivateRoute exact path={UrlPathTemplate.TasksNviStatus} isAuthorized={isNviCurator}>
            <NviStatusPage />
          </PrivateRoute>
          <PrivateRoute exact path={UrlPathTemplate.TasksNviCandidate} isAuthorized={isNviCurator}>
            <NviCandidatePage />
          </PrivateRoute>
          <PrivateRoute exact path={UrlPathTemplate.TasksNviCorrectionList} isAuthorized={isNviCurator}>
            <NviCorrectionList />
          </PrivateRoute>
        </Switch>
      </ErrorBoundary>
    </StyledPageWithSideMenu>
  );
};

export default TasksPage;
