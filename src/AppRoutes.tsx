import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { DelayedFallback } from './components/DelayedFallback';
import { AppAdminRoute, CreatorRoute, CuratorRoute, InstitutionAdminRoute, LoggedInRoute } from './utils/routes/Routes';
import { UrlPathTemplate } from './utils/urlPaths';

const AboutPage = lazy(() => import('./pages/infopages/AboutPage'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
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
const MyMessages = lazy(() => import('./pages/messages/MyMessages'));
const WorklistPage = lazy(() => import('./pages/worklist/WorklistPage'));
const Logout = lazy(() => import('./layout/Logout'));
const Login = lazy(() => import('./layout/Login'));

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
        <Route exact path={UrlPathTemplate.Login} component={Login} />
        <Route exact path={UrlPathTemplate.Logout} component={Logout} />

        {/* LoggedInRoute */}
        <LoggedInRoute exact path={UrlPathTemplate.MyProfile} component={MyProfilePage} />

        {/* CreatorRoutes */}
        <CreatorRoute exact path={UrlPathTemplate.Registration} component={EditRegistration} />
        <CreatorRoute exact path={UrlPathTemplate.MyRegistrations} component={MyRegistrations} />
        <CreatorRoute exact path={UrlPathTemplate.MyMessages} component={MyMessages} />

        {/* CuratorRoutes */}
        <CuratorRoute exact path={UrlPathTemplate.Worklist} component={WorklistPage} />

        {/* InstitutionAdminRoutes */}
        <InstitutionAdminRoute exact path={UrlPathTemplate.MyInstitution} component={MyInstitutionPage} />
        <InstitutionAdminRoute exact path={UrlPathTemplate.MyInstitutionUsers} component={MyInstitutionUsersPage} />

        {/* AppAdminRoutes */}
        <AppAdminRoute exact path={UrlPathTemplate.AdminInstitutions} component={AdminCustomerInstitutionsPage} />

        {/* Wildcard path must be last, otherwise it will catch all routes */}
        <Route path={UrlPathTemplate.Wildcard} component={NotFound} />
      </Switch>
    </Suspense>
  );
};
