import Amplify, { Hub } from 'aws-amplify';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { getAuthorityById } from './api/external/authorityRegisterApi';
import { mockUser } from './api/mock-interceptor';
import { getCurrentAuthenticatedUser } from './api/userApi';
import Breadcrumbs from './layout/Breadcrumbs';
import Footer from './layout/Footer';
import Header from './layout/header/Header';
import Notifier from './layout/Notifier';
import AdminMenu from './pages/dashboard/AdminMenu';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/errorpages/NotFound';
import PublicationForm from './pages/publication/PublicationForm';
import Search from './pages/search/Search';
import { ConnectAuthority } from './pages/user/authority/ConnectAuthority';
import User from './pages/user/User';
import Workspace from './pages/workspace/Workspace';
import { setAuthorityData, setUser } from './redux/actions/userActions';
import { RootStore } from './redux/reducers/rootReducer';
import { awsConfig } from './utils/aws-config';
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
  flex-direction: column;
  align-items: center;
  font-size: 1.6rem;
  flex-grow: 1;
  margin: 3rem;
`;

const App: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector((store: RootStore) => store.auth);
  const user = useSelector((store: RootStore) => store.user);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      auth.isLoggedIn && dispatch(setUser(mockUser));
    } else {
      if (!auth.isLoggedIn) {
        Amplify.configure(awsConfig);
      }
      dispatch(getCurrentAuthenticatedUser());
      Hub.listen('auth', data => hubListener(data, dispatch));
      return () => Hub.remove('auth', data => hubListener(data, dispatch));
    }
  }, [dispatch, auth.isLoggedIn]);

  useEffect(() => {
    const getAuthority = async () => {
      const authority = await getAuthorityById(user.id, dispatch);
      if (authority) {
        dispatch(setAuthorityData(authority));
      }
    };
    if (user.id) {
      getAuthority();
    }
  }, [dispatch, user.id]);

  return (
    <BrowserRouter>
      <StyledApp>
        <Notifier />
        <Header />
        {auth.isLoggedIn && <AdminMenu />}
        <Breadcrumbs />
        <StyledPageBody>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            {auth.isLoggedIn && <Route exact path="/publications" component={Workspace} />}
            {auth.isLoggedIn && <Route exact path="/publications/new" component={PublicationForm} />}
            <Route exact path="/search" component={Search} />
            <Route exact path="/search/:searchTerm" component={Search} />
            <Route exact path="/search/:searchTerm/:offset" component={Search} />
            {auth.isLoggedIn && <Route exact path="/user" component={User} />}
            {auth.isLoggedIn && <Route exact path="/user/authority" component={ConnectAuthority} />}
            <Route path="*" component={NotFound} />
          </Switch>
        </StyledPageBody>
        <Footer />
      </StyledApp>
    </BrowserRouter>
  );
};

export default App;
