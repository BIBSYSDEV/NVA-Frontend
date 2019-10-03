import './styles/app.scss';

import Amplify, { Auth, Hub } from 'aws-amplify';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { setUser } from './actions/userActions';
import awsConfig from './aws-config';
import Dashboard from './modules/dashboard/Dashboard';
import NotFound from './modules/errorpages/NotFound';
import Header from './modules/header/Header';
import Resource from './modules/resources/Resource';
import Search from './modules/search/Search';
import User from './modules/user/User';
import { emptyUser } from './types/user.types';
import { getUserDataFromCognitoAndSetUser } from './utils/getUserDataFromCognitoAndSetUser';

const App: React.FC = () => {
  Amplify.configure(awsConfig);

  const dispatch = useDispatch();

  useEffect(() => {
    const updateUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        dispatch(getUserDataFromCognitoAndSetUser(user));
      } catch (e) {
        dispatch(setUser(emptyUser));
      }
    };
    Hub.listen('auth', updateUser);
    updateUser();
    return () => Hub.remove('auth', updateUser);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <div className="body">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/resources/new" component={Resource} />
            <Route exact path="/search" component={Search} />
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
