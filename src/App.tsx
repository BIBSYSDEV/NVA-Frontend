import Amplify from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { addQualifierIdForAuthority, AuthorityQualifiers, getAuthority } from './api/authorityApi';
import { getInstitutionUser } from './api/roleApi';
import { getCurrentUserAttributes } from './api/userApi';
import { AppRoutes } from './AppRoutes';
import { Footer } from './layout/Footer';
import { Header } from './layout/header/Header';
import Notifier from './layout/Notifier';
import AuthorityOrcidModal from './pages/user/authority/AuthorityOrcidModal';
import { setNotification } from './redux/actions/notificationActions';
import { setAuthorityData, setPossibleAuthorities, setRoles, setUser } from './redux/actions/userActions';
import { RootStore } from './redux/reducers/rootReducer';
import { Authority } from './types/authority.types';
import { NotificationVariant } from './types/notification.types';
import { InstitutionUser } from './types/user.types';
import { awsConfig } from './utils/aws-config';
import { USE_MOCK_DATA } from './utils/constants';
import useFetchAuthorities from './utils/hooks/useFetchAuthorities';
import { mockUser } from './utils/testfiles/mock_feide_user';
import { PageSpinner } from './components/PageSpinner';
import { LanguageCodes } from './types/language.types';

const StyledApp = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledMainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 100%;
  align-items: center;
  flex-grow: 1;
`;

const getLanguageTagValue = (language: string) => {
  if (language === LanguageCodes.ENGLISH) {
    return 'en';
  }
  return 'no';
};

const App = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('feedback');
  const user = useSelector((store: RootStore) => store.user);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [matchingAuthorities, isLoadingMatchingAuthorities] = useFetchAuthorities(user?.name ?? '');

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
    const getRoles = async (userId: string) => {
      const institutionUser = await getInstitutionUser(userId);
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
      getRoles(user.id);
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (matchingAuthorities && user && !user.authority && !user.possibleAuthorities) {
      const fetchAuthority = async () => {
        const filteredAuthorities = matchingAuthorities.filter((auth) => auth.feideids.some((id) => id === user.id));
        if (filteredAuthorities.length === 1) {
          // Use exsisting authority
          const existingArpId = filteredAuthorities[0].id;
          const existingAuthority = await getAuthority(existingArpId);
          if (existingAuthority?.error) {
            dispatch(setNotification(t('error.get_authority'), NotificationVariant.Error));
          } else if (existingAuthority?.data) {
            let currentAuthority = existingAuthority.data;
            if (user.cristinId && !existingAuthority.data.orgunitids.includes(user.cristinId)) {
              // Add cristinId to Authority's orgunitids
              const authorityWithOrgId = await addQualifierIdForAuthority(
                existingArpId,
                AuthorityQualifiers.ORGUNIT_ID,
                user.cristinId
              );
              if (authorityWithOrgId?.error) {
                dispatch(setNotification(authorityWithOrgId.error, NotificationVariant.Error));
              } else {
                currentAuthority = authorityWithOrgId as Authority;
              }
            }
            dispatch(setAuthorityData(currentAuthority));
          }
        } else {
          dispatch(setPossibleAuthorities(matchingAuthorities));
        }
      };
      fetchAuthority();
    }
  }, [dispatch, t, matchingAuthorities, user]);

  return (
    <>
      <Helmet>
        <html lang={getLanguageTagValue(i18n.language)} />
      </Helmet>
      {isLoadingUser ? (
        <PageSpinner />
      ) : (
        <BrowserRouter>
          <StyledApp>
            <Notifier />
            <Header />
            <StyledMainContent>
              <AppRoutes />
            </StyledMainContent>
            <Footer />
          </StyledApp>
          {user && !isLoadingMatchingAuthorities && (user.authority || user.possibleAuthorities) && (
            <AuthorityOrcidModal user={user} />
          )}
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
