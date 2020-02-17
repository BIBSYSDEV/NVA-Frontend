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
import { checkIfPublisher } from './utils/authorization';

const AppRoutes: FC = () => {
  const user = useSelector((store: RootStore) => store.user);
  const isPublisher = checkIfPublisher(user);

  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      {isPublisher && <Route exact path="/new-publication" component={NewPublication} />}
      {isPublisher && <Route exact path="/my-publications" component={MyPublications} />}
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
