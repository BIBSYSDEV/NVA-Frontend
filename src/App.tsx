import './styles/app.scss';

import Amplify, { Hub } from 'aws-amplify';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { getCurrentAuthenticatedUser } from './api/user';
import awsConfig from './aws-config';
import Breadcrumbs from './modules/breadcrumbs/Breadcrumbs';
import Dashboard from './modules/dashboard/Dashboard';
import NotFound from './modules/errorpages/NotFound';
import Header from './modules/header/Header';
import Resource from './modules/resources/Resource';
import Search from './modules/search/Search';
import User from './modules/user/User';
import { hubListener } from './utils/hub-listener';

const App: React.FC = () => {
  Amplify.configure(awsConfig);

  const dispatch = useDispatch();

  useEffect(() => {
    const updateUser = async () => {
      dispatch(getCurrentAuthenticatedUser());
    };
    Hub.listen('auth', updateUser);
    updateUser();
    return () => Hub.remove('auth', updateUser);
  }, [dispatch]);

  useEffect(() => {
    Hub.listen('auth', data => hubListener(data, dispatch));
    return () => Hub.remove('auth', data => hubListener(data, dispatch));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Breadcrumbs />
        <div className="body">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/resources/new" component={Resource} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/search/:searchTerm" component={Search} />
            <Route exact path="/search/:searchTerm/:offset" component={Search} />
            <Route exact path="/user" component={User} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
        <div className="footer">footer</div>
      </div>
    </BrowserRouter>
  );
};

export default App;
