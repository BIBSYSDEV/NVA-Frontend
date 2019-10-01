import './styles/app.scss';

import React from 'react';
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';

import Dashboard from './modules/dashboard/Dashboard';
import NotFound from './modules/errorpages/NotFound';
import Header from './modules/header/Header';
import Resource from './modules/resources/Resource';
import Search from './modules/search/Search';
import User from './modules/user/User';

const App: React.FC = () => (
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

export default App;
