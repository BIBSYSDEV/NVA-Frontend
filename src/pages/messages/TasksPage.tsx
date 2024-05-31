import AdjustIcon from '@mui/icons-material/Adjust';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RuleIcon from '@mui/icons-material/Rule';
import {
  Badge,
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  MenuItem,
  Link as MuiLink,
  Radio,
  Select,
  Typography,
  styled,
} from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Redirect, Switch, useHistory, useLocation } from 'react-router-dom';
import { fetchUser } from '../../api/roleApi';
import { FetchTicketsParams, TicketSearchParam, fetchCustomerTickets, fetchNviCandidates } from '../../api/searchApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { LinkButton, NavigationList, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { SelectableButton } from '../../components/SelectableButton';
import { SideMenu, StyledMinimizedMenuButton } from '../../components/SideMenu';
import { TicketListDefaultValuesWrapper } from '../../components/TicketListDefaultValuesWrapper';
import { StyledTicketSearchFormGroup } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { NviCandidateAggregations } from '../../types/nvi.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { getNviYearFilterValues } from '../../utils/nviHelpers';
import { PrivateRoute } from '../../utils/routes/Routes';
import { taskNotificationsParams } from '../../utils/searchHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { RegistrationLandingPage } from '../public_registration/RegistrationLandingPage';
import { NviCandidatePage } from './components/NviCandidatePage';
import { NviCandidatesList } from './components/NviCandidatesList';
import { NviCorrectionList } from './components/NviCorrectionList';
import { NviStatusPage } from './components/NviStatusPage';
import { OrganizationScope } from './components/OrganizationScope';
import { TicketList } from './components/TicketList';

export const StyledSearchModeButton = styled(LinkButton)({
  borderRadius: '1.5rem',
  textTransform: 'none',
});

const StyledStatusRadio = styled(Radio)({
  paddingTop: '0.05rem',
  paddingBottom: '0.05rem',
});

const StyledNviStatusBox = styled(Box)({
  padding: '0.5rem',
  borderRadius: '0.25rem',
});

const nviYearFilterValues = getNviYearFilterValues();

interface LocationState {
  previousSearch: string;
}

const TasksPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const location = useLocation<LocationState | undefined>();
  const user = useSelector((store: RootState) => store.user);
  const isSupportCurator = !!user?.isSupportCurator;
  const isDoiCurator = !!user?.isDoiCurator;
  const isPublishingCurator = !!user?.isPublishingCurator;
  const isTicketCurator = isSupportCurator || isDoiCurator || isPublishingCurator;
  const isNviCurator = !!user?.isNviCurator;
  const nvaUsername = user?.nvaUsername ?? '';

  const isOnTicketsPage = location.pathname === UrlPathTemplate.TasksDialogue;
  const isOnTicketPage = location.pathname.startsWith(UrlPathTemplate.TasksDialogue) && !isOnTicketsPage;
  const isOnNviCandidatesPage = location.pathname === UrlPathTemplate.TasksNvi;
  const isOnNviStatusPage = location.pathname === UrlPathTemplate.TasksNviStatus;
  const isOnCorrectionListPage = location.pathname === UrlPathTemplate.TasksNviCorrectionList;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const institutionUserQuery = useQuery({
    enabled: !!nvaUsername,
    queryKey: ['user', nvaUsername],
    queryFn: () => fetchUser(nvaUsername),
    meta: { errorMessage: t('feedback.error.get_person') },
  });

  const searchParams = new URLSearchParams(location.search);

  const queryParam = searchParams.get(TicketSearchParam.Query);

  const [excludeSubunits, setExcludeSubunits] = useState(false);
  const excludeSubunitsQuery = excludeSubunits ? '&excludeSubUnits=true' : '';

  const [organizationScope, setOrganizationScope] = useState(
    institutionUserQuery.data?.viewingScope.includedUnits ?? []
  );

  useEffect(() => {
    // Must populate the state after the request is done
    if (institutionUserQuery.data?.viewingScope.includedUnits) {
      setOrganizationScope(institutionUserQuery.data.viewingScope.includedUnits);
    }
  }, [institutionUserQuery.data?.viewingScope.includedUnits]);

  const [showOnlyMyTasks, setShowOnlyMyTasks] = useState(false);

  // Tickets/dialogue data
  const [ticketUnreadFilter, setTicketUnreadFilter] = useState(false);

  const [ticketTypes, setTicketTypes] = useState({
    doiRequest: isDoiCurator,
    generalSupportCase: isSupportCurator,
    publishingRequest: isPublishingCurator,
  });

  const selectedTicketTypes = Object.entries(ticketTypes)
    .filter(([_, selected]) => selected)
    .map(([key]) => key);

  const numberOfResultsGivenViewingScope = searchParams.get(TicketSearchParam.OrganizationId) ? rowsPerPage : 0;

  const ticketSearchParams: FetchTicketsParams = {
    aggregation: 'all',
    query: searchParams.get(TicketSearchParam.Query),
    results: numberOfResultsGivenViewingScope,
    from: (page - 1) * rowsPerPage,
    orderBy: searchParams.get(TicketSearchParam.OrderBy) as 'createdDate' | null,
    sortOrder: searchParams.get(TicketSearchParam.SortOrder) as 'asc' | 'desc' | null,
    organizationId: searchParams.get(TicketSearchParam.OrganizationId),
    excludeSubUnits: true,
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

  // NVI data
  const [nviStatusFilter, setNviStatusFilter] = useState<keyof NviCandidateAggregations>('pending');

  const openCandidatesView = () => {
    if (!isOnNviCandidatesPage) {
      history.push(UrlPathTemplate.TasksNvi);
    }
  };

  const [nviYearFilter, setNviYearFilter] = useState(nviYearFilterValues[1]);

  const nviSearchQuery = queryParam ? `&query=${queryParam}` : '';

  const nviAssigneeQuery = showOnlyMyTasks && nvaUsername ? `&assignee=${nvaUsername}` : '';

  const nviAggregationQuery = `year=${nviYearFilter}&affiliations=${organizationScope.join(
    ','
  )}${excludeSubunitsQuery}${nviAssigneeQuery}${nviSearchQuery}`;
  const nviListQuery = `${nviAggregationQuery}&filter=${nviStatusFilter}`;

  const nviAggregationsQuery = useQuery({
    enabled: isOnNviCandidatesPage || isOnNviStatusPage,
    queryKey: ['nviCandidates', 1, 0, nviAggregationQuery],
    queryFn: () => fetchNviCandidates(1, 0, nviAggregationQuery),
    meta: { errorMessage: t('feedback.error.get_nvi_candidates') },
  });

  const nviCandidatesQuery = useQuery({
    enabled: isOnNviCandidatesPage || isOnNviStatusPage,
    queryKey: ['nviCandidates', rowsPerPage, page, nviListQuery],
    queryFn: () => fetchNviCandidates(rowsPerPage, (page - 1) * rowsPerPage, nviListQuery),
    meta: { errorMessage: t('feedback.error.get_nvi_candidates') },
    placeholderData: keepPreviousData,
  });

  const nviAggregations = nviAggregationsQuery.data?.aggregations;

  const nviPendingCount = nviAggregations?.pending.docCount.toLocaleString();
  const nviPendingCollaborationCount = nviAggregations?.pendingCollaboration.docCount.toLocaleString();
  const nviAssignedCount = nviAggregations?.assigned.docCount.toLocaleString();
  const nviAssignedCollaborationCount = nviAggregations?.assignedCollaboration.docCount.toLocaleString();
  const nviApprovedCount = nviAggregations?.approved.docCount.toLocaleString();
  const nviApprovedCollaborationCount = nviAggregations?.approvedCollaboration.docCount.toLocaleString();
  const nviRejectedCount = nviAggregations?.rejected.docCount.toLocaleString();
  const nviRejectedCollaborationCount = nviAggregations?.rejectedCollaboration.docCount.toLocaleString();

  const nviCandidatesTotal = nviAggregations?.totalCount.docCount ?? 0;
  const nviCandidatesCompeted = nviAggregations?.completed.docCount ?? 0;
  const nviCompletedPercentage =
    nviCandidatesTotal > 0 ? Math.round((nviCandidatesCompeted / nviCandidatesTotal) * 100) : 100;

  return (
    <StyledPageWithSideMenu>
      <SideMenu
        expanded={
          isOnTicketsPage || isOnNviCandidatesPage || isOnNviStatusPage || isOnNviStatusPage || isOnCorrectionListPage
        }
        minimizedMenu={
          <Link
            to={{
              pathname: isOnTicketPage ? UrlPathTemplate.TasksDialogue : UrlPathTemplate.TasksNvi,
              search: location.state?.previousSearch,
            }}>
            <StyledMinimizedMenuButton title={t('common.tasks')}>
              <AssignmentIcon />
            </StyledMinimizedMenuButton>
          </Link>
        }>
        <SideNavHeader icon={AssignmentIcon} text={t('common.tasks')} />

        {!isOnTicketsPage && (
          <OrganizationScope
            organizationScope={organizationScope}
            setOrganizationScope={setOrganizationScope}
            excludeSubunits={excludeSubunits}
            setExcludeSubunits={setExcludeSubunits}
            hide={isOnCorrectionListPage}
          />
        )}

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
                <SelectableButton
                  data-testid={dataTestId.tasksPage.typeSearch.publishingButton}
                  endIcon={<Badge badgeContent={publishingNotificationsCount} />}
                  showCheckbox
                  isSelected={ticketTypes.publishingRequest}
                  color="publishingRequest"
                  onClick={() => setTicketTypes({ ...ticketTypes, publishingRequest: !ticketTypes.publishingRequest })}>
                  {ticketTypes.publishingRequest && publishingRequestCount
                    ? `${t('my_page.messages.types.PublishingRequest')} (${publishingRequestCount})`
                    : t('my_page.messages.types.PublishingRequest')}
                </SelectableButton>
              )}

              {isDoiCurator && (
                <SelectableButton
                  data-testid={dataTestId.tasksPage.typeSearch.doiButton}
                  endIcon={<Badge badgeContent={doiNotificationsCount} />}
                  showCheckbox
                  isSelected={ticketTypes.doiRequest}
                  color="doiRequest"
                  onClick={() => setTicketTypes({ ...ticketTypes, doiRequest: !ticketTypes.doiRequest })}>
                  {ticketTypes.doiRequest && doiRequestCount
                    ? `${t('my_page.messages.types.DoiRequest')} (${doiRequestCount})`
                    : t('my_page.messages.types.DoiRequest')}
                </SelectableButton>
              )}

              {isSupportCurator && (
                <SelectableButton
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
                </SelectableButton>
              )}
            </StyledTicketSearchFormGroup>
          </NavigationListAccordion>
        )}

        {isNviCurator && (
          <>
            <NavigationListAccordion
              title={t('common.nvi')}
              startIcon={<AdjustIcon sx={{ bgcolor: 'nvi.main' }} />}
              accordionPath={UrlPathTemplate.TasksNvi}
              onClick={() => {
                if (!isOnNviCandidatesPage) {
                  setPage(1);
                }
              }}
              dataTestId={dataTestId.tasksPage.nviAccordion}>
              <StyledTicketSearchFormGroup>
                <Select
                  size="small"
                  inputProps={{ 'aria-label': t('common.year') }}
                  value={nviYearFilter}
                  onChange={(event) => setNviYearFilter(+event.target.value)}
                  sx={{ width: 'fit-content', alignSelf: 'center', mb: '0.5rem' }}>
                  {nviYearFilterValues.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>

                <StyledTicketSearchFormGroup sx={{ gap: '0.5rem' }}>
                  <StyledSearchModeButton
                    data-testid={dataTestId.tasksPage.searchMode.myTasksButton}
                    isSelected={showOnlyMyTasks}
                    startIcon={showOnlyMyTasks ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
                    onClick={() => {
                      setShowOnlyMyTasks(true);
                      openCandidatesView();
                    }}>
                    {t('tasks.my_nvi_results')}
                  </StyledSearchModeButton>
                  <StyledSearchModeButton
                    data-testid={dataTestId.tasksPage.searchMode.allTasksButton}
                    isSelected={!showOnlyMyTasks}
                    startIcon={!showOnlyMyTasks ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
                    onClick={() => {
                      setShowOnlyMyTasks(false);
                      openCandidatesView();
                    }}>
                    {t('tasks.all_nvi_results')}
                  </StyledSearchModeButton>
                </StyledTicketSearchFormGroup>

                {nviAggregationsQuery.isSuccess && (
                  <StyledNviStatusBox sx={{ bgcolor: 'nvi.light', p: '0.5rem', mb: '1rem' }}>
                    <Typography id="progress-label" gutterBottom>
                      {t('tasks.nvi.completed_count', {
                        completed: nviCandidatesCompeted,
                        total: nviCandidatesTotal,
                      })}
                    </Typography>
                    <LinearProgress
                      aria-labelledby="progress-label"
                      variant="determinate"
                      value={nviCompletedPercentage}
                      sx={{
                        my: '0.175rem',
                        height: '0.75rem',
                        bgcolor: 'white',
                      }}
                    />
                    <Typography sx={{ textAlign: 'center' }}>{nviCompletedPercentage} %</Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '0.5rem' }}>
                      <MuiLink
                        data-testid={dataTestId.tasksPage.nvi.toggleStatusLink}
                        component={Link}
                        to={isOnNviCandidatesPage ? UrlPathTemplate.TasksNviStatus : UrlPathTemplate.TasksNvi}>
                        {isOnNviCandidatesPage
                          ? t('tasks.nvi.show_reporting_status')
                          : t('tasks.nvi.show_candidate_search')}
                      </MuiLink>
                    </Box>
                  </StyledNviStatusBox>
                )}

                <FormLabel component="legend" sx={{ fontWeight: 700 }}>
                  {t('tasks.status')}
                </FormLabel>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <StyledNviStatusBox sx={{ bgcolor: 'nvi.light' }}>
                    <FormControlLabel
                      data-testid={dataTestId.tasksPage.nvi.statusFilter.pendingRadio}
                      checked={nviStatusFilter === 'pending'}
                      onClick={openCandidatesView}
                      control={<StyledStatusRadio onChange={() => setNviStatusFilter('pending')} />}
                      slotProps={{ typography: { fontWeight: 700 } }}
                      label={
                        nviPendingCount
                          ? `${t('tasks.nvi.status.New')} (${nviPendingCount})`
                          : t('tasks.nvi.status.New')
                      }
                    />
                    <FormControlLabel
                      data-testid={dataTestId.tasksPage.nvi.statusFilter.pendingCollaborationRadio}
                      checked={nviStatusFilter === 'pendingCollaboration'}
                      onClick={openCandidatesView}
                      control={<StyledStatusRadio onChange={() => setNviStatusFilter('pendingCollaboration')} />}
                      label={
                        nviPendingCount
                          ? `${t('tasks.nvi.waiting_for_your_institution')} (${nviPendingCollaborationCount})`
                          : t('tasks.nvi.waiting_for_your_institution')
                      }
                    />
                  </StyledNviStatusBox>

                  <StyledNviStatusBox sx={{ bgcolor: 'nvi.light' }}>
                    <FormControlLabel
                      data-testid={dataTestId.tasksPage.nvi.statusFilter.assignedRadio}
                      checked={nviStatusFilter === 'assigned'}
                      onClick={openCandidatesView}
                      control={<StyledStatusRadio onChange={() => setNviStatusFilter('assigned')} />}
                      slotProps={{ typography: { fontWeight: 700 } }}
                      label={
                        nviAssignedCount
                          ? `${t('tasks.nvi.status.Pending')} (${nviAssignedCount})`
                          : t('tasks.nvi.status.Pending')
                      }
                    />
                    <FormControlLabel
                      data-testid={dataTestId.tasksPage.nvi.statusFilter.assignedCollaborationRadio}
                      checked={nviStatusFilter === 'assignedCollaboration'}
                      onClick={openCandidatesView}
                      control={<StyledStatusRadio onChange={() => setNviStatusFilter('assignedCollaboration')} />}
                      label={
                        nviAssignedCollaborationCount
                          ? `${t('tasks.nvi.waiting_for_your_institution')} (${nviAssignedCollaborationCount})`
                          : t('tasks.nvi.waiting_for_your_institution')
                      }
                    />
                  </StyledNviStatusBox>

                  <StyledNviStatusBox sx={{ bgcolor: 'secondary.main' }}>
                    <FormControlLabel
                      data-testid={dataTestId.tasksPage.nvi.statusFilter.approvedRadio}
                      checked={nviStatusFilter === 'approved'}
                      onClick={openCandidatesView}
                      control={<StyledStatusRadio onChange={() => setNviStatusFilter('approved')} />}
                      slotProps={{ typography: { fontWeight: 700 } }}
                      label={
                        nviApprovedCount
                          ? `${t('tasks.nvi.status.Approved')} (${nviApprovedCount})`
                          : t('tasks.nvi.status.Approved')
                      }
                    />
                    <FormControlLabel
                      data-testid={dataTestId.tasksPage.nvi.statusFilter.approvedCollaborationRadio}
                      checked={nviStatusFilter === 'approvedCollaboration'}
                      onClick={openCandidatesView}
                      control={<StyledStatusRadio onChange={() => setNviStatusFilter('approvedCollaboration')} />}
                      label={
                        nviApprovedCollaborationCount
                          ? `${t('tasks.nvi.waiting_for_other_institutions')} (${nviApprovedCollaborationCount})`
                          : t('tasks.nvi.waiting_for_other_institutions')
                      }
                    />
                  </StyledNviStatusBox>

                  <StyledNviStatusBox sx={{ bgcolor: 'secondary.main' }}>
                    <FormControlLabel
                      data-testid={dataTestId.tasksPage.nvi.statusFilter.rejectedRadio}
                      checked={nviStatusFilter === 'rejected'}
                      onClick={openCandidatesView}
                      control={<StyledStatusRadio onChange={() => setNviStatusFilter('rejected')} />}
                      slotProps={{ typography: { fontWeight: 700 } }}
                      label={
                        nviRejectedCount
                          ? `${t('tasks.nvi.status.Rejected')} (${nviRejectedCount})`
                          : t('tasks.nvi.status.Rejected')
                      }
                    />
                    <FormControlLabel
                      data-testid={dataTestId.tasksPage.nvi.statusFilter.rejectedCollaborationRadio}
                      checked={nviStatusFilter === 'rejectedCollaboration'}
                      onClick={openCandidatesView}
                      control={<StyledStatusRadio onChange={() => setNviStatusFilter('rejectedCollaboration')} />}
                      label={
                        nviRejectedCollaborationCount
                          ? `${t('tasks.nvi.waiting_for_other_institutions')} (${nviRejectedCollaborationCount})`
                          : t('tasks.nvi.waiting_for_other_institutions')
                      }
                    />
                  </StyledNviStatusBox>
                </Box>
              </StyledTicketSearchFormGroup>
            </NavigationListAccordion>

            <NavigationListAccordion
              title={t('tasks.correction_list')}
              startIcon={<RuleIcon sx={{ bgcolor: 'white' }} />}
              accordionPath={UrlPathTemplate.TasksNviCorrectionList}
              dataTestId={dataTestId.tasksPage.correctionList.correctionListAccordion}>
              <NavigationList>
                <StyledSearchModeButton
                  sx={{ mx: '1rem', mb: '1rem' }}
                  data-testid={dataTestId.tasksPage.correctionList.correctionListRadioButton}
                  isSelected={isOnCorrectionListPage}
                  startIcon={<RadioButtonCheckedIcon />}>
                  {t('tasks.correction_list')}
                </StyledSearchModeButton>
              </NavigationList>
            </NavigationListAccordion>
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
            <NviCandidatesList
              nviCandidatesQuery={nviCandidatesQuery}
              nviListQuery={nviListQuery}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              page={page}
              setPage={setPage}
              helmetTitle={t('common.nvi')}
            />
          </PrivateRoute>
          <PrivateRoute exact path={UrlPathTemplate.TasksNviStatus} isAuthorized={isNviCurator}>
            <NviStatusPage activeYear={nviYearFilter} />
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
