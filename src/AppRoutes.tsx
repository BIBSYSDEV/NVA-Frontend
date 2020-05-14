import React, { FC, Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router';
import { useSelector } from 'react-redux';
import { RootStore } from './redux/reducers/rootReducer';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import DelayedFallback from './components/DelayedFallback';
import OrderInformation from './pages/infopages/OrderInformation';
import Description from './pages/infopages/Description';
import PrivacyPolicy from './pages/infopages/PrivacyPolicy';

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const EditPublication = lazy(() => import('./pages/publication/EditPublication'));
const MyPublications = lazy(() => import('./pages/publication/MyPublications'));
const Search = lazy(() => import('./pages/search/Search'));
const PublicationPage = lazy(() => import('./pages/publication/publication_page/PublicationPage'));
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
        {user.isPublisher && <Route exact path="/publication" component={EditPublication} />}
        {user.isPublisher && <Route exact path="/publication/:identifier" component={EditPublication} />}
        {user.isPublisher && <Route exact path="/my-publications" component={MyPublications} />}
        {user.isCurator && <Route exact path="/worklist" component={WorklistPage} />}
        {user.isAppAdmin && <Route exact path="/admin-institutions" component={AdminCustomerInstitutionsPage} />}
        {user.isAppAdmin && (
          <Route exact path="/admin-institutions/:identifier" component={AdminCustomerInstitutionPage} />
        )}
        {user.isInstitutionAdmin && <Route exact path="/admin-institution-users" component={AdminUsersPage} />}
        <Route exact path="/profile/:arpId" component={PublicProfile} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/publication/:identifier/public" component={PublicationPage} />
        <Route exact path="/search/:searchTerm" component={Search} />
        <Route exact path="/search/:searchTerm/:offset" component={Search} />
        {user.isLoggedIn && <Route exact path="/user" component={User} />}
        {!user.isLoggedIn && <Route exact path="/logout" component={Logout} />}
        <Route exact path="/order-information" component={OrderInformation} />
        <Route exact path="/description" component={Description} />
        <Route exact path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
