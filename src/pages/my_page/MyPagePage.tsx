import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NotesIcon from '@mui/icons-material/Notes';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Badge, Divider, FormControlLabel, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router';
import { fetchCustomerTickets, FetchTicketsParams, TicketSearchParam } from '../../api/searchApi';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import {
  LinkCreateButton,
  NavigationList,
  SideNavHeader,
  StyledPageWithSideMenu,
} from '../../components/PageWithSideMenu';
import { ProfilePicture } from '../../components/ProfilePicture';
import { SelectableButton } from '../../components/SelectableButton';
import { MinimizedMenuIconButton, SideMenu } from '../../components/SideMenu';
import { StyledStatusCheckbox, StyledTicketSearchFormGroup } from '../../components/styled/Wrappers';
import { TicketTypeFilterButton } from '../../components/TicketTypeFilterButton';
import { RootState } from '../../redux/store';
import { PreviousSearchLocationState } from '../../types/locationState.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { getDialogueNotificationsParams, resetPaginationAndNavigate } from '../../utils/searchHelpers';
import { getSubUrl, UrlPathTemplate } from '../../utils/urlPaths';
import { getFullName, hasCuratorRole } from '../../utils/user-helpers';
import NotFound from '../errorpages/NotFound';
import { TicketList } from '../messages/components/TicketList';
import { MyRegistrations } from '../my_registrations/MyRegistrations';
import { RegistrationLandingPage } from '../public_registration/RegistrationLandingPage';
import ResearchProfile from '../research_profile/ResearchProfile';
import { MyFieldAndBackground } from './user_profile/MyFieldAndBackground';
import { MyProfile } from './user_profile/MyProfile';
import { MyProjectRegistrations } from './user_profile/MyProjectRegistrations';
import { MyProjects } from './user_profile/MyProjects';
import { MyResults } from './user_profile/MyResults';
import { Terms } from './user_profile/Terms';
import { UserRoleAndHelp } from './user_profile/UserRoleAndHelp';

const MyPagePage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state as PreviousSearchLocationState;
  const searchParams = new URLSearchParams(location.search);
  const user = useSelector((store: RootState) => store.user);
  const isAuthenticated = !!user;
  const isCreator = !!user?.customerId && (user.isCreator || hasCuratorRole(user));
  const personId = user?.cristinId ?? '';
  const fullName = user ? getFullName(user?.givenName, user?.familyName) : '';
  const navigate = useNavigate();

  const [selectedRegistrationStatus, setSelectedRegistrationStatus] = useState({
    published: false,
    unpublished: true,
  });

  const [selectedTypes, setSelectedTypes] = useState({
    doiRequest: true,
    generalSupportCase: true,
    publishingRequest: true,
  });

  const selectedTypesArray = Object.entries(selectedTypes)
    .filter(([, selected]) => selected)
    .map(([key]) => key);

  const ticketSearchParams: FetchTicketsParams = {
    aggregation: 'all',
    query: searchParams.get(TicketSearchParam.Query),
    results: Number(searchParams.get(TicketSearchParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]),
    createdDate: searchParams.get(TicketSearchParam.CreatedDate),
    from: Number(searchParams.get(TicketSearchParam.From) ?? 0),
    owner: user?.nvaUsername,
    orderBy: searchParams.get(TicketSearchParam.OrderBy) as 'createdDate' | null,
    sortOrder: searchParams.get(TicketSearchParam.SortOrder) as 'asc' | 'desc' | null,
    status: searchParams.get(TicketSearchParam.Status),
    viewedByNot: searchParams.get(TicketSearchParam.ViewedByNot),
    type: selectedTypesArray.join(','),
    publicationType: searchParams.get(TicketSearchParam.PublicationType),
  };

  const isOnDialoguePage = location.pathname === UrlPathTemplate.MyPageMyMessages;
  const ticketsQuery = useQuery({
    enabled: isOnDialoguePage && !!user?.isCreator,
    queryKey: ['tickets', ticketSearchParams],
    queryFn: () => fetchCustomerTickets(ticketSearchParams),
    meta: { errorMessage: t('feedback.error.get_messages') },
  });

  const dialogueNotificationsParams = getDialogueNotificationsParams(user?.nvaUsername);

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

  // Hide menu when opening a ticket on Messages path
  const expandMenu =
    !location.pathname.startsWith(UrlPathTemplate.MyPageMyMessages) ||
    location.pathname.endsWith(UrlPathTemplate.MyPageMyMessages);

  return (
    <StyledPageWithSideMenu>
      <SideMenu
        expanded={expandMenu}
        minimizedMenu={
          <MinimizedMenuIconButton
            title={t('my_page.my_page')}
            to={{ pathname: UrlPathTemplate.MyPageMyMessages, search: locationState?.previousSearch }}
            onClick={() => ticketsQuery.refetch()}>
            <FavoriteBorderIcon />
          </MinimizedMenuIconButton>
        }>
        <SideNavHeader icon={FavoriteBorderIcon} text={t('my_page.my_page')} />
        <NavigationListAccordion
          title={t('my_page.research_profile')}
          startIcon={<ProfilePicture personId={personId} fullName={fullName} />}
          accordionPath={UrlPathTemplate.MyPageProfile}
          defaultPath={UrlPathTemplate.MyPageResearchProfile}
          dataTestId={dataTestId.myPage.researchProfileAccordion}>
          <NavigationList aria-label={t('my_page.research_profile')}>
            <Typography>{t('my_page.public_research_profile')}</Typography>
            <SelectableButton
              data-testid={dataTestId.myPage.researchProfileLink}
              isSelected={currentPath === UrlPathTemplate.MyPageResearchProfile}
              to={UrlPathTemplate.MyPageResearchProfile}>
              {fullName}
            </SelectableButton>
            <Typography>{t('my_page.my_profile.edit_research_profile')}</Typography>
            <SelectableButton
              data-testid={dataTestId.myPage.myProfileLink}
              isSelected={currentPath === UrlPathTemplate.MyPagePersonalia}
              to={UrlPathTemplate.MyPagePersonalia}>
              {t('my_page.my_profile.heading.personalia')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.myPage.myFieldAndBackgroundLink}
              isSelected={currentPath === UrlPathTemplate.MyPageFieldAndBackground}
              to={UrlPathTemplate.MyPageFieldAndBackground}>
              {t('my_page.my_profile.field_and_background.field_and_background')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.myPage.myResultsLink}
              isSelected={currentPath === UrlPathTemplate.MyPageResults}
              to={UrlPathTemplate.MyPageResults}>
              {t('my_page.my_profile.results')}
            </SelectableButton>

            <SelectableButton
              data-testid={dataTestId.myPage.myProjectsLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMyProjects}
              to={UrlPathTemplate.MyPageMyProjects}>
              {t('my_page.my_profile.projects')}
            </SelectableButton>
            <Typography>{t('my_page.my_profile.overview_and_settings')}</Typography>
            <SelectableButton
              data-testid={dataTestId.myPage.userRolesAndHelpLink}
              isSelected={currentPath === UrlPathTemplate.MyPageUserRoleAndHelp}
              to={UrlPathTemplate.MyPageUserRoleAndHelp}>
              {t('my_page.my_profile.user_role_and_help.user_role_and_help')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.myPage.termsLink}
              isSelected={currentPath === UrlPathTemplate.MyPageTerms}
              to={UrlPathTemplate.MyPageTerms}>
              {t('common.terms')}
            </SelectableButton>
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
            <StyledTicketSearchFormGroup sx={{ gap: '0.5rem' }}>
              <TicketTypeFilterButton
                data-testid={dataTestId.tasksPage.typeSearch.publishingButton}
                endIcon={<Badge badgeContent={unreadPublishingCount} />}
                showCheckbox
                isSelected={selectedTypes.publishingRequest}
                color="publishingRequest"
                onClick={() => {
                  setSelectedTypes({ ...selectedTypes, publishingRequest: !selectedTypes.publishingRequest });
                  resetPaginationAndNavigate(searchParams, navigate);
                }}>
                {selectedTypes.publishingRequest && publishingRequestCount
                  ? `${t('my_page.messages.types.PublishingRequest')} (${publishingRequestCount})`
                  : t('my_page.messages.types.PublishingRequest')}
              </TicketTypeFilterButton>

              <TicketTypeFilterButton
                data-testid={dataTestId.tasksPage.typeSearch.doiButton}
                endIcon={<Badge badgeContent={unreadDoiCount} />}
                showCheckbox
                isSelected={selectedTypes.doiRequest}
                color="doiRequest"
                onClick={() => {
                  setSelectedTypes({ ...selectedTypes, doiRequest: !selectedTypes.doiRequest });
                  resetPaginationAndNavigate(searchParams, navigate);
                }}>
                {selectedTypes.doiRequest && doiRequestCount
                  ? `${t('my_page.messages.types.DoiRequest')} (${doiRequestCount})`
                  : t('my_page.messages.types.DoiRequest')}
              </TicketTypeFilterButton>

              <TicketTypeFilterButton
                data-testid={dataTestId.tasksPage.typeSearch.supportButton}
                endIcon={<Badge badgeContent={unreadGeneralSupportCount} />}
                showCheckbox
                isSelected={selectedTypes.generalSupportCase}
                color="generalSupportCase"
                onClick={() => {
                  setSelectedTypes({ ...selectedTypes, generalSupportCase: !selectedTypes.generalSupportCase });
                  resetPaginationAndNavigate(searchParams, navigate);
                }}>
                {selectedTypes.generalSupportCase && generalSupportCaseCount
                  ? `${t('my_page.messages.types.GeneralSupportCase')} (${generalSupportCaseCount})`
                  : t('my_page.messages.types.GeneralSupportCase')}
              </TicketTypeFilterButton>
            </StyledTicketSearchFormGroup>
          </NavigationListAccordion>,

          <NavigationListAccordion
            key={dataTestId.myPage.registrationsAccordion}
            title={t('common.result_registrations')}
            startIcon={<NotesIcon fontSize="small" sx={{ bgcolor: 'registration.main' }} />}
            accordionPath={UrlPathTemplate.MyPageRegistrations}
            defaultPath={UrlPathTemplate.MyPageMyRegistrations}
            dataTestId={dataTestId.myPage.registrationsAccordion}>
            <NavigationList component="div">
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
              to={UrlPathTemplate.ProjectsNew}
              title={t('project.create_project')}
            />
          </NavigationListAccordion>,
        ]}
      </SideMenu>

      <Outlet />

      <Routes>
        <Route
          path={UrlPathTemplate.Root}
          element={
            <PrivateRoute
              isAuthorized={isAuthenticated}
              element={<Navigate to={UrlPathTemplate.MyPageResearchProfile} replace />}
            />
          }
        />
        <Route
          path={getSubUrl(UrlPathTemplate.MyPagePersonalia, UrlPathTemplate.MyPage)}
          element={<PrivateRoute element={<MyProfile />} isAuthorized={isAuthenticated} />}
        />
        <Route
          path={getSubUrl(UrlPathTemplate.MyPageFieldAndBackground, UrlPathTemplate.MyPage)}
          element={<PrivateRoute element={<MyFieldAndBackground />} isAuthorized={isAuthenticated} />}
        />
        <Route
          path={getSubUrl(UrlPathTemplate.MyPageMyProjects, UrlPathTemplate.MyPage)}
          element={<PrivateRoute element={<MyProjects />} isAuthorized={isAuthenticated} />}
        />
        <Route
          path={getSubUrl(UrlPathTemplate.MyPageResearchProfile, UrlPathTemplate.MyPage)}
          element={<PrivateRoute element={<ResearchProfile />} isAuthorized={isAuthenticated} />}
        />

        <Route
          path={getSubUrl(UrlPathTemplate.MyPageResults, UrlPathTemplate.MyPage)}
          element={<PrivateRoute element={<MyResults />} isAuthorized={isAuthenticated} />}
        />

        <Route
          path={getSubUrl(UrlPathTemplate.MyPageMyProjectRegistrations, UrlPathTemplate.MyPage)}
          element={<PrivateRoute element={<MyProjectRegistrations />} isAuthorized={isAuthenticated} />}
        />

        <Route
          path={getSubUrl(UrlPathTemplate.MyPageUserRoleAndHelp, UrlPathTemplate.MyPage)}
          element={<PrivateRoute element={<UserRoleAndHelp />} isAuthorized={isAuthenticated} />}
        />

        <Route
          path={getSubUrl(UrlPathTemplate.MyPageTerms, UrlPathTemplate.MyPage)}
          element={<PrivateRoute element={<Terms />} isAuthorized={isAuthenticated} />}
        />

        <Route
          path={getSubUrl(UrlPathTemplate.MyPageMyMessages, UrlPathTemplate.MyPage)}
          element={
            <PrivateRoute
              isAuthorized={isCreator}
              element={<TicketList ticketsQuery={ticketsQuery} title={t('common.dialogue')} />}
            />
          }
        />
        <Route
          path={getSubUrl(UrlPathTemplate.MyPageMyMessagesRegistration, UrlPathTemplate.MyPage)}
          element={<PrivateRoute element={<RegistrationLandingPage />} isAuthorized={isCreator} />}
        />
        <Route
          path={getSubUrl(UrlPathTemplate.MyPageMyRegistrations, UrlPathTemplate.MyPage)}
          element={
            <PrivateRoute
              element={
                <MyRegistrations
                  selectedPublished={selectedRegistrationStatus.published}
                  selectedUnpublished={selectedRegistrationStatus.unpublished}
                />
              }
              isAuthorized={isCreator}
            />
          }
        />

        <Route path={getSubUrl(UrlPathTemplate.MyPage, UrlPathTemplate.MyPage, true)} element={<NotFound />} />
      </Routes>
    </StyledPageWithSideMenu>
  );
};

export default MyPagePage;
