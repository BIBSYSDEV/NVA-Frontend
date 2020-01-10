import Amplify, { Hub } from 'aws-amplify';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { getAuthorityByFeideId } from './api/external/authorityRegisterApi';
import { mockUser } from './api/mock-interceptor';
import { getCurrentAuthenticatedUser, getIdToken } from './api/userApi';
import Breadcrumbs from './layout/Breadcrumbs';
import Footer from './layout/Footer';
import Header from './layout/header/Header';
import Notifier from './layout/Notifier';
import AdminMenu from './pages/dashboard/AdminMenu';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/errorpages/NotFound';
import PublicationForm from './pages/publication/PublicationForm';
import Search from './pages/search/Search';
import AuthorityOrcidModal from './pages/user/authority/AuthorityOrcidModal';
import User from './pages/user/User';
import Workspace from './pages/workspace/Workspace';
import { setAuthorityData, setUser } from './redux/actions/userActions';
import { RootStore } from './redux/reducers/rootReducer';
import { awsConfig } from './utils/aws-config';
import { USE_MOCK_DATA } from './utils/constants';
import { hubListener } from './utils/hub-listener';

const StyledApp = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-size: 62.5%;
`;

const StyledPageBody = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    align-items: center;
    margin: 3rem;
  }
  font-size: 1.6rem;
  flex-grow: 1;
`;

const App: React.FC = () => {
  useEffect(() => {
    const setAxiosHeaders = async () => {
      // TODO: Set global config of baseURL and auth when backend is ready
      // Set global config of axios requests
      // axios.defaults.baseURL = API_URL;
      const idToken = await getIdToken();

      Axios.defaults.headers.common = {
        Authorization: `Bearer ${idToken}`,
        Accept: 'application/json',
      };
      Axios.defaults.headers.post['Content-Type'] = 'application/json';
      Axios.defaults.headers.put['Content-Type'] = 'application/json';
    };
    setAxiosHeaders();
  }, []);

  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.user);
  const [showAuthorityOrcidModal, setShowAuthorityOrcidModal] = useState(false);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      user.isLoggedIn && dispatch(setUser(mockUser));
    } else {
      if (!user.isLoggedIn) {
        Amplify.configure(awsConfig);
      }
      dispatch(getCurrentAuthenticatedUser());
      Hub.listen('auth', data => hubListener(data, dispatch));
      return () => Hub.remove('auth', data => hubListener(data, dispatch));
    }
  }, [dispatch, user.isLoggedIn]);

  useEffect(() => {
    const getAuthority = async () => {
      const authority = await getAuthorityByFeideId(user.id, dispatch);
      if (authority) {
        dispatch(setAuthorityData(authority));
      }
    };
    if (user.id) {
      getAuthority();
    }
  }, [dispatch, user.id]);

  useEffect(() => {
    user.id && (!user.authority || !user.orcid) && setShowAuthorityOrcidModal(true);
  }, [user.id, user.authority, user.orcid]);

  return (
    <BrowserRouter>
      <StyledApp>
        <Notifier />
        <Header />
        {user.isLoggedIn && <AdminMenu />}
        <Breadcrumbs />
        {showAuthorityOrcidModal && <AuthorityOrcidModal />}
        <StyledPageBody>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            {user.isLoggedIn && <Route exact path="/publications" component={Workspace} />}
            {user.isLoggedIn && <Route exact path="/publications/new" component={PublicationForm} />}
            <Route exact path="/search" component={Search} />
            <Route exact path="/search/:searchTerm" component={Search} />
            <Route exact path="/search/:searchTerm/:offset" component={Search} />
            {user.isLoggedIn && <Route exact path="/user" component={User} />}
            <Route path="*" component={NotFound} />
          </Switch>
        </StyledPageBody>
        <Footer />
      </StyledApp>
    </BrowserRouter>
  );
};

export default App;
