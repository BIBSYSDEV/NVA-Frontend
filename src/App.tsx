import React from 'react';
import './styles/app.scss';
import Login from './components/login/Login';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import NotFound from './components/errorpages/NotFound';
import User from './components/user/User';

const App: React.FC = () => (
  <BrowserRouter>
    <div className="app">
      <div className="header">
        header
        <Login buttonText="login" />
      </div>
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
