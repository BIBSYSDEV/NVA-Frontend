import { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { DelayedFallback } from './components/DelayedFallback';
import {
  AppAdminRoute,
  CreatorRoute,
  CuratorRoute,
  EditorRoute,
  InstitutionAdminRoute,
  LoggedInRoute,
} from './utils/routes/Routes';
import { UrlPathTemplate } from './utils/urlPaths';

const AboutPage = lazy(() => import('./pages/infopages/AboutPage'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const EditorPage = lazy(() => import('./pages/editor/EditorPage'));
const EditRegistration = lazy(() => import('./pages/registration/new_registration/EditRegistration'));
const MyRegistrations = lazy(() => import('./pages/my_registrations/MyRegistrations'));
const PublicRegistration = lazy(() => import('./pages/public_registration/PublicRegistration'));
const MyProfilePage = lazy(() => import('./pages/user/MyProfilePage'));
const NotFound = lazy(() => import('./pages/errorpages/NotFound'));
const PrivacyPolicy = lazy(() => import('./pages/infopages/PrivacyPolicy'));
const ProjectsPage = lazy(() => import('./pages/projects/ProjectsPage'));
const PublicProfile = lazy(() => import('./pages/public_profile/PublicProfile'));
const AdminCustomerInstitutionsPage = lazy(() => import('./pages/admin/AdminCustomerInstitutionsPage'));
const MyInstitutionPage = lazy(() => import('./pages/admin/MyInstitutionPage'));
const MyInstitutionUsersPage = lazy(() => import('./pages/admin/MyInstitutionUsersPage'));
const MyMessagesPage = lazy(() => import('./pages/messages/MyMessagesPage'));
const WorklistPage = lazy(() => import('./pages/messages/WorklistPage'));
const Logout = lazy(() => import('./layout/Logout'));
const LoginPage = lazy(() => import('./layout/LoginPage'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<DelayedFallback />}>
      <Switch>
        <Route exact path={UrlPathTemplate.Home} component={Dashboard} />
        <Route exact path={UrlPathTemplate.About} component={AboutPage} />
        <Route exact path={UrlPathTemplate.PrivacyPolicy} component={PrivacyPolicy} />
        <Route exact path={UrlPathTemplate.User} component={PublicProfile} />
        <Route exact path={UrlPathTemplate.RegistrationLandingPage} component={PublicRegistration} />
        <Route exact path={UrlPathTemplate.Projects} component={ProjectsPage} />
        <Route exact path={UrlPathTemplate.Login} component={LoginPage} />
        <Route exact path={UrlPathTemplate.Logout} component={Logout} />

        {/* LoggedInRoute */}
        <LoggedInRoute exact path={UrlPathTemplate.MyProfile} component={MyProfilePage} />

        {/* CreatorRoutes */}
        <CreatorRoute exact path={UrlPathTemplate.Registration} component={EditRegistration} />
        <CreatorRoute exact path={UrlPathTemplate.MyRegistrations} component={MyRegistrations} />
        <CreatorRoute exact path={UrlPathTemplate.MyMessages} component={MyMessagesPage} />

        {/* CuratorRoutes */}
        <CuratorRoute exact path={UrlPathTemplate.Worklist} component={WorklistPage} />

        {/* InstitutionAdminRoutes */}
        <InstitutionAdminRoute exact path={UrlPathTemplate.MyInstitution} component={MyInstitutionPage} />
        <InstitutionAdminRoute exact path={UrlPathTemplate.MyInstitutionUsers} component={MyInstitutionUsersPage} />

        {/* AppAdminRoutes */}
        <AppAdminRoute exact path={UrlPathTemplate.AdminInstitutions} component={AdminCustomerInstitutionsPage} />

        {/* EditorRoutes */}
        <EditorRoute exact path={UrlPathTemplate.Editor} component={EditorPage} />

        {/* Wildcard path must be last, otherwise it will catch all routes */}
        <Route path={UrlPathTemplate.Wildcard} component={NotFound} />
      </Switch>
    </Suspense>
  );
};
