import './styles/app.scss';

import Amplify, { Hub } from 'aws-amplify';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { getCurrentAuthenticatedUser } from './api/user';
import awsConfig from './aws-config';
import Breadcrumbs from './modules/breadcrumbs/Breadcrumbs';
import AdminMenu from './modules/dashboard/AdminMenu';
import Dashboard from './modules/dashboard/Dashboard';
import NotFound from './modules/errorpages/NotFound';
import Header from './modules/header/Header';
import Resource from './modules/resources/Resource';
import Search from './modules/search/Search';
import User from './modules/user/User';
import { RootStore } from './reducers/rootReducer';
import { hubListener } from './utils/hub-listener';

const App: React.FC = () => {
  Amplify.configure(awsConfig);

  const dispatch = useDispatch();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const feedback = useSelector((store: RootStore) => store.feedback);

  useEffect(() => {
    if (feedback.length > 0) {
      feedback.map(fb =>
        fb.variant === 'error'
          ? enqueueSnackbar(fb.message, { variant: fb.variant, persist: true })
          : enqueueSnackbar(fb.message, { variant: fb.variant })
      );
    }
    return () => {
      closeSnackbar();
    };
  }, [feedback, enqueueSnackbar, closeSnackbar]);

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
        <AdminMenu />
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
