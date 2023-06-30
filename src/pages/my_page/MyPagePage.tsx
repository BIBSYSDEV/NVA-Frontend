import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Switch, useHistory } from 'react-router-dom';
import { Button, Divider, FormControlLabel } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { MyProfile } from './user_profile/MyProfile';
import { MyProjects } from './user_profile/MyProjects';
import { MyResults } from './user_profile/MyResults';
import { MyProjectRegistrations } from './user_profile/MyProjectRegistrations';
import {
  LinkButton,
  LinkCreateButton,
  NavigationList,
  SideNavHeader,
  StyledPageWithSideMenu,
} from '../../components/PageWithSideMenu';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import ResearchProfile from '../research_profile/ResearchProfile';
import { ProjectFormDialog } from '../projects/form/ProjectFormDialog';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import NotFound from '../errorpages/NotFound';
import { SelectableButton } from '../../components/SelectableButton';
import { fetchTickets } from '../../api/searchApi';
import { setNotification } from '../../redux/notificationSlice';
import { TicketStatus } from '../../types/publication_types/ticket.types';
import { StyledStatusCheckbox, StyledTicketSearchFormGroup } from '../../components/styled/Wrappers';
import { TicketList, ticketsPerPageOptions } from '../messages/components/TicketList';
import { RegistrationLandingPage } from '../public_registration/RegistrationLandingPage';
import { SideMenu, StyledMinimizedMenuButton } from '../../components/SideMenu';
import { MyRegistrations } from '../my_registrations/MyRegistrations';

type SelectedStatusState = {
  [key in TicketStatus]: boolean;
};

const MyPagePage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const user = useSelector((store: RootState) => store.user);
  const isAuthenticated = !!user;
  const isCreator = !!user?.customerId && (user.isCreator || user.isCurator);

  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ticketsPerPageOptions[0]);

  const [selectedRegistrationStatus, setSelectedRegistrationStatus] = useState({
    published: false,
    unpublished: true,
  });

  const [selectedProjectStatus, setSelectedProjectStatus] = useState({
    notStarted: false,
    ongoing: true,
    concluded: false,
  });

  const [selectedTypes, setSelectedTypes] = useState({
    doiRequest: true,
    generalSupportCase: true,
    publishingRequest: true,
  });

  const [selectedStatuses, setSelectedStatuses] = useState<SelectedStatusState>({
    New: true,
    Pending: true,
    Completed: false,
    Closed: false,
  });

  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

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

  const viewedByQuery = filterUnreadOnly && user ? `(NOT(viewedBy.username:"${user.nvaUsername}"))` : '';

  const query = [typeQuery, statusQuery, viewedByQuery].filter(Boolean).join(' AND ');

  const ticketsQuery = useQuery({
    queryKey: ['tickets', rowsPerPage, page, query],
    queryFn: () => fetchTickets(rowsPerPage, page * rowsPerPage, query, true),
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

  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash
  const [showCreateProject, setShowCreateProject] = useState(false);

  useEffect(() => {
    if (currentPath === UrlPathTemplate.MyPage) {
      if (user?.isCreator) {
        history.replace(UrlPathTemplate.MyPageMyMessages);
      } else {
        history.replace(UrlPathTemplate.MyPageMyResearchProfile);
      }
    }
  }, [history, currentPath, user?.isCreator]);

  // Hide menu when opening a ticket on Messages path
  const expandMenu =
    !history.location.pathname.startsWith(UrlPathTemplate.MyPageMyMessages) ||
    history.location.pathname.endsWith(UrlPathTemplate.MyPageMyMessages);

  return (
    <StyledPageWithSideMenu>
      <SideMenu
        expanded={expandMenu}
        minimizedMenu={
          <Link to={UrlPathTemplate.MyPageMyMessages} onClick={() => ticketsQuery.refetch()}>
            <StyledMinimizedMenuButton title={t('my_page.my_page')}>
              <FavoriteBorderIcon />
            </StyledMinimizedMenuButton>
          </Link>
        }>
        <SideNavHeader icon={FavoriteBorderIcon} text={t('my_page.my_page')} />

        {user?.isCreator && [
          <NavigationListAccordion
            key={dataTestId.myPage.messagesAccordion}
            dataTestId={dataTestId.myPage.messagesAccordion}
            title={t('my_page.messages.dialogue')}
            startIcon={<ChatBubbleIcon fontSize="small" />}
            accordionPath={UrlPathTemplate.MyPageMessages}
            defaultPath={UrlPathTemplate.MyPageMyMessages}>
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

            <StyledTicketSearchFormGroup sx={{ gap: '0.5rem', width: 'fit-content', minWidth: '12rem' }}>
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

            <StyledTicketSearchFormGroup>
              <FormControlLabel
                data-testid={dataTestId.tasksPage.statusSearch.newCheckbox}
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
          </NavigationListAccordion>,

          <NavigationListAccordion
            key={dataTestId.myPage.registrationsAccordion}
            title={t('common.registrations')}
            startIcon={<AddIcon fontSize="small" />}
            accordionPath={UrlPathTemplate.MyPageRegistrations}
            defaultPath={UrlPathTemplate.MyPageMyRegistrations}
            dataTestId={dataTestId.myPage.registrationsAccordion}>
            <NavigationList>
              <StyledTicketSearchFormGroup>
                <FormControlLabel
                  data-testid={dataTestId.myPage.myRegistrationsUnpublishedCheckbox}
                  checked={selectedRegistrationStatus.unpublished}
                  control={
                    <StyledStatusCheckbox
                      onChange={() =>
                        setSelectedRegistrationStatus({
                          ...selectedRegistrationStatus,
                          unpublished: !selectedRegistrationStatus.unpublished,
                        })
                      }
                    />
                  }
                  label={t('my_page.registrations.unpublished')}
                />
                <FormControlLabel
                  data-testid={dataTestId.myPage.myRegistrationsPublishedCheckbox}
                  checked={selectedRegistrationStatus.published}
                  control={
                    <StyledStatusCheckbox
                      onChange={() =>
                        setSelectedRegistrationStatus({
                          ...selectedRegistrationStatus,
                          published: !selectedRegistrationStatus.published,
                        })
                      }
                    />
                  }
                  label={t('my_page.registrations.published')}
                />
              </StyledTicketSearchFormGroup>
            </NavigationList>
            <Divider sx={{ mt: '0.5rem' }} />
            <LinkCreateButton
              data-testid={dataTestId.myPage.newRegistrationLink}
              to={UrlPathTemplate.RegistrationNew}
              title={t('registration.new_registration')}
            />
          </NavigationListAccordion>,

          <NavigationListAccordion
            key={dataTestId.myPage.projectRegistrationsAccordion}
            title={t('my_page.project_registrations')}
            startIcon={<AddIcon sx={{ bgcolor: 'project.main' }} fontSize="small" />}
            accordionPath={UrlPathTemplate.MyPageProjectRegistrations}
            defaultPath={UrlPathTemplate.MyPageMyProjectRegistrations}
            dataTestId={dataTestId.myPage.projectRegistrationsAccordion}>
            <NavigationList>
              <StyledTicketSearchFormGroup>
                <FormControlLabel
                  data-testid={dataTestId.myPage.myProjectRegistrationsOngoingCheckbox}
                  checked={selectedProjectStatus.ongoing}
                  control={
                    <StyledStatusCheckbox
                      onChange={() =>
                        setSelectedProjectStatus({
                          ...selectedProjectStatus,
                          ongoing: !selectedProjectStatus.ongoing,
                        })
                      }
                    />
                  }
                  label={t('my_page.project_registration_status.ongoing')}
                />
                <FormControlLabel
                  data-testid={dataTestId.myPage.myProjectRegistrationsNotStartedCheckbox}
                  checked={selectedProjectStatus.notStarted}
                  control={
                    <StyledStatusCheckbox
                      onChange={() =>
                        setSelectedProjectStatus({
                          ...selectedProjectStatus,
                          notStarted: !selectedProjectStatus.notStarted,
                        })
                      }
                    />
                  }
                  label={t('my_page.project_registration_status.not_started')}
                />
                <FormControlLabel
                  data-testid={dataTestId.myPage.myProjectRegistrationsConcludedCheckbox}
                  checked={selectedProjectStatus.concluded}
                  control={
                    <StyledStatusCheckbox
                      onChange={() =>
                        setSelectedProjectStatus({
                          ...selectedProjectStatus,
                          concluded: !selectedProjectStatus.concluded,
                        })
                      }
                    />
                  }
                  label={t('my_page.project_registration_status.concluded')}
                />
              </StyledTicketSearchFormGroup>
            </NavigationList>
            <Divider sx={{ mt: '0.5rem' }} />
            <LinkCreateButton
              data-testid={dataTestId.myPage.createProjectButton}
              isSelected={showCreateProject}
              selectedColor="project.main"
              onClick={() => setShowCreateProject(true)}
              title={t('project.create_project')}
            />
          </NavigationListAccordion>,
        ]}
        <NavigationListAccordion
          title={t('my_page.research_profile')}
          startIcon={<img src={orcidIcon} height="20" alt={t('common.orcid')} />}
          accordionPath={UrlPathTemplate.MyPageResearchProfile}
          defaultPath={UrlPathTemplate.MyPageMyResearchProfile}
          dataTestId={dataTestId.myPage.researchProfileAccordion}>
          <NavigationList>
            <LinkButton
              data-testid={dataTestId.myPage.researchProfileLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMyResearchProfile}
              to={UrlPathTemplate.MyPageMyResearchProfile}>
              {t('my_page.research_profile')}
            </LinkButton>
          </NavigationList>
        </NavigationListAccordion>

        <NavigationListAccordion
          title={t('my_page.my_profile.user_profile')}
          startIcon={<PersonIcon fontSize="small" />}
          accordionPath={UrlPathTemplate.MyPageMyProfile}
          defaultPath={UrlPathTemplate.MyPageMyPersonalia}
          dataTestId={dataTestId.myPage.myProfileAccordion}>
          <NavigationList>
            <LinkButton
              data-testid={dataTestId.myPage.myProfileLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMyPersonalia}
              to={UrlPathTemplate.MyPageMyPersonalia}>
              {t('my_page.my_profile.heading.personalia')}
            </LinkButton>
            <LinkButton
              data-testid={dataTestId.myPage.myResultsLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMyResults}
              to={UrlPathTemplate.MyPageMyResults}>
              {t('my_page.my_profile.results')}
            </LinkButton>
            <LinkButton
              data-testid={dataTestId.myPage.myProjectsLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMyProjects}
              to={UrlPathTemplate.MyPageMyProjects}>
              {t('my_page.my_profile.projects')}
            </LinkButton>
          </NavigationList>
        </NavigationListAccordion>
      </SideMenu>

      <ErrorBoundary>
        <Switch>
          <PrivateRoute exact path={UrlPathTemplate.MyPageMyMessages} isAuthorized={isCreator}>
            <TicketList
              ticketsQuery={ticketsQuery}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              page={page}
              setPage={setPage}
              helmetTitle={t('my_page.messages.dialogue')}
            />
          </PrivateRoute>
          <PrivateRoute
            exact
            path={UrlPathTemplate.MyPageMyMessagesRegistration}
            component={RegistrationLandingPage}
            isAuthorized={isCreator}
          />
          <PrivateRoute exact path={UrlPathTemplate.MyPageMyRegistrations} isAuthorized={isCreator}>
            <MyRegistrations
              selectedPublished={selectedRegistrationStatus.published}
              selectedUnpublished={selectedRegistrationStatus.unpublished}
            />
          </PrivateRoute>
          <PrivateRoute
            exact
            path={UrlPathTemplate.MyPageMyPersonalia}
            component={MyProfile}
            isAuthorized={isAuthenticated}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.MyPageMyProjects}
            component={MyProjects}
            isAuthorized={isAuthenticated}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.MyPageMyResearchProfile}
            component={ResearchProfile}
            isAuthorized={isAuthenticated}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.MyPageMyResults}
            component={MyResults}
            isAuthorized={isAuthenticated}
          />
          <PrivateRoute exact path={UrlPathTemplate.MyPageMyProjectRegistrations} isAuthorized={isAuthenticated}>
            <MyProjectRegistrations
              selectedOngoing={selectedProjectStatus.ongoing}
              selectedNotStarted={selectedProjectStatus.notStarted}
              selectedConcluded={selectedProjectStatus.concluded}
            />
          </PrivateRoute>
          <PrivateRoute exact path={UrlPathTemplate.Wildcard} component={NotFound} isAuthorized={isAuthenticated} />
        </Switch>
      </ErrorBoundary>

      {user?.isCreator && (
        <ProjectFormDialog
          open={showCreateProject}
          onClose={() => setShowCreateProject(false)}
          onCreateProject={async () => {
            await new Promise((resolve) => setTimeout(resolve, 10_000));
            // Wait 10sec before refetching projects, and hope that it is indexed by then
            // TODO: consider placing the new project in the cache manually instead of a fixed waiting time
            queryClient.invalidateQueries({ queryKey: ['projects'] });
          }}
        />
      )}
    </StyledPageWithSideMenu>
  );
};

export default MyPagePage;
