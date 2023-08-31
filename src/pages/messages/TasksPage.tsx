import AdjustIcon from '@mui/icons-material/Adjust';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Box, Button, CircularProgress, FormControlLabel, FormLabel, Typography, styled } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Redirect, Switch, useLocation } from 'react-router-dom';
import { RoleApiPath } from '../../api/apiPaths';
import { fetchNviCandidates, fetchTickets } from '../../api/searchApi';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { LinkButton, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { SelectableButton } from '../../components/SelectableButton';
import { SideMenu, StyledMinimizedMenuButton } from '../../components/SideMenu';
import { StyledStatusCheckbox, StyledTicketSearchFormGroup } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { NviCandidateStatus } from '../../types/nvi.types';
import { Organization } from '../../types/organization.types';
import { TicketStatus } from '../../types/publication_types/ticket.types';
import { InstitutionUser } from '../../types/user.types';
import { LocalStorageKey, ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { PrivateRoute } from '../../utils/routes/Routes';
import { getLanguageString } from '../../utils/translation-helpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { RegistrationLandingPage } from '../public_registration/RegistrationLandingPage';
import { NviCandidatesList } from './components/NviCandidatesList';
import { TicketList } from './components/TicketList';

type TicketStatusFilter = {
  [key in TicketStatus]: boolean;
};

type TicketSearchMode = 'current-user' | 'all';

type NviStatusFilter = {
  [key in NviCandidateStatus]: boolean;
};

const StyledSearchModeButton = styled(LinkButton)({
  borderRadius: '1.5rem',
  textTransform: 'none',
});

const TasksPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);
  const isCurator = !!user?.isCurator;
  const isNviCurator = !!user?.isNviCurator;
  const nvaUsername = user?.nvaUsername ?? '';

  const isOnTicketsPage = location.pathname === UrlPathTemplate.TasksDialogue;
  const isOnNviCandidatesPage = location.pathname === UrlPathTemplate.TasksNvi;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const [institutionUser] = useFetch<InstitutionUser>({
    url: nvaUsername ? `${RoleApiPath.Users}/${nvaUsername}` : '',
    errorMessage: t('feedback.error.get_roles'),
    withAuthentication: true,
  });

  const viewingScopes = institutionUser?.viewingScope?.includedUnits ?? [];
  const viewingScopeId = viewingScopes.length > 0 ? viewingScopes[0] : '';
  const [viewingScopeOrganization, isLoadingViewingScopeOrganization] = useFetchResource<Organization>(viewingScopeId);

  // Tickets/dialogue data
  const [ticketSearchMode, setTicketSearchMode] = useState<TicketSearchMode>('all');

  const [ticketUnreadFilter, setTicketUnreadFilter] = useState(false);

  const [ticketTypes, setTicketTypes] = useState({
    doiRequest: true,
    generalSupportCase: true,
    publishingRequest: true,
  });

  const [ticketStatusFilter, setTicketStatusFilter] = useState<TicketStatusFilter>({
    New: true,
    Pending: false,
    Completed: false,
    Closed: false,
  });

  const selectedTicketTypes = Object.entries(ticketTypes)
    .filter(([_, selected]) => selected)
    .map(([key]) => key);

  const ticketTypeQuery =
    selectedTicketTypes.length > 0 ? `(${selectedTicketTypes.map((type) => 'type:' + type).join(' OR ')})` : '';

  const selectedTicketStatuses = Object.entries(ticketStatusFilter)
    .filter(([_, selected]) => selected)
    .map(([key]) => key);

  const ticketStatusQuery =
    selectedTicketStatuses.length > 0
      ? `(${selectedTicketStatuses.map((status) => 'status:' + status).join(' OR ')})`
      : '';

  const ticketAssigneeQuery =
    ticketSearchMode === 'current-user' && nvaUsername ? `(assignee.username:"${nvaUsername}")` : '';

  const ticketViewedByQuery = ticketUnreadFilter && user ? `(NOT(viewedBy.username:"${user.nvaUsername}"))` : '';

  const ticketQueryString = [ticketTypeQuery, ticketStatusQuery, ticketAssigneeQuery, ticketViewedByQuery]
    .filter(Boolean)
    .join(' AND ');

  const ticketsQuery = useQuery({
    enabled: isOnTicketsPage,
    queryKey: ['tickets', rowsPerPage, page, ticketQueryString],
    queryFn: () => fetchTickets(rowsPerPage, (page - 1) * rowsPerPage, ticketQueryString),
    meta: { errorMessage: t('feedback.error.get_messages') },
  });

  const ticketTypeBuckets = ticketsQuery.data?.aggregations?.type.buckets ?? [];
  const doiRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'DoiRequest')?.docCount;
  const publishingRequestCount = ticketTypeBuckets.find((bucket) => bucket.key === 'PublishingRequest')?.docCount;
  const generalSupportCaseCount = ticketTypeBuckets.find((bucket) => bucket.key === 'GeneralSupportCase')?.docCount;

  const ticketStatusBuckets = ticketsQuery.data?.aggregations?.status.buckets ?? [];
  const ticketNewCount = ticketStatusBuckets.find((bucket) => bucket.key === 'New')?.docCount;
  const ticketPendingCount = ticketStatusBuckets.find((bucket) => bucket.key === 'Pending')?.docCount;
  const ticketCompletedCount = ticketStatusBuckets.find((bucket) => bucket.key === 'Completed')?.docCount;
  const ticketClosedCount = ticketStatusBuckets.find((bucket) => bucket.key === 'Closed')?.docCount;

  // NVI data
  const [nviStatusFilter, setNviStatusFilter] = useState<NviStatusFilter>({
    Pending: true,
    Approved: false,
    Rejected: false,
  });

  const selectedNviStatuses = Object.entries(nviStatusFilter)
    .filter(([, selected]) => selected)
    .map(([status]) => status);

  const nviStatusQuery =
    selectedNviStatuses.length > 0
      ? `(${selectedNviStatuses.map((status) => `approvals.approvalStatus:${status}`).join(' OR ')})`
      : '';

  const nviCandidatesQuery = useQuery({
    enabled: isOnNviCandidatesPage,
    queryKey: ['nviCandidates', rowsPerPage, page, nviStatusQuery],
    queryFn: () => fetchNviCandidates(rowsPerPage, (page - 1) * rowsPerPage, nviStatusQuery),
    meta: { errorMessage: t('feedback.error.get_nvi_candidates') },
  });

  const nviPendingCount = '';
  const nviApprovedCount = '';
  const nviRejectedCount = '';

  return (
    <StyledPageWithSideMenu>
      <SideMenu
        expanded={isOnTicketsPage || isOnNviCandidatesPage}
        minimizedMenu={
          <Link to={UrlPathTemplate.TasksDialogue} onClick={() => ticketsQuery.refetch()}>
            <StyledMinimizedMenuButton title={t('common.tasks')}>
              <AssignmentIcon />
            </StyledMinimizedMenuButton>
          </Link>
        }>
        <SideNavHeader icon={AssignmentIcon} text={t('common.tasks')} />
        <Box component="article" sx={{ m: '1rem' }}>
          {viewingScopeId ? (
            isLoadingViewingScopeOrganization ? (
              <CircularProgress aria-label={t('common.tasks')} />
            ) : (
              viewingScopeOrganization && (
                <Typography sx={{ fontWeight: 700 }}>
                  {t('tasks.limited_to', {
                    name: getLanguageString(viewingScopeOrganization.labels),
                  })}
                </Typography>
              )
            )
          ) : null}
        </Box>

        <NavigationListAccordion
          title={t('tasks.user_dialog')}
          startIcon={<AssignmentIcon sx={{ bgcolor: 'white', padding: '0.1rem' }} />}
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
            <SelectableButton
              data-testid={dataTestId.tasksPage.typeSearch.publishingButton}
              showCheckbox
              isSelected={ticketTypes.publishingRequest}
              color="publishingRequest"
              onClick={() => setTicketTypes({ ...ticketTypes, publishingRequest: !ticketTypes.publishingRequest })}>
              {ticketTypes.publishingRequest && publishingRequestCount
                ? `${t('my_page.messages.types.PublishingRequest')} (${publishingRequestCount})`
                : t('my_page.messages.types.PublishingRequest')}
            </SelectableButton>

            <SelectableButton
              data-testid={dataTestId.tasksPage.typeSearch.doiButton}
              showCheckbox
              isSelected={ticketTypes.doiRequest}
              color="doiRequest"
              onClick={() => setTicketTypes({ ...ticketTypes, doiRequest: !ticketTypes.doiRequest })}>
              {ticketTypes.doiRequest && doiRequestCount
                ? `${t('my_page.messages.types.DoiRequest')} (${doiRequestCount})`
                : t('my_page.messages.types.DoiRequest')}
            </SelectableButton>

            <SelectableButton
              data-testid={dataTestId.tasksPage.typeSearch.supportButton}
              showCheckbox
              isSelected={ticketTypes.generalSupportCase}
              color="generalSupportCase"
              onClick={() => setTicketTypes({ ...ticketTypes, generalSupportCase: !ticketTypes.generalSupportCase })}>
              {ticketTypes.generalSupportCase && generalSupportCaseCount
                ? `${t('my_page.messages.types.GeneralSupportCase')} (${generalSupportCaseCount})`
                : t('my_page.messages.types.GeneralSupportCase')}
            </SelectableButton>
          </StyledTicketSearchFormGroup>

          <StyledTicketSearchFormGroup sx={{ gap: '0.5rem' }}>
            <StyledSearchModeButton
              data-testid={dataTestId.tasksPage.searchMode.myUserDialogsButton}
              isSelected={ticketSearchMode === 'current-user'}
              startIcon={
                ticketSearchMode === 'current-user' ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />
              }
              onClick={() => {
                if (ticketStatusFilter.New) {
                  setTicketStatusFilter({ ...ticketStatusFilter, New: false });
                }
                setTicketSearchMode('current-user');
              }}>
              {t('tasks.my_user_dialogs')}
            </StyledSearchModeButton>
            <StyledSearchModeButton
              data-testid={dataTestId.tasksPage.searchMode.allUserDialogsButton}
              isSelected={ticketSearchMode === 'all'}
              startIcon={ticketSearchMode === 'all' ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
              onClick={() => setTicketSearchMode('all')}>
              {t('tasks.all_user_dialogs')}
            </StyledSearchModeButton>
          </StyledTicketSearchFormGroup>

          <StyledTicketSearchFormGroup>
            <FormLabel component="legend" sx={{ fontWeight: 700 }}>
              {t('tasks.status')}
            </FormLabel>
            <FormControlLabel
              data-testid={dataTestId.tasksPage.statusSearch.newCheckbox}
              disabled={ticketSearchMode === 'current-user'}
              checked={ticketStatusFilter.New}
              control={
                <StyledStatusCheckbox
                  onChange={() => setTicketStatusFilter({ ...ticketStatusFilter, New: !ticketStatusFilter.New })}
                />
              }
              label={
                ticketStatusFilter.New && ticketNewCount
                  ? `${t('my_page.messages.ticket_types.New')} (${ticketNewCount})`
                  : t('my_page.messages.ticket_types.New')
              }
            />
            <FormControlLabel
              data-testid={dataTestId.tasksPage.statusSearch.pendingCheckbox}
              checked={ticketStatusFilter.Pending}
              control={
                <StyledStatusCheckbox
                  onChange={() =>
                    setTicketStatusFilter({ ...ticketStatusFilter, Pending: !ticketStatusFilter.Pending })
                  }
                />
              }
              label={
                ticketStatusFilter.Pending && ticketPendingCount
                  ? `${t('my_page.messages.ticket_types.Pending')} (${ticketPendingCount})`
                  : t('my_page.messages.ticket_types.Pending')
              }
            />
            <FormControlLabel
              data-testid={dataTestId.tasksPage.statusSearch.completedCheckbox}
              checked={ticketStatusFilter.Completed}
              control={
                <StyledStatusCheckbox
                  onChange={() =>
                    setTicketStatusFilter({ ...ticketStatusFilter, Completed: !ticketStatusFilter.Completed })
                  }
                />
              }
              label={
                ticketStatusFilter.Completed && ticketCompletedCount
                  ? `${t('my_page.messages.ticket_types.Completed')} (${ticketCompletedCount})`
                  : t('my_page.messages.ticket_types.Completed')
              }
            />
            <FormControlLabel
              data-testid={dataTestId.tasksPage.statusSearch.closedCheckbox}
              checked={ticketStatusFilter.Closed}
              control={
                <StyledStatusCheckbox
                  onChange={() => setTicketStatusFilter({ ...ticketStatusFilter, Closed: !ticketStatusFilter.Closed })}
                />
              }
              label={
                ticketStatusFilter.Closed && ticketClosedCount
                  ? `${t('my_page.messages.ticket_types.Closed')} (${ticketClosedCount})`
                  : t('my_page.messages.ticket_types.Closed')
              }
            />
          </StyledTicketSearchFormGroup>
        </NavigationListAccordion>

        <BetaFunctionality>
          <NavigationListAccordion
            title={t('common.nvi')}
            startIcon={<AdjustIcon sx={{ bgcolor: 'nvi.main', padding: '0.1rem' }} />}
            accordionPath={UrlPathTemplate.TasksNvi}
            onClick={() => {
              if (!isOnNviCandidatesPage) {
                setPage(1);
              }
            }}
            dataTestId={dataTestId.tasksPage.nviAccordion}>
            <StyledTicketSearchFormGroup>
              <FormLabel component="legend" sx={{ fontWeight: 700 }}>
                {t('tasks.status')}
              </FormLabel>
              <FormControlLabel
                data-testid={dataTestId.tasksPage.nvi.statusFilter.pendingCheckbox}
                checked={nviStatusFilter.Pending}
                control={
                  <StyledStatusCheckbox
                    onChange={() => setNviStatusFilter({ ...nviStatusFilter, Pending: !nviStatusFilter.Pending })}
                  />
                }
                label={
                  nviStatusFilter.Pending && nviPendingCount
                    ? `${t('tasks.nvi.status.Pending')} (${nviPendingCount})`
                    : t('tasks.nvi.status.Pending')
                }
              />
              <FormControlLabel
                data-testid={dataTestId.tasksPage.nvi.statusFilter.approvedCheckbox}
                checked={nviStatusFilter.Approved}
                control={
                  <StyledStatusCheckbox
                    onChange={() => setNviStatusFilter({ ...nviStatusFilter, Approved: !nviStatusFilter.Approved })}
                  />
                }
                label={
                  nviStatusFilter.Approved && nviApprovedCount
                    ? `${t('tasks.nvi.status.Approved')} (${nviApprovedCount})`
                    : t('tasks.nvi.status.Approved')
                }
              />
              <FormControlLabel
                data-testid={dataTestId.tasksPage.nvi.statusFilter.rejectedCheckbox}
                checked={nviStatusFilter.Rejected}
                control={
                  <StyledStatusCheckbox
                    onChange={() => setNviStatusFilter({ ...nviStatusFilter, Rejected: !nviStatusFilter.Rejected })}
                  />
                }
                label={
                  nviStatusFilter.Rejected && nviRejectedCount
                    ? `${t('tasks.nvi.status.Rejected')} (${nviRejectedCount})`
                    : t('tasks.nvi.status.Rejected')
                }
              />
            </StyledTicketSearchFormGroup>
          </NavigationListAccordion>
        </BetaFunctionality>
      </SideMenu>

      <ErrorBoundary>
        <Switch>
          <PrivateRoute exact path={UrlPathTemplate.Tasks} isAuthorized={isCurator || isNviCurator}>
            {isCurator ? (
              <Redirect to={UrlPathTemplate.TasksDialogue} />
            ) : isNviCurator ? (
              <Redirect to={UrlPathTemplate.TasksNvi} />
            ) : null}
          </PrivateRoute>

          <PrivateRoute exact path={UrlPathTemplate.TasksDialogue} isAuthorized={isCurator}>
            <TicketList
              ticketsQuery={ticketsQuery}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              page={page}
              setPage={setPage}
              helmetTitle={t('common.tasks')}
            />
          </PrivateRoute>

          <PrivateRoute
            exact
            path={UrlPathTemplate.TasksDialogueRegistration}
            component={RegistrationLandingPage}
            isAuthorized={isCurator}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.TasksNvi}
            isAuthorized={isNviCurator && localStorage.getItem(LocalStorageKey.Beta) === 'true'}>
            <NviCandidatesList
              nviCandidatesQuery={nviCandidatesQuery}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              page={page}
              setPage={setPage}
              helmetTitle={t('common.nvi')}
            />
          </PrivateRoute>
        </Switch>
      </ErrorBoundary>
    </StyledPageWithSideMenu>
  );
};

export default TasksPage;
