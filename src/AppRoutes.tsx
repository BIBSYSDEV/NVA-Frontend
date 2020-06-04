import React, { FC, Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import DelayedFallback from './components/DelayedFallback';
import OrderInformation from './pages/infopages/OrderInformation';
import Description from './pages/infopages/Description';
import PrivacyPolicy from './pages/infopages/PrivacyPolicy';
import {
  LoggedInRoute,
  PublisherRoute,
  CuratorRoute,
  AppAdminRoute,
  InstitutionAdminRoute,
} from './utils/routes/Routes';

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

const AppRoutes: FC = () => (
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
      <Route exact path="/logout" component={Logout} />

      {/* LoggedInRoute */}
      <LoggedInRoute exact path="/user" component={User} />

      {/* PublisherRoutes */}
      <PublisherRoute exact path="/publication" component={EditPublication} />
      <PublisherRoute exact path="/publication/:identifier" component={EditPublication} />
      <PublisherRoute exact path="/my-publications" component={MyPublications} />

      {/* CuratorRoutes */}
      <CuratorRoute exact path="/worklist" component={WorklistPage} />

      {/* AppAdminRoutes */}
      <AppAdminRoute exact path="/admin-institutions" component={AdminCustomerInstitutionsPage} />
      <AppAdminRoute exact path="/admin-institutions/:identifier" component={AdminCustomerInstitutionPage} />

      {/* InstitutionAdminRoutes */}
      <InstitutionAdminRoute exact path="/admin-institution-users" component={AdminUsersPage} />

      {/* NotFound must be last, otherwise it will catch all routes */}
      <Route path="*" component={NotFound} />
    </Switch>
  </Suspense>
);

export default AppRoutes;
