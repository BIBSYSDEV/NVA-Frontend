import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { PageSpinner } from './components/PageSpinner';
import NotFound from './pages/errorpages/NotFound';
import { RootState } from './redux/store';
import { PrivateRoute } from './utils/routes/Routes';
import { UrlPathTemplate } from './utils/urlPaths';
import { hasCuratorRole } from './utils/user-helpers';

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const BasicDataPage = lazy(() => import('./pages/basic_data/BasicDataPage'));
const EditorPage = lazy(() => import('./pages/editor/InstitutionPage'));
const EditRegistration = lazy(() => import('./pages/registration/new_registration/EditRegistration'));
const CreateProject = lazy(() => import('./pages/project/project_wizard/CreateProject'));
const EditProject = lazy(() => import('./pages/project/project_wizard/EditProject'));
const PublicRegistration = lazy(() => import('./pages/public_registration/PublicRegistration'));
const PrivacyPolicy = lazy(() => import('./pages/infopages/PrivacyPolicy'));
const ProjectsPage = lazy(() => import('./pages/projects/ProjectsPage'));
const PublicResearchProfile = lazy(() => import('./pages/research_profile/PublicResearchProfile'));
const MyPagePage = lazy(() => import('./pages/my_page/MyPagePage'));
const TasksPage = lazy(() => import('./pages/messages/TasksPage'));
const Logout = lazy(() => import('./layout/Logout'));
const LoginPage = lazy(() => import('./layout/LoginPage'));
const SignedOutPage = lazy(() => import('./pages/infopages/SignedOutPage'));

export const AppRoutes = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const isAuthenticated = !!user;
  const hasCustomerId = isAuthenticated && !!user.customerId;
  const isCreator = hasCustomerId && user.isCreator;
  const isCurator = hasCuratorRole(user);
  const isEditor = hasCustomerId && user.isEditor;
  const isAdmin = hasCustomerId && (user.isAppAdmin || user.isInstitutionAdmin);
  const isNviCurator = hasCustomerId && user.isNviCurator;

  return (
    <Suspense fallback={<PageSpinner aria-label={t('common.page_title')} />}>
      <Routes>
        <Route path={UrlPathTemplate.Root} element={<Dashboard />} />
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

        {/* LoggedInRoute */}
        <Route
          path={UrlPathTemplate.MyPage}
          element={<PrivateRoute isAuthorized={isAuthenticated} element={<MyPagePage />} />}
        />

        {/* CreatorRoutes */}
        <Route
          path={UrlPathTemplate.RegistrationWizard}
          element={<PrivateRoute isAuthorized={isCreator || isCurator || isEditor} element={<EditRegistration />} />}
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
          element={<PrivateRoute isAuthorized={isCurator || isNviCurator} element={<TasksPage />} />}
        />

        {/* BasicDataRoutes */}
        <Route
          path={UrlPathTemplate.BasicData}
          element={<PrivateRoute isAuthorized={isAdmin} element={<BasicDataPage />} />}
        />

        {/* InstitutionRoutes */}
        <Route
          path={UrlPathTemplate.Institution}
          element={<PrivateRoute isAuthorized={hasCustomerId} element={<EditorPage />} />}
        />

        {/* Wildcard path must be last, otherwise it will catch all routes */}
        <Route path={UrlPathTemplate.Wildcard} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
