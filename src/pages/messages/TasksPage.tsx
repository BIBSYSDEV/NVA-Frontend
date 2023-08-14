import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Box, Button, CircularProgress, Divider, FormControlLabel, FormLabel, Typography, styled } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Switch, useHistory } from 'react-router-dom';
import { RoleApiPath } from '../../api/apiPaths';
import { fetchTickets } from '../../api/searchApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { LinkButton, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { SelectableButton } from '../../components/SelectableButton';
import { SideMenu, StyledMinimizedMenuButton } from '../../components/SideMenu';
import { StyledStatusCheckbox, StyledTicketSearchFormGroup } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { Organization } from '../../types/organization.types';
import { TicketStatus } from '../../types/publication_types/ticket.types';
import { InstitutionUser } from '../../types/user.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { PrivateRoute } from '../../utils/routes/Routes';
import { getLanguageString } from '../../utils/translation-helpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { RegistrationLandingPage } from '../public_registration/RegistrationLandingPage';
import { TicketList } from './components/TicketList';

type SelectedStatusState = {
  [key in TicketStatus]: boolean;
};

type SearchMode = 'current-user' | 'all';

const StyledSearchModeButton = styled(LinkButton)({
  borderRadius: '1.5rem',
  textTransform: 'none',
});

const TasksPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const user = useSelector((store: RootState) => store.user);
  const isCurator = !!user?.customerId && !!user?.isCurator;
  const nvaUsername = user?.nvaUsername ?? '';

  const [page, setPage] = useState(1);
  const apiPage = page - 1;
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const [searchMode, setSearchMode] = useState<SearchMode>('all');

  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState({
    doiRequest: true,
    generalSupportCase: true,
    publishingRequest: true,
  });

  const [selectedStatuses, setSelectedStatuses] = useState<SelectedStatusState>({
    New: true,
    Pending: false,
    Completed: false,
    Closed: false,
  });

  const [institutionUser] = useFetch<InstitutionUser>({
    url: nvaUsername ? `${RoleApiPath.Users}/${nvaUsername}` : '',
    errorMessage: t('feedback.error.get_roles'),
    withAuthentication: true,
  });

  const viewingScopes = institutionUser?.viewingScope?.includedUnits ?? [];
  const viewingScopeId = viewingScopes.length > 0 ? viewingScopes[0] : '';
  const [viewingScopeOrganization, isLoadingViewingScopeOrganization] = useFetchResource<Organization>(viewingScopeId);

  const selectedTypesArray = Object.entries(selectedTypes)
    .filter(([_, selected]) => selected)
    .map(([key]) => key);

  const typeQuery =
    selectedTypesArray.length > 0 ? `(${selectedTypesArray.map((type) => 'type:' + type).join(' OR ')})` : '';

  const selectedStatusesArray = Object.entries(selectedStatuses)
    .filter(([_, selected]) => selected)
    .map(([key]) => key);

  const statusQuery =
    selectedStatusesArray.length > 0
      ? `(${selectedStatusesArray.map((status) => 'status:' + status).join(' OR ')})`
      : '';

  const assigneeQuery = searchMode === 'current-user' && nvaUsername ? `(assignee.username:"${nvaUsername}")` : '';

  const viewedByQuery = filterUnreadOnly && user ? `(NOT(viewedBy.username:"${user.nvaUsername}"))` : '';

  const query = [typeQuery, statusQuery, assigneeQuery, viewedByQuery].filter(Boolean).join(' AND ');

  const ticketsQuery = useQuery({
    queryKey: ['tickets', rowsPerPage, apiPage, query],
    queryFn: () => fetchTickets(rowsPerPage, apiPage * rowsPerPage, query),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_messages'), variant: 'error' })),
  });

  const typeBuckets = ticketsQuery.data?.aggregations?.type.buckets ?? [];
  const doiRequestCount = typeBuckets.find((bucket) => bucket.key === 'DoiRequest')?.docCount;
  const publishingRequestCount = typeBuckets.find((bucket) => bucket.key === 'PublishingRequest')?.docCount;
  const generalSupportCaseCount = typeBuckets.find((bucket) => bucket.key === 'GeneralSupportCase')?.docCount;

  const statusBuckets = ticketsQuery.data?.aggregations?.status.buckets ?? [];
  const newCount = statusBuckets.find((bucket) => bucket.key === 'New')?.docCount;
  const pendingCount = statusBuckets.find((bucket) => bucket.key === 'Pending')?.docCount;
  const completedCount = statusBuckets.find((bucket) => bucket.key === 'Completed')?.docCount;
  const closedCount = statusBuckets.find((bucket) => bucket.key === 'Closed')?.docCount;

  const expandMenu = history.location.pathname === UrlPathTemplate.Tasks;

  return (
    <StyledPageWithSideMenu>
      <SideMenu
        expanded={expandMenu}
        minimizedMenu={
          <Link to={UrlPathTemplate.Tasks} onClick={() => ticketsQuery.refetch()}>
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
        <Divider />
        <NavigationListAccordion
          title={t('tasks.user_dialog')}
          startIcon={<AssignmentIcon sx={{ bgcolor: 'white', padding: '0.1rem' }} fontSize="small" />}
          accordionPath={UrlPathTemplate.Tasks}
          defaultPath={UrlPathTemplate.Tasks}
          dataTestId={dataTestId.tasksPage.userDialogAccordion}>
          <StyledTicketSearchFormGroup>
            <Button
              data-testid={dataTestId.tasksPage.unreadSearchCheckbox}
              sx={{ width: 'fit-content', background: filterUnreadOnly ? undefined : 'white', textTransform: 'none' }}
              variant={filterUnreadOnly ? 'contained' : 'outlined'}
              startIcon={<MarkEmailUnreadIcon />}
              onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}>
              {t('tasks.unread')}
            </Button>
          </StyledTicketSearchFormGroup>

          <StyledTicketSearchFormGroup sx={{ gap: '0.5rem' }}>
            <SelectableButton
              data-testid={dataTestId.tasksPage.typeSearch.publishingButton}
              showCheckbox
              isSelected={selectedTypes.publishingRequest}
              color="publishingRequest"
              onClick={() =>
                setSelectedTypes({ ...selectedTypes, publishingRequest: !selectedTypes.publishingRequest })
              }>
              {selectedTypes.publishingRequest && publishingRequestCount
                ? `${t('my_page.messages.types.PublishingRequest')} (${publishingRequestCount})`
                : t('my_page.messages.types.PublishingRequest')}
            </SelectableButton>

            <SelectableButton
              data-testid={dataTestId.tasksPage.typeSearch.doiButton}
              showCheckbox
              isSelected={selectedTypes.doiRequest}
              color="doiRequest"
              onClick={() => setSelectedTypes({ ...selectedTypes, doiRequest: !selectedTypes.doiRequest })}>
              {selectedTypes.doiRequest && doiRequestCount
                ? `${t('my_page.messages.types.DoiRequest')} (${doiRequestCount})`
                : t('my_page.messages.types.DoiRequest')}
            </SelectableButton>

            <SelectableButton
              data-testid={dataTestId.tasksPage.typeSearch.supportButton}
              showCheckbox
              isSelected={selectedTypes.generalSupportCase}
              color="generalSupportCase"
              onClick={() =>
                setSelectedTypes({ ...selectedTypes, generalSupportCase: !selectedTypes.generalSupportCase })
              }>
              {selectedTypes.generalSupportCase && generalSupportCaseCount
                ? `${t('my_page.messages.types.GeneralSupportCase')} (${generalSupportCaseCount})`
                : t('my_page.messages.types.GeneralSupportCase')}
            </SelectableButton>
          </StyledTicketSearchFormGroup>

          <StyledTicketSearchFormGroup sx={{ gap: '0.5rem' }}>
            <StyledSearchModeButton
              data-testid={dataTestId.tasksPage.searchMode.myUserDialogsButton}
              isSelected={searchMode === 'current-user'}
              startIcon={searchMode === 'current-user' ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
              onClick={() => {
                if (selectedStatuses.New) {
                  setSelectedStatuses({ ...selectedStatuses, New: false });
                }
                setSearchMode('current-user');
              }}>
              {t('tasks.my_user_dialogs')}
            </StyledSearchModeButton>
            <StyledSearchModeButton
              data-testid={dataTestId.tasksPage.searchMode.allUserDialogsButton}
              isSelected={searchMode === 'all'}
              startIcon={searchMode === 'all' ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
              onClick={() => setSearchMode('all')}>
              {t('tasks.all_user_dialogs')}
            </StyledSearchModeButton>
          </StyledTicketSearchFormGroup>

          <StyledTicketSearchFormGroup>
            <FormLabel component="legend" sx={{ fontWeight: 700 }}>
              {t('tasks.status')}
            </FormLabel>
            <FormControlLabel
              data-testid={dataTestId.tasksPage.statusSearch.newCheckbox}
              disabled={searchMode === 'current-user'}
              checked={selectedStatuses.New}
              control={
                <StyledStatusCheckbox
                  onChange={() => setSelectedStatuses({ ...selectedStatuses, New: !selectedStatuses.New })}
                />
              }
              label={
                selectedStatuses.New && newCount
                  ? `${t('my_page.messages.ticket_types.New')} (${newCount})`
                  : t('my_page.messages.ticket_types.New')
              }
            />
            <FormControlLabel
              data-testid={dataTestId.tasksPage.statusSearch.pendingCheckbox}
              checked={selectedStatuses.Pending}
              control={
                <StyledStatusCheckbox
                  onChange={() => setSelectedStatuses({ ...selectedStatuses, Pending: !selectedStatuses.Pending })}
                />
              }
              label={
                selectedStatuses.Pending && pendingCount
                  ? `${t('my_page.messages.ticket_types.Pending')} (${pendingCount})`
                  : t('my_page.messages.ticket_types.Pending')
              }
            />
            <FormControlLabel
              data-testid={dataTestId.tasksPage.statusSearch.completedCheckbox}
              checked={selectedStatuses.Completed}
              control={
                <StyledStatusCheckbox
                  onChange={() => setSelectedStatuses({ ...selectedStatuses, Completed: !selectedStatuses.Completed })}
                />
              }
              label={
                selectedStatuses.Completed && completedCount
                  ? `${t('my_page.messages.ticket_types.Completed')} (${completedCount})`
                  : t('my_page.messages.ticket_types.Completed')
              }
            />
            <FormControlLabel
              data-testid={dataTestId.tasksPage.statusSearch.closedCheckbox}
              checked={selectedStatuses.Closed}
              control={
                <StyledStatusCheckbox
                  onChange={() => setSelectedStatuses({ ...selectedStatuses, Closed: !selectedStatuses.Closed })}
                />
              }
              label={
                selectedStatuses.Closed && closedCount
                  ? `${t('my_page.messages.ticket_types.Closed')} (${closedCount})`
                  : t('my_page.messages.ticket_types.Closed')
              }
            />
          </StyledTicketSearchFormGroup>
        </NavigationListAccordion>
      </SideMenu>

      <ErrorBoundary>
        <Switch>
          <PrivateRoute exact path={UrlPathTemplate.Tasks} isAuthorized={isCurator}>
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
            path={UrlPathTemplate.TasksRegistration}
            component={RegistrationLandingPage}
            isAuthorized={isCurator}
          />
        </Switch>
      </ErrorBoundary>
    </StyledPageWithSideMenu>
  );
};

export default TasksPage;
