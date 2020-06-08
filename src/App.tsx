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
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [authorities, isLoadingAuthorities, handleNewSearchTerm] = useFetchAuthorities(user.name);
  const [authorityDataUpdated, setAuthorityDataUpdated] = useState(false);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      setIsLoadingUser(false);
      user.isLoggedIn && dispatch(setUser(mockUser));
    } else {
      if (!user.isLoggedIn) {
        Amplify.configure(awsConfig);
      }

      const getUser = async () => {
        const currentUser = await getCurrentUserAttributes();
        if (currentUser && !currentUser.error) {
          dispatch(setUser(currentUser));
        } else if (currentUser.error && user.isLoggedIn) {
          dispatch(setNotification(currentUser.error, NotificationVariant.Error));
        }
        setIsLoadingUser(false);
      };
      getUser();

      Hub.listen('auth', (data) => {
        hubListener(data, dispatch);
      });

      return () => Hub.remove('auth', (data) => hubListener(data, dispatch));
    }
  }, [dispatch, user.isLoggedIn]);

  useEffect(() => {
    if (user?.name) {
      handleNewSearchTerm(user.name);
    }
  }, [user, handleNewSearchTerm]);

  useEffect(() => {
    const getAuthority = async () => {
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
    if (user.name) {
      getAuthority();
    }
  }, [dispatch, authorities, user.id, user.organizationId, user.name]);

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
