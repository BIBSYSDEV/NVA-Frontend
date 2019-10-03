import './styles/app.scss';

import Amplify, { Auth, Hub } from 'aws-amplify';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { setUser } from './actions/userActions';
import awsConfig from './aws-config';
import Dashboard from './modules/dashboard/Dashboard';
import NotFound from './modules/errorpages/NotFound';
import Header from './modules/header/Header';
import Resource from './modules/resources/Resource';
import Search from './modules/search/Search';
import User from './modules/user/User';
import { getUserDataFromCognitoAndSetUser } from './utils/getUserDataFromCognitoAndSetUser';
import { emptyUser } from './types/user.types';

const App: React.FC = () => {
  Amplify.configure(awsConfig);

  const dispatch = useDispatch();

  Hub.listen('auth', ({ payload: { event, data } }) => {
    console.log('event', event);
    switch (event) {
      case 'signIn':
        dispatch(getUserDataFromCognitoAndSetUser(data));
        console.log('signin hub');
        break;
      case 'signOut':
        dispatch(setUser(emptyUser));
        console.log('signout hub');
        break;
      // case 'signIn_failure':
      // case 'cognitoHostedUI_failure':
      // case 'customState_failure':
      default:
        console.log('default hub');
      // setUser(null);
    }
  });

  useEffect(() => {
    const updateUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        dispatch(getUserDataFromCognitoAndSetUser(user));
      } catch (e) {
        dispatch(setUser(emptyUser));
      }
    };
    updateUser();
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <div className="body">
          <Switch>
            <Route
              exact
              path="/"
              render={(routeProps: RouteComponentProps) => <Dashboard history={routeProps.history} />}
            />
            <Route exact path="/resources/new" component={Resource} />
            <Route
              exact
              path="/search"
              render={(routeProps: RouteComponentProps) => <Search history={routeProps.history} />}
            />
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
