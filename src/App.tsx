import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './styles/app.scss';
import Dashboard from './components/dashboard/Dashboard';
import NotFound from './components/errorpages/NotFound';
import User from './components/user/User';
import Header from './components/header/Header';

const App: React.FC = () => (
  <BrowserRouter>
    <div className="app">
      <Header />
      <div className="body">
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/user" component={User} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
      <div className="footer">footer</div>
    </div>
  </BrowserRouter>
);

export default App;
