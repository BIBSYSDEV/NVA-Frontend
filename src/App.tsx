import './styles/app.scss';

import React from 'react';
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';

import Dashboard from './components/dashboard/Dashboard';
import NotFound from './components/errorpages/NotFound';
import Header from './components/header/Header';
import Resource from './components/resources/Resource';
import Search from './components/search/Search';
import User from './components/user/User';

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
