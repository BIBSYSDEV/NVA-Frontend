import { Amplify } from 'aws-amplify';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom';
import { getUserAttributes } from './api/authApi';
import { CreateCristinPersonDialog } from './components/CreateCristinPersonDialog';
import { PageSpinner } from './components/PageSpinner';
import { SelectCustomerInstitutionDialog } from './components/SelectCustomerInstitutionDialog';
import { RootState } from './redux/store';
import { setUser } from './redux/userSlice';
import { authOptions } from './utils/aws-config';
import { USE_MOCK_DATA } from './utils/constants';
import { mockUser } from './utils/testfiles/mock_feide_user';
import { UrlPathTemplate } from './utils/urlPaths';
import { Layout } from './Layout';
import { PrivateRoute } from './utils/routes/Routes';
import NotFound from './pages/errorpages/NotFound';
import { hasCuratorRole } from './utils/user-helpers';
import EditRegistration from './pages/registration/new_registration/EditRegistration';
import ProjectsPage from './pages/projects/ProjectsPage';
import LoginPage from './layout/LoginPage';
import Logout from './layout/Logout';

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

export const Root = () => {
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

  const mustCreatePerson = user && !user.cristinId;
  const mustSelectCustomer = user && user.cristinId && user.allowedCustomers.length > 1 && !user.customerId;

  const isAuthenticated = !!user;
  const hasCustomerId = isAuthenticated && !!user.customerId;
  const isCreator = hasCustomerId && user.isCreator;
  const isCurator = hasCuratorRole(user);
  const isEditor = hasCustomerId && user.isEditor;
  const isAdmin = hasCustomerId && (user.isAppAdmin || user.isInstitutionAdmin);
  const isNviCurator = !!user?.isNviCurator;

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
        <Suspense fallback={<PageSpinner aria-label={t('common.page_title')} />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path={UrlPathTemplate.Home} element={<Dashboard />} />
              <Route path={UrlPathTemplate.Search} element={<Dashboard />} />
              <Route path={UrlPathTemplate.Reports} element={<Dashboard />} />
              <Route path={UrlPathTemplate.ReportsNvi} element={<Dashboard />} />
              <Route path={UrlPathTemplate.ReportsInternationalCooperation} element={<Dashboard />} />
              <Route path={UrlPathTemplate.ReportsClinicalTreatmentStudies} element={<Dashboard />} />

              <Route path={UrlPathTemplate.PrivacyPolicy} element={<PrivacyPolicy />} />
              <Route path={UrlPathTemplate.ResearchProfile} element={<PublicResearchProfile />} />
              <Route path={UrlPathTemplate.RegistrationLandingPage} element={<PublicRegistration />} />
              <Route path={UrlPathTemplate.Projects} element={<ProjectsPage />} />
              <Route path={UrlPathTemplate.Login} element={<LoginPage />} />
              <Route path={UrlPathTemplate.Logout} element={<Logout />} />
              <Route path={UrlPathTemplate.SignedOut} element={<SignedOutPage />} />

              <Route
                path={'/my-page/*'}
                element={<PrivateRoute element={<MyPagePage />} isAuthorized={isAuthenticated} />}
              />

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
                path={'/tasks/*'}
                element={<PrivateRoute isAuthorized={isCurator || isNviCurator} element={<TasksPage />} />}
              />

              {/* BasicDataRoutes */}
              <Route
                path={'/basic-data/*'}
                element={<PrivateRoute isAuthorized={isAdmin} element={<BasicDataPage />} />}
              />

              {/* InstitutionRoutes */}
              <Route
                path={'/institution/*'}
                element={<PrivateRoute isAuthorized={hasCustomerId} element={<EditorPage />} />}
              />

              {/* Wildcard path must be last, otherwise it will catch all routes */}
              <Route path={UrlPathTemplate.Wildcard} element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
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
  const dispatch = useDispatch();
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

  const mustCreatePerson = user && !user.cristinId;
  const mustSelectCustomer = user && user.cristinId && user.allowedCustomers.length > 1 && !user.customerId;
  return (
    <Suspense fallback={<PageSpinner aria-label="Loading" />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
