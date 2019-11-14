import Amplify, { Hub } from 'aws-amplify';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { mockUser } from './api/mock-interceptor';
import { getCurrentAuthenticatedUser } from './api/user';
import Breadcrumbs from './layout/Breadcrumbs';
import Footer from './layout/Footer';
import Header from './layout/header/Header';
import AdminMenu from './pages/dashboard/AdminMenu';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/errorpages/NotFound';
import Resource from './pages/resource/Resource';
import Search from './pages/search/Search';
import User from './pages/user/User';
import Workspace from './pages/workspace/Workspace';
import { setUser } from './redux/actions/userActions';
import { RootStore } from './redux/reducers/rootReducer';
import awsConfig from './utils/aws-config';
import { USE_MOCK_DATA } from './utils/constants';
import { hubListener } from './utils/hub-listener';

const StyledApp = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  font-size: 62.5%;
`;

const StyledPageBody = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  flex-grow: 1;
`;

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const feedback = useSelector((store: RootStore) => store.feedback);
  const auth = useSelector((store: RootStore) => store.auth);

  useEffect(() => {
    if (feedback.length > 0) {
      feedback.map(fb =>
        fb.variant === 'error'
          ? enqueueSnackbar(t(fb.message), { variant: fb.variant, persist: true })
          : enqueueSnackbar(t(fb.message), { variant: fb.variant })
      );
    }
    return () => {
      closeSnackbar();
    };
  }, [feedback, enqueueSnackbar, closeSnackbar, t]);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      dispatch(setUser(mockUser));
    } else {
      if (!auth.isLoggedIn) {
        Amplify.configure(awsConfig);
      }
      dispatch(getCurrentAuthenticatedUser());
      Hub.listen('auth', data => hubListener(data, dispatch));
      return () => Hub.remove('auth', data => hubListener(data, dispatch));
    }
  }, [dispatch, auth.isLoggedIn]);

  return (
    <BrowserRouter>
      <StyledApp>
        <Header />
        <AdminMenu />
        <Breadcrumbs />
        <StyledPageBody>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/resources" component={Workspace} />
            <Route exact path="/resources/new" component={Resource} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/search/:searchTerm" component={Search} />
            <Route exact path="/search/:searchTerm/:offset" component={Search} />
            <Route exact path="/user" component={User} />
            <Route path="*" component={NotFound} />
          </Switch>
        </StyledPageBody>
        <Footer />
      </StyledApp>
    </BrowserRouter>
  );
};

export default App;
