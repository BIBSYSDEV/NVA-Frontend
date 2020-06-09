import Amplify, { Hub } from 'aws-amplify';
import Axios from 'axios';
import React, { useEffect, useState, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';

import { AuthorityQualifiers, addQualifierIdForAuthority } from './api/authorityApi';
import { getCurrentUserAttributes } from './api/userApi';
import Breadcrumbs from './layout/Breadcrumbs';
import Footer from './layout/Footer';
import Header from './layout/header/Header';
import Notifier from './layout/Notifier';
import AuthorityOrcidModal from './pages/user/authority/AuthorityOrcidModal';
import { setAuthorityData, setPossibleAuthorities, setUser } from './redux/actions/userActions';
import { RootStore } from './redux/reducers/rootReducer';
import { Authority } from './types/authority.types';
import { awsConfig } from './utils/aws-config';
import { API_URL, USE_MOCK_DATA } from './utils/constants';
import { hubListener } from './utils/hub-listener';
import { mockUser } from './utils/testfiles/mock_feide_user';
import AppRoutes from './AppRoutes';
import { setNotification } from './redux/actions/notificationActions';
import { NotificationVariant } from './types/notification.types';
import { CircularProgress } from '@material-ui/core';
import useFetchAuthorities from './utils/hooks/useFetchAuthorities';

const StyledApp = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-self: center;
  max-width: ${({ theme }) => theme.breakpoints.values.lg + 'px'};
  align-items: center;
  flex-grow: 1;
`;

const ProgressContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App: FC = () => {
  useEffect(() => {
    const setAxiosHeaders = async () => {
      // Set global config of axios requests
      Axios.defaults.baseURL = API_URL;
      Axios.defaults.headers.common = {
        Accept: 'application/json',
      };
      Axios.defaults.headers.post['Content-Type'] = 'application/json';
      Axios.defaults.headers.put['Content-Type'] = 'application/json';
    };
    setAxiosHeaders();
  }, []);

  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.user);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [authorities, isLoadingAuthorities, handleNewSearchTerm] = useFetchAuthorities(user?.name ?? '');
  const [authorityDataUpdated, setAuthorityDataUpdated] = useState(false);

  useEffect(() => {
    console.log('Hi10');
    // Setup aws-amplify
    if (USE_MOCK_DATA) {
      setIsLoadingUser(false);
      dispatch(setUser(mockUser));
    } else {
      Amplify.configure(awsConfig);

      Hub.listen('auth', (data) => {
        hubListener(data, dispatch);
      });

      return () => Hub.remove('auth', (data) => hubListener(data, dispatch));
    }
  }, [dispatch]);

  useEffect(() => {
    // Fetch already authenticated user
    const getUser = async () => {
      console.log('Hi5');
      const currentUser = await getCurrentUserAttributes();
      if (currentUser) {
        if (currentUser.error) {
          dispatch(setNotification(currentUser.error, NotificationVariant.Error));
        } else {
          dispatch(setUser(currentUser));
        }
      }
      setIsLoadingUser(false);
    };
    getUser();
  }, [dispatch]);

  useEffect(() => {
    // Update search term for fetching possible authorities
    if (user?.name && !authorities && !isLoadingAuthorities) {
      console.log('Hi2');
      handleNewSearchTerm(user.name);
    }
  }, [handleNewSearchTerm, authorities, isLoadingAuthorities, user]);

  useEffect(() => {
    // Handle possible authorities
    const getAuthority = async () => {
      console.log('Hi1');
      if (authorities) {
        const filteredAuthorities: Authority[] = authorities.filter((auth: Authority) =>
          auth.feideids.some((id) => id === user.id)
        );
        if (filteredAuthorities.length === 1) {
          const updatedAuthority = await addQualifierIdForAuthority(
            filteredAuthorities[0].systemControlNumber,
            AuthorityQualifiers.ORGUNIT_ID,
            user.organizationId
          );
          if (!updatedAuthority || updatedAuthority?.error) {
            dispatch(setAuthorityData(filteredAuthorities[0]));
          } else {
            dispatch(setAuthorityData(updatedAuthority));
          }
        } else {
          dispatch(setPossibleAuthorities(authorities));
        }
        setAuthorityDataUpdated(true);
      }
    };
    if (user?.name && !user.authority) {
      getAuthority();
    }
  }, [dispatch, authorities, user]);

  return isLoadingUser ? (
    <ProgressContainer>
      <CircularProgress />
    </ProgressContainer>
  ) : (
    <BrowserRouter>
      <StyledApp>
        <Notifier />
        <Header />
        <Breadcrumbs />
        <StyledContent>
          <AppRoutes />
        </StyledContent>
        <Footer />
      </StyledApp>
      {!localStorage.getItem('previouslyLoggedIn') && !isLoadingAuthorities && authorityDataUpdated && (
        <AuthorityOrcidModal authority={user.authority} />
      )}
    </BrowserRouter>
  );
};

export default App;
