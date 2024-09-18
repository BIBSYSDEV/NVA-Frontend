import { Amplify } from 'aws-amplify';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, Navigate, Route, RouterProvider, Routes } from 'react-router-dom';
import { getUserAttributes } from './api/authApi';
import { CreateCristinPersonDialog } from './components/CreateCristinPersonDialog';
import { PageSpinner } from './components/PageSpinner';
import { SelectCustomerInstitutionDialog } from './components/SelectCustomerInstitutionDialog';
import { RootState } from './redux/store';
import { setUser } from './redux/userSlice';
import { authOptions } from './utils/aws-config';
import { ROWS_PER_PAGE_OPTIONS, USE_MOCK_DATA } from './utils/constants';
import { mockUser } from './utils/testfiles/mock_feide_user';
import { UrlPathTemplate } from './utils/urlPaths';
import { Layout } from './Layout';
import { PrivateRoute } from './utils/routes/Routes';
import NotFound from './pages/errorpages/NotFound';
import { hasCuratorRole } from './utils/user-helpers';
import MyPagePage from './pages/my_page/MyPagePage';
import ResearchProfile from './pages/research_profile/ResearchProfile';
import { RegistrationLandingPage } from './pages/public_registration/RegistrationLandingPage';
import { MyRegistrations } from './pages/my_registrations/MyRegistrations';
import { TicketList } from './pages/messages/components/TicketList';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomerTickets, FetchTicketsParams, TicketSearchParam } from './api/searchApi';
import { MyProfile } from './pages/my_page/user_profile/MyProfile';
import { MyFieldAndBackground } from './pages/my_page/user_profile/MyFieldAndBackground';
import { MyProjects } from './pages/my_page/user_profile/MyProjects';
import { MyResults } from './pages/my_page/user_profile/MyResults';
import { MyProjectRegistrations } from './pages/my_page/user_profile/MyProjectRegistrations';
import { UserRoleAndHelp } from './pages/my_page/user_profile/UserRoleAndHelp';
import EditRegistration from './pages/registration/new_registration/EditRegistration';
import ProjectsPage from './pages/projects/ProjectsPage';
import LoginPage from './layout/LoginPage';
import Logout from './layout/Logout';
import { TicketListDefaultValuesWrapper } from './components/TicketListDefaultValuesWrapper';
import { NviCandidatesList } from './pages/messages/components/NviCandidatesList';
import { NviStatusPage } from './pages/messages/components/NviStatusPage';
import { NviCandidatePage } from './pages/messages/components/NviCandidatePage';
import { NviCorrectionList } from './pages/messages/components/NviCorrectionList';
import { CategoriesWithFiles } from './pages/editor/CategoriesWithFiles';
import { VocabularySettings } from './pages/editor/VocabularySettings';
import { VocabularyOverview } from './pages/editor/VocabularyOverview';
import { CategoriesWithFilesOverview } from './pages/editor/CategoriesWithFilesOverview';
import { EditorDoi } from './pages/editor/EditorDoi';
import { OrganizationOverview } from './pages/editor/OrganizationOverview';
import { OrganizationCurators } from './pages/editor/curators/OrganizationCurators';
import { InstitutionSupport } from './pages/editor/InstitutionSupport';
import { PublishStrategySettings } from './pages/editor/PublishStrategySettings';
import { PublishingStrategyOverview } from './pages/editor/PublishingStrategyOverview';
import { EditorInstitution } from './pages/editor/EditorInstitution';

const getLanguageTagValue = (language: string) => {
  if (language === 'eng') {
    return 'en';
  }
  return 'no';
};

if (
  (window.location.pathname === UrlPathTemplate.MyPagePersonalia ||
    window.location.pathname === UrlPathTemplate.MyPageResearchProfile) &&
  window.location.hash.startsWith('#access_token=')
) {
  // Workaround to allow adding orcid for aws-amplify > 4.2.2
  // Without this the user will be redirected to / for some reason
  window.location.href = window.location.href.replace('#', '?');
}

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const BasicDataPage = lazy(() => import('./pages/basic_data/BasicDataPage'));
const EditorPage = lazy(() => import('./pages/editor/InstitutionPage'));
const CreateProject = lazy(() => import('./pages/project/project_wizard/CreateProject'));
const EditProject = lazy(() => import('./pages/project/project_wizard/EditProject'));
const PublicRegistration = lazy(() => import('./pages/public_registration/PublicRegistration'));
const PrivacyPolicy = lazy(() => import('./pages/infopages/PrivacyPolicy'));
const PublicResearchProfile = lazy(() => import('./pages/research_profile/PublicResearchProfile'));
const TasksPage = lazy(() => import('./pages/messages/TasksPage'));
const SignedOutPage = lazy(() => import('./pages/infopages/SignedOutPage'));

export const Root = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [isLoadingUserAttributes, setIsLoadingUserAttributes] = useState(true);
  const hasCustomer = !!user?.customerId;

  useEffect(() => {
    // Setup aws-amplify
    if (!USE_MOCK_DATA) {
      Amplify.configure(authOptions);
    }
  }, []);

  useEffect(() => {
    // Fetch attributes of authenticated user
    const getUser = async () => {
      const feideUser = await getUserAttributes();
      if (feideUser) {
        dispatch(setUser(feideUser));
      }
      setIsLoadingUserAttributes(false);
    };

    if (USE_MOCK_DATA) {
      setUser(mockUser);
      setIsLoadingUserAttributes(false);
    } else {
      getUser();
    }
  }, [dispatch]);

  const mustCreatePerson = user && !user.cristinId;
  const mustSelectCustomer = user && user.cristinId && user.allowedCustomers.length > 1 && !user.customerId;

  const isAuthenticated = !!user;
  const hasCustomerId = isAuthenticated && !!user.customerId;
  const isCreator = hasCustomerId && user.isCreator;
  const isCurator = hasCuratorRole(user);
  const isEditor = hasCustomerId && user.isEditor;
  const isAdmin = hasCustomerId && (user.isAppAdmin || user.isInstitutionAdmin);
  const isSupportCurator = !!user?.isSupportCurator;
  const isDoiCurator = !!user?.isDoiCurator;
  const isPublishingCurator = !!user?.isPublishingCurator;
  const isTicketCurator = isSupportCurator || isDoiCurator || isPublishingCurator;
  const isNviCurator = !!user?.isNviCurator;

  const [selectedRegistrationStatus, setSelectedRegistrationStatus] = useState({
    published: false,
    unpublished: true,
  });

  const searchParams = new URLSearchParams(location.search);

  //MY PAGE
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const apiPage = page - 1;

  const [selectedTypes, setSelectedTypes] = useState({
    doiRequest: true,
    generalSupportCase: true,
    publishingRequest: true,
  });

  const selectedTypesArray = Object.entries(selectedTypes)
    .filter(([, selected]) => selected)
    .map(([key]) => key);
  const viewedByNotParam = searchParams.get(TicketSearchParam.ViewedByNot);
  const ticketSearchParams: FetchTicketsParams = {
    aggregation: 'all',
    query: searchParams.get(TicketSearchParam.Query),
    results: rowsPerPage,
    createdDate: searchParams.get(TicketSearchParam.CreatedDate),
    from: apiPage * rowsPerPage,
    owner: user?.nvaUsername,
    orderBy: searchParams.get(TicketSearchParam.OrderBy) as 'createdDate' | null,
    sortOrder: searchParams.get(TicketSearchParam.SortOrder) as 'asc' | 'desc' | null,
    status: searchParams.get(TicketSearchParam.Status),
    viewedByNot: viewedByNotParam,
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

  //TASKS PAGE

  return (
    <>
      <Helmet defaultTitle={t('common.page_title')} titleTemplate={`%s - ${t('common.page_title')}`}>
        <html lang={getLanguageTagValue(i18n.language)} />
      </Helmet>

      {mustCreatePerson && <CreateCristinPersonDialog user={user} />}
      {mustSelectCustomer && <SelectCustomerInstitutionDialog allowedCustomerIds={user.allowedCustomers} />}

      {isLoadingUserAttributes ? (
        <PageSpinner aria-label={t('common.page_title')} />
      ) : (
        <Routes>
          <Route element={<Layout />}>
            <Route path={UrlPathTemplate.Home} element={<Dashboard />}>
              <Route index path={UrlPathTemplate.Search} element={<Dashboard />} />
              <Route index path={UrlPathTemplate.Reports} element={<Dashboard />} />
              <Route index path={UrlPathTemplate.ReportsNvi} element={<Dashboard />} />
              <Route index path={UrlPathTemplate.ReportsInternationalCooperation} element={<Dashboard />} />
              <Route index path={UrlPathTemplate.ReportsClinicalTreatmentStudies} element={<Dashboard />} />
            </Route>

            <Route path={UrlPathTemplate.PrivacyPolicy} element={<PrivacyPolicy />} />
            <Route path={UrlPathTemplate.ResearchProfile} element={<PublicResearchProfile />} />
            <Route path={UrlPathTemplate.RegistrationLandingPage} element={<PublicRegistration />} />
            <Route path={UrlPathTemplate.Projects} element={<ProjectsPage />} />
            <Route path={UrlPathTemplate.Login} element={<LoginPage />} />
            <Route path={UrlPathTemplate.Logout} element={<Logout />} />
            <Route path={UrlPathTemplate.SignedOut} element={<SignedOutPage />} />

            {/* LoggedInRoute */}
            <Route
              path={UrlPathTemplate.MyPage}
              element={<PrivateRoute isAuthorized={isAuthenticated} element={<MyPagePage />} />}>
              <>
                <Route
                  path={UrlPathTemplate.MyPage}
                  element={
                    <PrivateRoute
                      isAuthorized={isAuthenticated}
                      element={<Navigate to={UrlPathTemplate.MyPageResearchProfile} />}
                    />
                  }
                />
                <Route
                  path={UrlPathTemplate.MyPagePersonalia}
                  element={<PrivateRoute element={<MyProfile />} isAuthorized={isAuthenticated} />}
                />
                <Route
                  path={UrlPathTemplate.MyPageFieldAndBackground}
                  element={<PrivateRoute element={<MyFieldAndBackground />} isAuthorized={isAuthenticated} />}
                />
                <Route
                  path={UrlPathTemplate.MyPageMyProjects}
                  element={<PrivateRoute element={<MyProjects />} isAuthorized={isAuthenticated} />}
                />
                <Route
                  path={UrlPathTemplate.MyPageResearchProfile}
                  element={<PrivateRoute element={<ResearchProfile />} isAuthorized={isAuthenticated} />}
                />

                <Route
                  path={UrlPathTemplate.MyPageResults}
                  element={<PrivateRoute element={<MyResults />} isAuthorized={isAuthenticated} />}
                />

                <Route
                  path={UrlPathTemplate.MyPageMyProjectRegistrations}
                  element={<PrivateRoute element={<MyProjectRegistrations />} isAuthorized={isAuthenticated} />}
                />

                <Route
                  path={UrlPathTemplate.MyPageUserRoleAndHelp}
                  element={<PrivateRoute element={<UserRoleAndHelp />} isAuthorized={isAuthenticated} />}
                />

                <Route
                  path={UrlPathTemplate.MyPageMyMessages}
                  element={
                    <PrivateRoute
                      isAuthorized={isCreator}
                      element={
                        <TicketList
                          ticketsQuery={ticketsQuery}
                          rowsPerPage={rowsPerPage}
                          setRowsPerPage={setRowsPerPage}
                          page={page}
                          setPage={setPage}
                          title={t('common.dialogue')}
                        />
                      }
                    />
                  }
                />
                <Route
                  path={UrlPathTemplate.MyPageMyMessagesRegistration}
                  element={<PrivateRoute element={<RegistrationLandingPage />} isAuthorized={isCreator} />}
                />
                <Route
                  path={UrlPathTemplate.MyPageMyRegistrations}
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
                <Route
                  path={UrlPathTemplate.MyPageResearchProfile}
                  element={<PrivateRoute element={<ResearchProfile />} isAuthorized={isAuthenticated} />}
                />

                <Route
                  path={UrlPathTemplate.Wildcard}
                  element={<PrivateRoute element={<NotFound />} isAuthorized={isAuthenticated} />}
                />
              </>
            </Route>

            {/* CreatorRoutes */}
            <Route
              path={UrlPathTemplate.RegistrationWizard}
              element={
                <PrivateRoute isAuthorized={isCreator || isCurator || isEditor} element={<EditRegistration />} />
              }
            />
            <Route
              path={UrlPathTemplate.RegistrationNew}
              element={<PrivateRoute isAuthorized={isCreator} element={<EditRegistration />} />}
            />
            <Route
              path={UrlPathTemplate.ProjectsEdit}
              element={<PrivateRoute isAuthorized={isCreator} element={<EditProject />} />}
            />
            <Route
              path={UrlPathTemplate.ProjectsNew}
              element={<PrivateRoute isAuthorized={isCreator} element={<CreateProject />} />}
            />

            {/* CuratorRoutes */}
            <Route
              path={UrlPathTemplate.Tasks}
              element={<PrivateRoute isAuthorized={isCurator || isNviCurator} element={<TasksPage />} />}>
              <Route
                path={UrlPathTemplate.Tasks}
                element={
                  <PrivateRoute
                    isAuthorized={isTicketCurator || isNviCurator}
                    element={
                      isTicketCurator ? (
                        <Navigate to={UrlPathTemplate.TasksDialogue} />
                      ) : (
                        <Navigate to={UrlPathTemplate.TasksNvi} />
                      )
                    }
                  />
                }
              />

              <Route
                path={UrlPathTemplate.TasksDialogue}
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
                path={UrlPathTemplate.TasksDialogueRegistration}
                element={<PrivateRoute element={<RegistrationLandingPage />} isAuthorized={isTicketCurator} />}
              />

              <Route
                path={UrlPathTemplate.TasksNvi}
                element={<PrivateRoute element={<NviCandidatesList />} isAuthorized={isNviCurator} />}
              />

              <Route
                path={UrlPathTemplate.TasksNviStatus}
                element={<PrivateRoute element={<NviStatusPage />} isAuthorized={isNviCurator} />}
              />

              <Route
                path={UrlPathTemplate.TasksNviCandidate}
                element={<PrivateRoute element={<NviCandidatePage />} isAuthorized={isNviCurator} />}
              />

              <Route
                path={UrlPathTemplate.TasksNviCorrectionList}
                element={<PrivateRoute element={<NviCorrectionList />} isAuthorized={isNviCurator} />}
              />
            </Route>

            {/* BasicDataRoutes */}
            <Route
              path={UrlPathTemplate.BasicData}
              element={<PrivateRoute isAuthorized={isAdmin} element={<BasicDataPage />} />}
            />

            {/* InstitutionRoutes */}
            <Route
              path={UrlPathTemplate.Institution}
              element={<PrivateRoute isAuthorized={hasCustomerId} element={<EditorPage />} />}>
              <Route
                path={UrlPathTemplate.InstitutionVocabulary}
                element={<PrivateRoute element={<VocabularySettings />} isAuthorized={isEditor} />}
              />
              <Route
                path={UrlPathTemplate.InstitutionVocabularyOverview}
                element={<PrivateRoute element={<VocabularyOverview />} isAuthorized={hasCustomer} />}
              />
              <Route
                path={UrlPathTemplate.InstitutionPublishStrategy}
                element={<PrivateRoute element={<PublishStrategySettings />} isAuthorized={isEditor} />}
              />
              <Route
                path={UrlPathTemplate.InstitutionPublishStrategyOverview}
                element={<PrivateRoute element={<PublishingStrategyOverview />} isAuthorized={hasCustomer} />}
              />
              <Route
                path={UrlPathTemplate.InstitutionOverviewPage}
                element={<PrivateRoute element={<EditorInstitution />} isAuthorized={hasCustomer} />}
              />
              <Route
                path={UrlPathTemplate.InstitutionCuratorsOverview}
                element={
                  <PrivateRoute
                    element={<OrganizationCurators heading={t('editor.curators.curators')} />}
                    isAuthorized={hasCustomer}
                  />
                }
              />
              <Route
                path={UrlPathTemplate.InstitutionCurators}
                element={
                  <PrivateRoute
                    element={<OrganizationCurators heading={t('editor.curators.administer_curators')} canEditUsers />}
                    isAuthorized={isEditor}
                  />
                }
              />
              <Route
                path={UrlPathTemplate.InstitutionDoi}
                element={<PrivateRoute element={<EditorDoi />} isAuthorized={hasCustomer} />}
              />
              <Route
                path={UrlPathTemplate.InstitutionCategories}
                element={<PrivateRoute element={<CategoriesWithFiles />} isAuthorized={isEditor} />}
              />
              <Route
                path={UrlPathTemplate.InstitutionCategoriesOverview}
                element={<PrivateRoute element={<CategoriesWithFilesOverview />} isAuthorized={hasCustomer} />}
              />
              <Route
                path={UrlPathTemplate.InstitutionOrganizationOverview}
                element={<PrivateRoute element={<OrganizationOverview />} isAuthorized={hasCustomer} />}
              />
              <Route
                path={UrlPathTemplate.InstitutionSupport}
                element={<PrivateRoute element={<InstitutionSupport />} isAuthorized={isEditor} />}
              />
              <Route
                path={UrlPathTemplate.Wildcard}
                element={<PrivateRoute element={<NotFound />} isAuthorized={isEditor} />}
              />
            </Route>

            {/* Wildcard path must be last, otherwise it will catch all routes */}
            <Route path={UrlPathTemplate.Wildcard} element={<NotFound />} />
          </Route>
        </Routes>
      )}
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '*',
    element: <Root />,
  },
]);

export const App = () => {
  return (
    <Suspense fallback={<PageSpinner aria-label="Loading" />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
