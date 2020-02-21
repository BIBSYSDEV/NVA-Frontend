import React, { FC } from 'react';
import { Switch, Route } from 'react-router';
import Dashboard from './pages/dashboard/Dashboard';
import NewPublication from './pages/publication/NewPublication';
import MyPublications from './pages/publication/MyPublications';
import Search from './pages/search/Search';
import PublicationPage from './pages/publication/PublicationPage';
import User from './pages/user/User';
import NotFound from './pages/errorpages/NotFound';
import { useSelector } from 'react-redux';
import { RootStore } from './redux/reducers/rootReducer';
import { checkIfAppAdmin, checkIfPublisher, checkIfCurator } from './utils/authorization';
import PublicProfile from './pages/publication/PublicProfile';
import AdministrateMemberInstututionPage from './pages/AdministrateMemberInstitutionsPage';
import Worklist from './pages/Worklist';

const AppRoutes: FC = () => {
  const user = useSelector((store: RootStore) => store.user);
  const isPublisher = checkIfPublisher(user);
  const isAppAdmin = checkIfAppAdmin(user);
  const isCurator = checkIfCurator(user);

  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      {isPublisher && <Route exact path="/publication/:id" component={NewPublication} />}
      {isPublisher && <Route exact path="/publication" component={NewPublication} />}
      {isPublisher && <Route exact path="/my-publications" component={MyPublications} />}
      {isAppAdmin && <Route exact path="/admin-institutions" component={AdministrateMemberInstututionPage} />}
      {isCurator && <Route exact path="/worklist" component={Worklist} />}
      {user.isLoggedIn && <Route exact path="/public-profile/:userName" component={PublicProfile} />}
      <Route exact path="/search" component={Search} />
      <Route exact path="/publication/:publicationId" component={PublicationPage} />
      <Route exact path="/search/:searchTerm" component={Search} />
      <Route exact path="/search/:searchTerm/:offset" component={Search} />
      {user.isLoggedIn && <Route exact path="/user" component={User} />}
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default AppRoutes;
