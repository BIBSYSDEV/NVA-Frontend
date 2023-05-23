import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  TablePagination,
  Typography,
  styled,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { useQuery } from '@tanstack/react-query';
import { RoleApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { ListSkeleton } from '../../components/ListSkeleton';
import { RootState } from '../../redux/store';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { Organization } from '../../types/organization.types';
import { getLanguageString } from '../../utils/translation-helpers';
import { TicketList } from './components/TicketList';
import { InstitutionUser } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';
import { StyledPageWithSideMenu, SidePanel, SideNavHeader, LinkButton } from '../../components/PageWithSideMenu';
import { setNotification } from '../../redux/notificationSlice';
import { fetchTickets } from '../../api/searchApi';
import { TicketStatus } from '../../types/publication_types/ticket.types';
import { SelectableButton } from '../../components/SelectableButton';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { UrlPathTemplate } from '../../utils/urlPaths';

const rowsPerPageOptions = [10, 20, 50];

type SelectedStatusState = {
  [key in Exclude<TicketStatus, 'New'>]: boolean;
};
const newStatus: TicketStatus = 'New';

type SearchMode = 'new' | 'current-user' | 'all';

const StyledCheckbox = styled(Checkbox)({
  paddingTop: '0.2rem',
  paddingBottom: '0.2rem',
});

const StyledFormGroup = styled(FormGroup)({
  margin: '1rem',
});

const StyledSearchTypeButton = styled(LinkButton)({
  justifyContent: 'center',
  borderRadius: '1.5rem',
});

const TasksPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user } = useSelector((store: RootState) => store);
  const nvaUsername = user?.nvaUsername ?? '';
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const [searchMode, setSearchMode] = useState<SearchMode>('new');

  const [selectedTypes, setSelectedTypes] = useState({
    doiRequest: true,
    generalSupportCase: true,
    publishingRequest: true,
  });

  const [selectedStatuses, setSelectedStatuses] = useState<SelectedStatusState>({
    Pending: true,
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
    searchMode === 'new'
      ? `(status:${newStatus})`
      : selectedStatusesArray.length > 0
      ? `(${selectedStatusesArray.map((status) => 'status:' + status).join(' OR ')})`
      : '';

  const assigneeQuery = searchMode === 'current-user' && nvaUsername ? `(assignee.username:"${nvaUsername}")` : '';

  const query = [typeQuery, statusQuery, assigneeQuery].filter(Boolean).join(' AND ');

  const ticketsQuery = useQuery({
    queryKey: ['tickets', rowsPerPage, page, query],
    queryFn: () => fetchTickets(rowsPerPage, page * rowsPerPage, query),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_messages'), variant: 'error' })),
  });

  const tickets = ticketsQuery.data?.hits ?? [];
  const typeBuckets = ticketsQuery.data?.aggregations?.type.buckets ?? [];
  const doiRequestCount = typeBuckets.find((bucket) => bucket.key === 'DoiRequest')?.docCount;
  const publishingRequestCount = typeBuckets.find((bucket) => bucket.key === 'PublishingRequest')?.docCount;
  const generalSupportCaseCount = typeBuckets.find((bucket) => bucket.key === 'GeneralSupportCase')?.docCount;

  const statusBuckets = ticketsQuery.data?.aggregations?.status.buckets ?? [];
  const pendingCount = statusBuckets.find((bucket) => bucket.key === 'Pending')?.docCount;
  const completedCount = statusBuckets.find((bucket) => bucket.key === 'Completed')?.docCount;
  const closedCount = statusBuckets.find((bucket) => bucket.key === 'Closed')?.docCount;

  return (
    <StyledPageWithSideMenu>
      <Helmet>
        <title>{t('common.tasks')}</title>
      </Helmet>
      <SidePanel>
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
          <StyledFormGroup sx={{ mt: 0, gap: '0.5rem' }}>
            <StyledSearchTypeButton isSelected={searchMode === 'new'} onClick={() => setSearchMode('new')}>
              {t('tasks.new_user_dialogs')}
            </StyledSearchTypeButton>
            <StyledSearchTypeButton
              isSelected={searchMode === 'current-user'}
              onClick={() => setSearchMode('current-user')}>
              {t('tasks.my_user_dialogs')}
            </StyledSearchTypeButton>
            <StyledSearchTypeButton isSelected={searchMode === 'all'} onClick={() => setSearchMode('all')}>
              {t('tasks.all_user_dialogs')}
            </StyledSearchTypeButton>
          </StyledFormGroup>

          <StyledFormGroup sx={{ gap: '0.5rem', width: 'fit-content' }}>
            <SelectableButton
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
              showCheckbox
              isSelected={selectedTypes.doiRequest}
              color="doiRequest"
              onClick={() => setSelectedTypes({ ...selectedTypes, doiRequest: !selectedTypes.doiRequest })}>
              {selectedTypes.doiRequest && doiRequestCount
                ? `${t('my_page.messages.types.DoiRequest')} (${doiRequestCount})`
                : t('my_page.messages.types.DoiRequest')}
            </SelectableButton>

            <SelectableButton
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
          </StyledFormGroup>

          <StyledFormGroup>
            <FormControl disabled={searchMode === 'new'}>
              <FormControlLabel
                checked={selectedStatuses.Pending}
                control={
                  <StyledCheckbox
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
                checked={selectedStatuses.Completed}
                control={
                  <StyledCheckbox
                    onChange={() =>
                      setSelectedStatuses({ ...selectedStatuses, Completed: !selectedStatuses.Completed })
                    }
                  />
                }
                label={
                  selectedStatuses.Completed && completedCount
                    ? `${t('my_page.messages.ticket_types.Completed')} (${completedCount})`
                    : t('my_page.messages.ticket_types.Completed')
                }
              />
              <FormControlLabel
                checked={selectedStatuses.Closed}
                control={
                  <StyledCheckbox
                    onChange={() => setSelectedStatuses({ ...selectedStatuses, Closed: !selectedStatuses.Closed })}
                  />
                }
                label={
                  selectedStatuses.Closed && closedCount
                    ? `${t('my_page.messages.ticket_types.Closed')} (${closedCount})`
                    : t('my_page.messages.ticket_types.Closed')
                }
              />
            </FormControl>
          </StyledFormGroup>
        </NavigationListAccordion>
      </SidePanel>

      <section>
        {ticketsQuery.isLoading ? (
          <ListSkeleton minWidth={100} maxWidth={100} height={100} />
        ) : (
          <>
            <TicketList tickets={tickets} />
            <TablePagination
              aria-live="polite"
              data-testid={dataTestId.startPage.searchPagination}
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={ticketsQuery.data?.size ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
            />
          </>
        )}
      </section>
    </StyledPageWithSideMenu>
  );
};

export default TasksPage;
