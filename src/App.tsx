import Amplify, { Hub } from 'aws-amplify';
import Axios from 'axios';
import React, { useEffect, useState, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';

import { AuthorityQualifiers, addQualifierIdForAuthority } from './api/authorityApi';
import { getCurrentUserAttributes } from './api/userApi';
import Breadcrumbs from './layout/Breadcrumbs';
import Footer from './layout/Footer';
import Header from './layout/header/Header';
import Notifier from './layout/Notifier';
import AuthorityOrcidModal from './pages/user/authority/AuthorityOrcidModal';
import { setAuthorityData, setPossibleAuthorities, setUser, setRoles } from './redux/actions/userActions';
import { RootStore } from './redux/reducers/rootReducer';
import { Authority } from './types/authority.types';
import { awsConfig } from './utils/aws-config';
import { API_URL, USE_MOCK_DATA } from './utils/constants';
import { hubListener } from './utils/hub-listener';
import { mockUser } from './utils/testfiles/mock_feide_user';
import AppRoutes from './AppRoutes';
import useFetchAuthorities from './utils/hooks/useFetchAuthorities';
import { setNotification } from './redux/actions/notificationActions';
import { getMyRoles, UserRoles } from './api/roleApi';
import { NotificationVariant } from './types/notification.types';

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
  const [authorities, isLoadingAuthorities, handleNewAuthoritiesSearchTerm] = useFetchAuthorities(user?.name ?? '');
  const [authorityDataUpdated, setAuthorityDataUpdated] = useState(false);

  useEffect(() => {
    // Setup aws-amplify
    if (!USE_MOCK_DATA) {
      Amplify.configure(awsConfig);
      Hub.listen('auth', (data) => {
        hubListener(data, dispatch);
      });
      return () => Hub.remove('auth', (data) => hubListener(data, dispatch));
    }
  }, [dispatch]);

  useEffect(() => {
    // Fetch attributes of authenticated user
    const getUser = async () => {
      const feideUser = await getCurrentUserAttributes();
      if (feideUser?.error) {
        dispatch(setNotification(feideUser.error, NotificationVariant.Error));
        setIsLoadingUser(false);
      } else if (feideUser) {
        dispatch(setUser(feideUser));
        // Wait with setting isLoadingUser to false until roles are loaded in separate useEffect
      }
    };

    if (USE_MOCK_DATA) {
      setUser(mockUser);
      setIsLoadingUser(false);
    } else {
      getUser();
    }
  }, [dispatch]);

  useEffect(() => {
    // Fetch logged in user's roles
    const getRoles = async () => {
      const userRoles: any = await getMyRoles(user.id);
      // {
      //   roles: [
      //     {
      //       rolename: 'test',
      //     },
      //   ],
      //   username: 'kjmo@unit.no',
      //   institution: 'https://api.cristin.no/v2/institutions/20202',
      // };
      if (userRoles.error) {
        dispatch(setNotification(userRoles.error, NotificationVariant.Error));
        setIsLoadingUser(false);
      } else if (userRoles) {
        const roles = (userRoles as UserRoles).roles.map((role) => role.rolename);
        dispatch(setRoles(roles));
        setIsLoadingUser(false);
      }
    };

    if (user?.id && !user.roles) {
      setTimeout(() => {
        getRoles();
      }, 1000);
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Update search term for fetching possible authorities
    if (user?.name && !authorities && !isLoadingAuthorities) {
      handleNewAuthoritiesSearchTerm(user.name);
    }
  }, [handleNewAuthoritiesSearchTerm, authorities, isLoadingAuthorities, user]);

  useEffect(() => {
    // Handle possible authorities
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
    // Avoid infinite loop by breaking when new data is identical to existing data
    if (user && !user.authority && user.possibleAuthorities !== authorities) {
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
        <AuthorityOrcidModal />
      )}
    </BrowserRouter>
  );
};

export default App;
