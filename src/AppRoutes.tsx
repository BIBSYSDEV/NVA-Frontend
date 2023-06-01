import { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BasicDataRoute, CreatorRoute, CuratorRoute, EditorRoute, LoggedInRoute } from './utils/routes/Routes';
import { UrlPathTemplate } from './utils/urlPaths';
import { PageSpinner } from './components/PageSpinner';

const AboutPage = lazy(() => import('./pages/infopages/AboutPage'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const BasicDataPage = lazy(() => import('./pages/basic_data/BasicDataPage'));
const EditorPage = lazy(() => import('./pages/editor/EditorPage'));
const EditRegistration = lazy(() => import('./pages/registration/new_registration/EditRegistration'));
const PublicRegistration = lazy(() => import('./pages/public_registration/PublicRegistration'));
const NotFound = lazy(() => import('./pages/errorpages/NotFound'));
const PrivacyPolicy = lazy(() => import('./pages/infopages/PrivacyPolicy'));
const ProjectsPage = lazy(() => import('./pages/projects/ProjectsPage'));
const PublicResearchProfile = lazy(() => import('./pages/research_profile/PublicResearchProfile'));
const MyPagePage = lazy(() => import('./pages/my_page/MyPagePage'));
const TasksPage = lazy(() => import('./pages/messages/TasksPage'));
const Logout = lazy(() => import('./layout/Logout'));
const LoginPage = lazy(() => import('./layout/LoginPage'));

export const AppRoutes = () => {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<PageSpinner aria-label={t('common.page_title')} />}>
      <Switch>
        <Route exact path={UrlPathTemplate.Home} component={Dashboard} />
        <Route exact path={UrlPathTemplate.About} component={AboutPage} />
        <Route exact path={UrlPathTemplate.PrivacyPolicy} component={PrivacyPolicy} />
        <Route exact path={UrlPathTemplate.ResearchProfile} component={PublicResearchProfile} />
        <Route exact path={UrlPathTemplate.RegistrationLandingPage} component={PublicRegistration} />
        <Route exact path={UrlPathTemplate.Projects} component={ProjectsPage} />
        <Route exact path={UrlPathTemplate.Login} component={LoginPage} />
        <Route exact path={UrlPathTemplate.Logout} component={Logout} />

        {/* LoggedInRoute */}
        <LoggedInRoute path={UrlPathTemplate.MyPage} component={MyPagePage} />

        {/* CreatorRoutes */}
        <CreatorRoute exact path={UrlPathTemplate.RegistrationWizard} component={EditRegistration} />
        <CreatorRoute exact path={UrlPathTemplate.RegistrationNew} component={EditRegistration} />

        {/* CuratorRoutes */}
        <CuratorRoute path={UrlPathTemplate.Tasks} component={TasksPage} />

        {/* BasicDataRoutes */}
        <BasicDataRoute path={UrlPathTemplate.BasicData} component={BasicDataPage} />

        {/* EditorRoutes */}
        <EditorRoute path={UrlPathTemplate.Editor} component={EditorPage} />

        {/* Wildcard path must be last, otherwise it will catch all routes */}
        <Route path={UrlPathTemplate.Wildcard} component={NotFound} />
      </Switch>
    </Suspense>
  );
};
