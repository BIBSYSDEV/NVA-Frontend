import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import NotesIcon from '@mui/icons-material/Notes';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Badge, Button, Divider, FormControlLabel, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Redirect, Switch, useLocation } from 'react-router-dom';
import { fetchCustomerTickets, FetchTicketsParams, TicketSearchParam } from '../../api/searchApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import {
  LinkButton,
  LinkCreateButton,
  NavigationList,
  SideNavHeader,
  StyledPageWithSideMenu,
} from '../../components/PageWithSideMenu';
import { ProfilePicture } from '../../components/ProfilePicture';
import { SelectableButton } from '../../components/SelectableButton';
import { SideMenu, StyledMinimizedMenuButton } from '../../components/SideMenu';
import { StyledStatusCheckbox, StyledTicketSearchFormGroup } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { PublicationInstanceType } from '../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { getDialogueNotificationsParams } from '../../utils/searchHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { getFullName, hasCuratorRole } from '../../utils/user-helpers';
import NotFound from '../errorpages/NotFound';
import { TicketList } from '../messages/components/TicketList';
import { MyRegistrations } from '../my_registrations/MyRegistrations';
import { ProjectFormDialog } from '../projects/form/ProjectFormDialog';
import { RegistrationLandingPage } from '../public_registration/RegistrationLandingPage';
import ResearchProfile from '../research_profile/ResearchProfile';
import { MyFieldAndBackground } from './user_profile/MyFieldAndBackground';
import { MyProfile } from './user_profile/MyProfile';
import { MyProjectRegistrations } from './user_profile/MyProjectRegistrations';
import { MyProjects } from './user_profile/MyProjects';
import { MyResults } from './user_profile/MyResults';
import { UserRoleAndHelp } from './user_profile/UserRoleAndHelp';

const MyPagePage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user = useSelector((store: RootState) => store.user);
  const isAuthenticated = !!user;
  const isCreator = !!user?.customerId && (user.isCreator || hasCuratorRole(user));
  const personId = user?.cristinId ?? '';
  const fullName = user ? getFullName(user?.givenName, user?.familyName) : '';

  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const apiPage = page - 1;
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const [selectedRegistrationStatus, setSelectedRegistrationStatus] = useState({
    published: false,
    unpublished: true,
  });

  const [selectedTypes, setSelectedTypes] = useState({
    doiRequest: true,
    generalSupportCase: true,
    publishingRequest: true,
  });

  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const selectedTypesArray = Object.entries(selectedTypes)
    .filter(([_, selected]) => selected)
    .map(([key]) => key);

  const categoryShould =
    (searchParams.get(TicketSearchParam.CategoryShould)?.split(',') as PublicationInstanceType[] | null) ?? [];

  const ticketSearchParams: FetchTicketsParams = {
    query: searchParams.get(TicketSearchParam.Query),
    results: rowsPerPage,
    from: apiPage * rowsPerPage,
    owner: user?.nvaUsername,
    orderBy: searchParams.get(TicketSearchParam.OrderBy) as 'createdDate' | null,
    sortOrder: searchParams.get(TicketSearchParam.SortOrder) as 'asc' | 'desc' | null,
    status: searchParams.get(TicketSearchParam.Status),
    viewedByNot: filterUnreadOnly && user ? user.nvaUsername : '',
    type: selectedTypesArray.join(','),
    categoryShould: categoryShould.join(','),
  };

  const ticketsQuery = useQuery({
    enabled: !!user?.isCreator,
    queryKey: ['tickets', ticketSearchParams],
    queryFn: () => fetchCustomerTickets(ticketSearchParams),
    meta: { errorMessage: t('feedback.error.get_messages') },
  });

  const dialogueNotificationsParams = getDialogueNotificationsParams(user?.nvaUsername);

  const isOnDialoguePage = location.pathname === UrlPathTemplate.MyPageMyMessages;
  const notificationsQuery = useQuery({
    enabled: isOnDialoguePage && !!user?.isCreator && !!dialogueNotificationsParams.owner,
    queryKey: ['dialogueNotifications', dialogueNotificationsParams],
    queryFn: () => fetchCustomerTickets(dialogueNotificationsParams),
    meta: { errorMessage: false },
  });

  const unreadDoiCount = notificationsQuery.data?.aggregations?.type?.find(
    (bucket) => bucket.key === 'DoiRequest'
  )?.count;
  const unreadPublishingCount = notificationsQuery.data?.aggregations?.type?.find(
    (bucket) => bucket.key === 'PublishingRequest'
  )?.count;
  const unreadGeneralSupportCount = notificationsQuery.data?.aggregations?.type?.find(
    (bucket) => bucket.key === 'GeneralSupportCase'
  )?.count;

  const typeBuckets = ticketsQuery.data?.aggregations?.type ?? [];
  const doiRequestCount = typeBuckets.find((bucket) => bucket.key === 'DoiRequest')?.count;
  const publishingRequestCount = typeBuckets.find((bucket) => bucket.key === 'PublishingRequest')?.count;
  const generalSupportCaseCount = typeBuckets.find((bucket) => bucket.key === 'GeneralSupportCase')?.count;

  const currentPath = location.pathname.replace(/\/$/, ''); // Remove trailing slash
  const [showCreateProject, setShowCreateProject] = useState(false);

  // Hide menu when opening a ticket on Messages path
  const expandMenu =
    !location.pathname.startsWith(UrlPathTemplate.MyPageMyMessages) ||
    location.pathname.endsWith(UrlPathTemplate.MyPageMyMessages);

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
        <NavigationListAccordion
          title={t('my_page.research_profile')}
          startIcon={<ProfilePicture personId={personId} fullName={fullName} />}
          accordionPath={UrlPathTemplate.MyPageProfile}
          defaultPath={UrlPathTemplate.MyPageResearchProfile}
          dataTestId={dataTestId.myPage.researchProfileAccordion}>
          <NavigationList>
            <Typography>{t('my_page.public_research_profile')}</Typography>
            <LinkButton
              data-testid={dataTestId.myPage.researchProfileLink}
              isSelected={currentPath === UrlPathTemplate.MyPageResearchProfile}
              to={UrlPathTemplate.MyPageResearchProfile}>
              {fullName}
            </LinkButton>
            <Typography>{t('my_page.my_profile.edit_research_profile')}</Typography>
            <LinkButton
              data-testid={dataTestId.myPage.myProfileLink}
              isSelected={currentPath === UrlPathTemplate.MyPagePersonalia}
              to={UrlPathTemplate.MyPagePersonalia}>
              {t('my_page.my_profile.heading.personalia')}
            </LinkButton>
            <LinkButton
              data-testid={dataTestId.myPage.myFieldAndBackgroundLink}
              isSelected={currentPath === UrlPathTemplate.MyPageFieldAndBackground}
              to={UrlPathTemplate.MyPageFieldAndBackground}>
              {t('my_page.my_profile.field_and_background.field_and_background')}
            </LinkButton>
            <LinkButton
              data-testid={dataTestId.myPage.myResultsLink}
              isSelected={currentPath === UrlPathTemplate.MyPageResults}
              to={UrlPathTemplate.MyPageResults}>
              {t('my_page.my_profile.results')}
            </LinkButton>

            <LinkButton
              data-testid={dataTestId.myPage.myProjectsLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMyProjects}
              to={UrlPathTemplate.MyPageMyProjects}>
              {t('my_page.my_profile.projects')}
            </LinkButton>
            <Typography>{t('my_page.my_profile.overview_and_settings')}</Typography>
            <LinkButton
              data-testid={dataTestId.myPage.userRolesAndHelpLink}
              isSelected={currentPath === UrlPathTemplate.MyPageUserRoleAndHelp}
              to={UrlPathTemplate.MyPageUserRoleAndHelp}>
              {t('my_page.my_profile.user_role_and_help.user_role_and_help')}
            </LinkButton>
          </NavigationList>
        </NavigationListAccordion>

        {user?.isCreator && [
          <NavigationListAccordion
            key={dataTestId.myPage.messagesAccordion}
            dataTestId={dataTestId.myPage.messagesAccordion}
            title={t('common.dialogue')}
            startIcon={<ChatBubbleIcon fontSize="small" sx={{ color: 'white', bgcolor: 'primary.main' }} />}
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

            <StyledTicketSearchFormGroup sx={{ gap: '0.5rem' }}>
              <SelectableButton
                data-testid={dataTestId.tasksPage.typeSearch.publishingButton}
                endIcon={<Badge badgeContent={unreadPublishingCount} />}
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
                endIcon={<Badge badgeContent={unreadDoiCount} />}
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
                endIcon={<Badge badgeContent={unreadGeneralSupportCount} />}
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
          </NavigationListAccordion>,

          <NavigationListAccordion
            key={dataTestId.myPage.registrationsAccordion}
            title={t('common.result_registrations')}
            startIcon={<NotesIcon fontSize="small" sx={{ bgcolor: 'registration.main' }} />}
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
            startIcon={<ShowChartIcon sx={{ bgcolor: 'project.main' }} fontSize="small" />}
            accordionPath={UrlPathTemplate.MyPageProjectRegistrations}
            defaultPath={UrlPathTemplate.MyPageMyProjectRegistrations}
            dataTestId={dataTestId.myPage.projectRegistrationsAccordion}>
            <Divider sx={{ mt: '0.5rem' }} />
            <Typography sx={{ margin: '1rem' }}>
              {t('my_page.my_profile.list_contains_all_registration_you_have_created')}
            </Typography>
            <LinkCreateButton
              data-testid={dataTestId.myPage.createProjectButton}
              isSelected={showCreateProject}
              selectedColor="project.main"
              onClick={() => setShowCreateProject(true)}
              title={t('project.create_project')}
            />
          </NavigationListAccordion>,
        ]}
      </SideMenu>

      <ErrorBoundary>
        <Switch>
          <PrivateRoute exact path={UrlPathTemplate.MyPage} isAuthorized={isAuthenticated}>
            <Redirect to={UrlPathTemplate.MyPageResearchProfile} />
          </PrivateRoute>

          <PrivateRoute exact path={UrlPathTemplate.MyPageMyMessages} isAuthorized={isCreator}>
            <TicketList
              ticketsQuery={ticketsQuery}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              page={page}
              setPage={setPage}
              title={t('common.dialogue')}
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
            path={UrlPathTemplate.MyPagePersonalia}
            component={MyProfile}
            isAuthorized={isAuthenticated}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.MyPageFieldAndBackground}
            component={MyFieldAndBackground}
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
            path={UrlPathTemplate.MyPageResearchProfile}
            component={ResearchProfile}
            isAuthorized={isAuthenticated}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.MyPageResults}
            component={MyResults}
            isAuthorized={isAuthenticated}
          />
          <PrivateRoute exact path={UrlPathTemplate.MyPageMyProjectRegistrations} isAuthorized={isAuthenticated}>
            <MyProjectRegistrations />
          </PrivateRoute>
          <PrivateRoute
            exact
            path={UrlPathTemplate.MyPageUserRoleAndHelp}
            component={UserRoleAndHelp}
            isAuthorized={isAuthenticated}
          />
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
