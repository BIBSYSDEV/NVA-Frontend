import React, { FC, Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router';
import { useSelector } from 'react-redux';
import { RootStore } from './redux/reducers/rootReducer';
import { checkIfAppAdmin, checkIfPublisher, checkIfCurator } from './utils/authorization';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import DelayedFallback from './components/DelayedFallback';

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const EditPublication = lazy(() => import('./pages/publication/EditPublication'));
const MyPublications = lazy(() => import('./pages/publication/MyPublications'));
const Search = lazy(() => import('./pages/search/Search'));
const PublicationPage = lazy(() => import('./pages/publication/PublicationPage'));
const User = lazy(() => import('./pages/user/User'));
const NotFound = lazy(() => import('./pages/errorpages/NotFound'));
const PublicProfile = lazy(() => import('./pages/publication/PublicProfile'));
const AdminCustomerInstitutionPage = lazy(() => import('./pages/admin/AdminCustomerInstitutionPage'));
const AdminCustomerInstitutionsPage = lazy(() => import('./pages/admin/AdminCustomerInstitutionsPage'));
const WorklistPage = lazy(() => import('./pages/worklist/WorklistPage'));
const AppRoutes: FC = () => {
  const user = useSelector((store: RootStore) => store.user);
  const isPublisher = checkIfPublisher(user);
  const isAppAdmin = checkIfAppAdmin(user);
  const isCurator = checkIfCurator(user);

  return (
    <Suspense fallback={<DelayedFallback />}>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        {isPublisher && <Route exact path="/publication" component={EditPublication} />}
        {isPublisher && <Route exact path="/publication/:id" component={EditPublication} />}
        {isPublisher && <Route exact path="/my-publications" component={MyPublications} />}
        {isCurator && <Route exact path="/worklist" component={WorklistPage} />}
        {isAppAdmin && <Route exact path="/admin-institutions" component={AdminCustomerInstitutionsPage} />}
        {isAppAdmin && <Route exact path="/admin-institution" component={AdminCustomerInstitutionPage} />}
        {isAppAdmin && <Route exact path="/admin-institution-users" component={AdminUsersPage} />}
        {user.isLoggedIn && <Route exact path="/public-profile/:userName" component={PublicProfile} />}
        <Route exact path="/search" component={Search} />
        <Route exact path="/publication/:publicationId" component={PublicationPage} />
        <Route exact path="/search/:searchTerm" component={Search} />
        <Route exact path="/search/:searchTerm/:offset" component={Search} />
        {user.isLoggedIn && <Route exact path="/user" component={User} />}
        <Route path="*" component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
