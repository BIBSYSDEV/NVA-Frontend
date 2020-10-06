import React, { FC, Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import DelayedFallback from './components/DelayedFallback';
import OrderInformation from './pages/infopages/OrderInformation';
import Description from './pages/infopages/Description';
import PrivacyPolicy from './pages/infopages/PrivacyPolicy';
import { LoggedInRoute, CreatorRoute, CuratorRoute, InstitutionAdminRoute, AppAdminRoute } from './utils/routes/Routes';
import { useSelector } from 'react-redux';
import { RootStore } from './redux/reducers/rootReducer';

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const EditPublication = lazy(() => import('./pages/publication/EditPublication'));
const MyPublications = lazy(() => import('./pages/publication/my_publications/MyPublications'));
const Search = lazy(() => import('./pages/search/Search'));
const PublicPublication = lazy(() => import('./pages/publication/public_publication/PublicPublication'));
const User = lazy(() => import('./pages/user/User'));
const NotFound = lazy(() => import('./pages/errorpages/NotFound'));
const PublicProfile = lazy(() => import('./pages/publication/PublicProfile'));
const AdminCustomerInstitutionsPage = lazy(() => import('./pages/admin/AdminCustomerInstitutionsPage'));
const MyInstitutionPage = lazy(() => import('./pages/admin/MyInstitutionPage'));
const WorklistPage = lazy(() => import('./pages/worklist/WorklistPage'));
const Logout = lazy(() => import('./layout/Logout'));

const AppRoutes: FC = () => {
  const user = useSelector((store: RootStore) => store.user);

  return (
    <Suspense fallback={<DelayedFallback />}>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/description" component={Description} />
        <Route exact path="/order-information" component={OrderInformation} />
        <Route exact path="/privacy-policy" component={PrivacyPolicy} />
        <Route exact path="/user/:arpId" component={PublicProfile} />
        <Route exact path="/registration/:identifier/public" component={PublicPublication} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/search/:searchTerm" component={Search} />
        <Route exact path="/search/:searchTerm/:offset" component={Search} />
        <Route exact path="/logout" component={Logout} />

        {user && (
          <>
            {/* LoggedInRoute */}
            <LoggedInRoute exact path="/user" component={User} />

            {/* CreatorRoutes */}
            <CreatorRoute exact path="/registration" component={EditPublication} />
            <CreatorRoute exact path="/registration/:identifier" component={EditPublication} />
            <CreatorRoute exact path="/my-registrations" component={MyPublications} />

            {/* CuratorRoutes */}
            <CuratorRoute exact path="/worklist" component={WorklistPage} />

            {/* InstitutionAdminRoutes */}
            <InstitutionAdminRoute exact path="/my-institution" component={MyInstitutionPage} />
            <InstitutionAdminRoute exact path="/my-institution-users" component={AdminUsersPage} />

            {/* AppAdminRoutes */}
            <AppAdminRoute exact path="/admin-institutions" component={AdminCustomerInstitutionsPage} />
          </>
        )}

        {/* NotFound must be last, otherwise it will catch all routes */}
        <Route path="*" component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
