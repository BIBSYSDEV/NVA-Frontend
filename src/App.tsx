import { Amplify } from 'aws-amplify';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom';
import { getUserAttributes } from './api/authApi';
import { AcceptTermsDialog } from './components/AcceptTermsDialog';
import { CreateCristinPersonDialog } from './components/CreateCristinPersonDialog';
import { PageSpinner } from './components/PageSpinner';
import { SelectCustomerInstitutionDialog } from './components/SelectCustomerInstitutionDialog';
import { Layout } from './Layout';
import LoginPage from './layout/LoginPage';
import Logout from './layout/Logout';
import { useMatomoTracking } from './matomo/useMatomoTracking';
import NotFound from './pages/errorpages/NotFound';
import ProjectsPage from './pages/projects/ProjectsPage';
import EditRegistration from './pages/registration/new_registration/EditRegistration';
import { RootState } from './redux/store';
import { setUser } from './redux/userSlice';
import { authOptions } from './utils/aws-config';
import { USE_MOCK_DATA } from './utils/constants';
import { PrivateRoute } from './utils/routes/Routes';
import { mockUser } from './utils/testfiles/mock_feide_user';
import { SplashRoutes, UrlPathTemplate } from './utils/urlPaths';
import { hasCuratorRole } from './utils/user-helpers';

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
const MyPagePage = lazy(() => import('./pages/my_page/MyPagePage'));
const PrivacyPolicy = lazy(() => import('./pages/infopages/PrivacyPolicy'));
const PublicResearchProfile = lazy(() => import('./pages/research_profile/PublicResearchProfile'));
const TasksPage = lazy(() => import('./pages/messages/TasksPage'));
const SignedOutPage = lazy(() => import('./pages/infopages/SignedOutPage'));

const Root = () => {
  useMatomoTracking();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [isLoadingUserAttributes, setIsLoadingUserAttributes] = useState(true);

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

  const mustAcceptTerms = user && user.currentTerms !== user.acceptedTerms;
  const mustCreatePerson = user && !user.cristinId;
  const mustSelectCustomer = user && user.cristinId && user.allowedCustomers.length > 1 && !user.customerId;

  const isAuthenticated = !!user;
  const hasCustomerId = isAuthenticated && !!user.customerId;
  const isCreator = hasCustomerId && user.isCreator;
  const isCurator = hasCuratorRole(user);
  const isEditor = hasCustomerId && user.isEditor;
  const canSeeBasicData = hasCustomerId && (user.isAppAdmin || user.isInstitutionAdmin || user.isInternalImporter);
  const isNviCurator = !!user?.isNviCurator;

  return (
    <>
      <Helmet defaultTitle={t('common.page_title')} titleTemplate={`%s - ${t('common.page_title')}`}>
        <html lang={getLanguageTagValue(i18n.language)} />
      </Helmet>

      {mustAcceptTerms && <AcceptTermsDialog newTermsUri={user.currentTerms} />}
      {mustCreatePerson && <CreateCristinPersonDialog user={user} />}
      {mustSelectCustomer && <SelectCustomerInstitutionDialog allowedCustomerIds={user.allowedCustomers} />}

      {isLoadingUserAttributes ? (
        <PageSpinner aria-label={t('common.page_title')} />
      ) : (
        <Routes>
          <Route element={<Layout />}>
            <Route path={UrlPathTemplate.Root} element={<Dashboard />}>
              <Route path={UrlPathTemplate.Search} element={<Dashboard />} />
              <Route path={UrlPathTemplate.Reports} element={<Dashboard />} />
              <Route path={UrlPathTemplate.ReportsNvi} element={<Dashboard />} />
              <Route path={UrlPathTemplate.ReportsInternationalCooperation} element={<Dashboard />} />
              <Route path={UrlPathTemplate.ReportsClinicalTreatmentStudies} element={<Dashboard />} />
            </Route>

            <Route path={UrlPathTemplate.PrivacyPolicy} element={<PrivacyPolicy />} />
            <Route path={UrlPathTemplate.ResearchProfile} element={<PublicResearchProfile />} />
            <Route path={UrlPathTemplate.RegistrationLandingPage} element={<PublicRegistration />} />
            <Route path={UrlPathTemplate.Projects} element={<ProjectsPage />} />
            <Route path={UrlPathTemplate.Login} element={<LoginPage />} />
            <Route path={UrlPathTemplate.Logout} element={<Logout />} />
            <Route path={UrlPathTemplate.SignedOut} element={<SignedOutPage />} />

            {/* Authenticated routes */}
            <Route
              path={SplashRoutes.MyPage}
              element={<PrivateRoute element={<MyPagePage />} isAuthorized={isAuthenticated} />}
            />

            {/* Creator routes */}
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

            {/* Curator routes */}
            <Route
              path={SplashRoutes.Tasks}
              element={<PrivateRoute isAuthorized={isCurator || isNviCurator} element={<TasksPage />} />}
            />

            {/* Basic Data routes */}
            <Route
              path={SplashRoutes.BasicData}
              element={<PrivateRoute isAuthorized={canSeeBasicData} element={<BasicDataPage />} />}
            />

            {/* Institution routes */}
            <Route
              path={SplashRoutes.Institution}
              element={<PrivateRoute isAuthorized={hasCustomerId} element={<EditorPage />} />}
            />

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
