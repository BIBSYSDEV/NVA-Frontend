import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import DelayedFallback from './components/DelayedFallback';
import { RootStore } from './redux/reducers/rootReducer';
import { AppAdminRoute, CreatorRoute, CuratorRoute, InstitutionAdminRoute, LoggedInRoute } from './utils/routes/Routes';
import { UrlPathTemplate } from './utils/urlPaths';

const About = lazy(() => import('./pages/infopages/About'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const EditRegistration = lazy(() => import('./pages/registration/new_registration/EditRegistration'));
const MyRegistrations = lazy(() => import('./pages/my_registrations/MyRegistrations'));
const SearchPage = lazy(() => import('./pages/search/SearchPage'));
const PublicRegistration = lazy(() => import('./pages/public_registration/PublicRegistration'));
const MyProfilePage = lazy(() => import('./pages/user/MyProfilePage'));
const NotFound = lazy(() => import('./pages/errorpages/NotFound'));
const PrivacyPolicy = lazy(() => import('./pages/infopages/PrivacyPolicy'));
const PublicProfile = lazy(() => import('./pages/public_profile/PublicProfile'));
const AdminCustomerInstitutionsPage = lazy(() => import('./pages/admin/AdminCustomerInstitutionsPage'));
const MyInstitutionPage = lazy(() => import('./pages/admin/MyInstitutionPage'));
const MyInstitutionUsersPage = lazy(() => import('./pages/admin/MyInstitutionUsersPage'));
const MyMessages = lazy(() => import('./pages/messages/MyMessages'));
const WorklistPage = lazy(() => import('./pages/worklist/WorklistPage'));
const Logout = lazy(() => import('./layout/Logout'));

export const AppRoutes = () => {
  const user = useSelector((store: RootStore) => store.user);

  return (
    <Suspense fallback={<DelayedFallback />}>
      <Switch>
        <Route exact path={UrlPathTemplate.Home} component={Dashboard} />
        <Route exact path={UrlPathTemplate.About} component={About} />
        <Route exact path={UrlPathTemplate.PrivacyPolicy} component={PrivacyPolicy} />
        <Route exact path={UrlPathTemplate.User} component={PublicProfile} />
        <Route exact path={UrlPathTemplate.RegistrationLandingPage} component={PublicRegistration} />
        <Route exact path={UrlPathTemplate.Search} component={SearchPage} />
        <Route exact path={UrlPathTemplate.Logout} component={Logout} />

        {user && (
          <>
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
          </>
        )}

        {/* NotFound must be last, otherwise it will catch all routes */}
        <Route path={UrlPathTemplate.Wildcard} component={NotFound} />
      </Switch>
    </Suspense>
  );
};
