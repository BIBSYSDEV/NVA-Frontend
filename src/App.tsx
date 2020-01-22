import Amplify, { Hub } from 'aws-amplify';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { getAuthorities } from './api/authorityApi';
import { getCurrentAuthenticatedUser } from './api/userApi';
import Breadcrumbs from './layout/Breadcrumbs';
import Footer from './layout/Footer';
import Header from './layout/header/Header';
import Notifier from './layout/Notifier';
import AdminMenu from './pages/dashboard/AdminMenu';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/errorpages/NotFound';
import NewPublication from './pages/publication/NewPublication';
import Search from './pages/search/Search';
import AuthorityOrcidModal from './pages/user/authority/AuthorityOrcidModal';
import User from './pages/user/User';
import Workspace from './pages/workspace/Workspace';
import { setAuthorityData, setPossibleAuthories, setUser } from './redux/actions/userActions';
import { RootStore } from './redux/reducers/rootReducer';
import { Authority } from './types/authority.types';
import { awsConfig } from './utils/aws-config';
import { API_URL, DEBOUNCE_INTERVAL_MODAL, USE_MOCK_DATA } from './utils/constants';
import { hubListener } from './utils/hub-listener';
import { mockUser } from './utils/testfiles/mock_feide_user';

const StyledApp = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledPageBody = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    align-items: center;
    margin: 3rem;
  }
  font-size: 1rem;
  flex-grow: 1;
`;

const App: React.FC = () => {
  useEffect(() => {
    const setAxiosHeaders = async () => {
      // Set global config of axios requests
      Axios.defaults.baseURL = API_URL;
      // Uncomment this when we use our backend only
      // const idToken = await getIdToken();
      Axios.defaults.headers.common = {
        //   Authorization: `Bearer ${idToken}`,
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
      const authorities = await getAuthorities(user.name, dispatch);
      const filteredAuthorities: Authority[] = authorities.filter((auth: Authority) =>
        auth.feideids.some(id => id === user.id)
      );
      if (filteredAuthorities.length === 1) {
        dispatch(setAuthorityData(filteredAuthorities[0]));
      } else {
        dispatch(setPossibleAuthories(authorities));
      }
    };
    if (user.name && !user.authority?.name) {
      getAuthority();
    }
  }, [dispatch, user.name, user.id, user.authority]);

  useEffect(() => {
    setTimeout(() => {
      user.id &&
        (user.authority?.orcids.length === 0 || user.authority?.feideids.length === 0) &&
        setShowAuthorityOrcidModal(true);
    }, DEBOUNCE_INTERVAL_MODAL);
  }, [user.id, user.authority]);

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
            {user.isLoggedIn && <Route exact path="/publications/new" component={NewPublication} />}
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
