import Amplify from 'aws-amplify';
import React, { useEffect, useState, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import { getCurrentUserAttributes } from './api/userApi';
import Footer from './layout/Footer';
import Header from './layout/header/Header';
import Notifier from './layout/Notifier';
import AuthorityOrcidModal from './pages/user/authority/AuthorityOrcidModal';
import { setUser, setRoles } from './redux/actions/userActions';
import { RootStore } from './redux/reducers/rootReducer';
import { awsConfig } from './utils/aws-config';
import { USE_MOCK_DATA } from './utils/constants';
import { mockUser } from './utils/testfiles/mock_feide_user';
import AppRoutes from './AppRoutes';
import { setNotification } from './redux/actions/notificationActions';
import { getInstitutionUser } from './api/roleApi';
import { NotificationVariant } from './types/notification.types';
import { InstitutionUser } from './types/user.types';
import useFetchCurrentAuthority from './utils/hooks/useFetchCurrentAuthority';

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
  useFetchCurrentAuthority();

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
          setIsLoadingUser(false);
        } else if (feideUser) {
          dispatch(setUser(feideUser));
          // Wait with setting isLoadingUser to false until roles are loaded in separate useEffect,
          // which will be trigged when user is updated in redux
        }
      } else {
        setIsLoadingUser(false);
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
      const institutionUser = await getInstitutionUser(user.id);
      if (institutionUser) {
        if (institutionUser.error) {
          dispatch(setNotification(institutionUser.error, NotificationVariant.Error));
        } else {
          const roles = (institutionUser as InstitutionUser).roles.map((role) => role.rolename);
          dispatch(setRoles(roles));
        }
        setIsLoadingUser(false);
      }
    };

    if (user?.id && !user.roles) {
      getRoles();
    }
  }, [dispatch, user]);

  return isLoadingUser ? (
    <ProgressContainer>
      <CircularProgress />
    </ProgressContainer>
  ) : (
    <BrowserRouter>
      <StyledApp>
        <Notifier />
        <Header />
        <StyledContent>
          <AppRoutes />
        </StyledContent>
        <Footer />
      </StyledApp>
      {user && (user.authority || user.possibleAuthorities) && <AuthorityOrcidModal />}
    </BrowserRouter>
  );
};

export default App;
