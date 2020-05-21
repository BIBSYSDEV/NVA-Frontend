import React, { FC, Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootStore } from './redux/reducers/rootReducer';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import DelayedFallback from './components/DelayedFallback';
import OrderInformation from './pages/infopages/OrderInformation';
import Description from './pages/infopages/Description';
import PrivacyPolicy from './pages/infopages/PrivacyPolicy';

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const EditPublication = lazy(() => import('./pages/publication/EditPublication'));
const MyPublications = lazy(() => import('./pages/publication/my_publications/MyPublications'));
const Search = lazy(() => import('./pages/search/Search'));
const PublicPublication = lazy(() => import('./pages/publication/public_publication/PublicPublication'));
const User = lazy(() => import('./pages/user/User'));
const NotFound = lazy(() => import('./pages/errorpages/NotFound'));
const PublicProfile = lazy(() => import('./pages/publication/PublicProfile'));
const AdminCustomerInstitutionPage = lazy(() => import('./pages/admin/AdminCustomerInstitutionPage'));
const AdminCustomerInstitutionsPage = lazy(() => import('./pages/admin/AdminCustomerInstitutionsPage'));
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
        <Route exact path="/profile/:arpId" component={PublicProfile} />
        <Route exact path="/publication/:identifier/public" component={PublicPublication} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/search/:searchTerm" component={Search} />
        <Route exact path="/search/:searchTerm/:offset" component={Search} />

        {user.isLoggedIn ? (
          <>
            <Route exact path="/user" component={User} />
            {user.isPublisher && <PublisherRoutes />}
            {user.isCurator && <CuratorRoutes />}
            {user.isAppAdmin && <AppAdminRoutes />}
            {user.isInstitutionAdmin && <InstitutionAdminRoutes />}
          </>
        ) : (
          <Route exact path="/logout" component={Logout} />
        )}

        {/* NotFound must be last, otherwise it will catch all routes */}
        <Route path="*" component={NotFound} />
      </Switch>
    </Suspense>
  );
};

const PublisherRoutes: FC = () => (
  <>
    <Route exact path="/publication" component={EditPublication} />
    <Route exact path="/publication/:identifier" component={EditPublication} />
    <Route exact path="/my-publications" component={MyPublications} />
  </>
);

const CuratorRoutes: FC = () => <Route exact path="/worklist" component={WorklistPage} />;

const AppAdminRoutes: FC = () => (
  <>
    <Route exact path="/admin-institutions" component={AdminCustomerInstitutionsPage} />
    <Route exact path="/admin-institutions/:identifier" component={AdminCustomerInstitutionPage} />
  </>
);

const InstitutionAdminRoutes: FC = () => <Route exact path="/admin-institution-users" component={AdminUsersPage} />;

export default AppRoutes;
