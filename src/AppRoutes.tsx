import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
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
const MyPagePage = lazy(() => import('./pages/my_page/MyPagePage'));
const PrivacyPolicy = lazy(() => import('./pages/infopages/PrivacyPolicy'));
const PublicResearchProfile = lazy(() => import('./pages/research_profile/PublicResearchProfile'));
const TasksPage = lazy(() => import('./pages/messages/TasksPage'));
const SignedOutPage = lazy(() => import('./pages/infopages/SignedOutPage'));
const ProjectsPage = lazy(() => import('./pages/projects/ProjectsPage'));
const Logout = lazy(() => import('./layout/Logout'));
const LoginPage = lazy(() => import('./layout/LoginPage'));
const NotFound = lazy(() => import('./pages/errorpages/NotFound'));

export const AppRoutes = () => {
  const user = useSelector((store: RootState) => store.user);

  const isAuthenticated = !!user;
  const hasCustomerId = isAuthenticated && !!user.customerId;
  const isCreator = hasCustomerId && user.isCreator;
  const isCurator = hasCuratorRole(user);
  const isEditor = hasCustomerId && user.isEditor;
  const canSeeBasicData = hasCustomerId && (user.isAppAdmin || user.isInstitutionAdmin || user.isInternalImporter);
  const isNviCurator = hasCustomerId && user.isNviCurator;

  return (
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
          path={`${UrlPathTemplate.MyPage}/*`}
          element={<PrivateRoute element={<MyPagePage />} isAuthorized={isAuthenticated} />}
        />

        {/* Creator routes */}
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

        {/* Curator routes */}
        <Route
          path={`${UrlPathTemplate.Tasks}/*`}
          element={<PrivateRoute isAuthorized={isCurator || isNviCurator} element={<TasksPage />} />}
        />

        {/* Basic Data routes */}
        <Route
          path={`${UrlPathTemplate.BasicData}/*`}
          element={<PrivateRoute isAuthorized={canSeeBasicData} element={<BasicDataPage />} />}
        />

        {/* Institution routes */}
        <Route
          path={`${UrlPathTemplate.Institution}/*`}
          element={<PrivateRoute isAuthorized={hasCustomerId} element={<EditorPage />} />}
        />

        {/* Wildcard path must be last, otherwise it will catch all routes */}
        <Route path={UrlPathTemplate.Wildcard} element={<NotFound />} />
      </Route>
    </Routes>
  );
};
