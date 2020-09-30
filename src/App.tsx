import Amplify from 'aws-amplify';
import React, { useEffect, useState, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import { AuthorityQualifiers, addQualifierIdForAuthority, getAuthority } from './api/authorityApi';
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
import { USE_MOCK_DATA } from './utils/constants';
import { mockUser } from './utils/testfiles/mock_feide_user';
import AppRoutes from './AppRoutes';
import useFetchAuthorities from './utils/hooks/useFetchAuthorities';
import { setNotification } from './redux/actions/notificationActions';
import { NotificationVariant } from './types/notification.types';

const StyledApp = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 100%;
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
  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.user);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [authorities, isLoadingAuthorities, handleNewAuthoritiesSearchTerm] = useFetchAuthorities(user?.name ?? '');
  const [authorityDataUpdated, setAuthorityDataUpdated] = useState(false);

  useEffect(() => {
    // Setup aws-amplify
    if (!USE_MOCK_DATA) {
      Amplify.configure(awsConfig);
    }
  }, []);

  useEffect(() => {
    // Fetch attributes of authenticated user
    const getUser = async () => {
      const feideUser = await getCurrentUserAttributes();
      if (feideUser) {
        if (feideUser.error) {
          dispatch(setNotification(feideUser.error, NotificationVariant.Error));
        } else if (feideUser) {
          dispatch(setUser(feideUser));
        }
      }
      setIsLoadingUser(false);
    };

    if (USE_MOCK_DATA) {
      setUser(mockUser);
      setIsLoadingUser(false);
    } else {
      getUser();
    }
  }, [dispatch]);

  useEffect(() => {
    // Update search term for fetching possible authorities
    if (user?.name && user.customerId && !authorities && !isLoadingAuthorities) {
      handleNewAuthoritiesSearchTerm(user.name);
    }
  }, [handleNewAuthoritiesSearchTerm, authorities, isLoadingAuthorities, user]);

  useEffect(() => {
    // Handle possible authorities
    const fetchAuthority = async () => {
      if (authorities) {
        const filteredAuthorities: Authority[] = authorities.filter((auth: Authority) =>
          auth.feideids.some((id) => id === user.id)
        );
        if (filteredAuthorities.length === 1 && user?.cristinId) {
          const existingScn = filteredAuthorities[0].systemControlNumber;
          const existingAuthority: Authority = await getAuthority(existingScn);
          if (existingAuthority.orgunitids.includes(user.cristinId)) {
            dispatch(setAuthorityData(existingAuthority));
          } else {
            const updatedAuthority = await addQualifierIdForAuthority(
              existingScn,
              AuthorityQualifiers.ORGUNIT_ID,
              user.cristinId
            );
            if (updatedAuthority?.error) {
              dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
            } else {
              dispatch(setAuthorityData(updatedAuthority));
            }
          }
        } else {
          dispatch(setPossibleAuthorities(authorities));
        }
        setAuthorityDataUpdated(true);
      }
    };
    // Avoid infinite loop by breaking when new data is identical to existing data
    if (user?.customerId && !user.authority && user.possibleAuthorities !== authorities) {
      fetchAuthority();
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
      {!isLoadingAuthorities && authorityDataUpdated && user?.customerId && <AuthorityOrcidModal />}
    </BrowserRouter>
  );
};

export default App;
