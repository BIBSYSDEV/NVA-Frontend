import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
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
const CreateProject = lazy(() => import('./pages/project/new_project/CreateProject'));
const EditProject = lazy(() => import('./pages/project/new_project/EditProject'));
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
      <Switch>
        <Route
          exact
          path={[
            UrlPathTemplate.Home,
            UrlPathTemplate.Search,
            UrlPathTemplate.Reports,
            UrlPathTemplate.ReportsNvi,
            UrlPathTemplate.ReportsInternationalCooperation,
            UrlPathTemplate.ReportsClinicalTreatmentStudies,
          ]}
          component={Dashboard}
        />

        <Route exact path={UrlPathTemplate.PrivacyPolicy} component={PrivacyPolicy} />
        <Route exact path={UrlPathTemplate.ResearchProfile} component={PublicResearchProfile} />
        <Route exact path={UrlPathTemplate.RegistrationLandingPage} component={PublicRegistration} />
        <Route exact path={UrlPathTemplate.Projects} component={ProjectsPage} />
        <Route exact path={UrlPathTemplate.Login} component={LoginPage} />
        <Route exact path={UrlPathTemplate.Logout} component={Logout} />
        <Route path={UrlPathTemplate.SignedOut} component={SignedOutPage} />

        {/* LoggedInRoute */}
        <PrivateRoute path={UrlPathTemplate.MyPage} component={MyPagePage} isAuthorized={isAuthenticated} />

        {/* CreatorRoutes */}
        <PrivateRoute
          exact
          path={UrlPathTemplate.RegistrationWizard}
          component={EditRegistration}
          isAuthorized={isCreator || isCurator || isEditor}
        />
        <PrivateRoute
          exact
          path={UrlPathTemplate.RegistrationNew}
          component={EditRegistration}
          isAuthorized={isCreator}
        />
        <PrivateRoute exact path={UrlPathTemplate.ProjectsEdit} component={EditProject} isAuthorized={isCreator} />
        <PrivateRoute exact path={UrlPathTemplate.ProjectsNew} component={CreateProject} isAuthorized={isCreator} />

        {/* CuratorRoutes */}
        <PrivateRoute path={UrlPathTemplate.Tasks} component={TasksPage} isAuthorized={isCurator || isNviCurator} />

        {/* BasicDataRoutes */}
        <PrivateRoute path={UrlPathTemplate.BasicData} component={BasicDataPage} isAuthorized={isAdmin} />

        {/* InstitutionRoutes */}
        <PrivateRoute path={UrlPathTemplate.Institution} component={EditorPage} isAuthorized={hasCustomerId} />

        {/* Wildcard path must be last, otherwise it will catch all routes */}
        <Route path={UrlPathTemplate.Wildcard} component={NotFound} />
      </Switch>
    </Suspense>
  );
};
