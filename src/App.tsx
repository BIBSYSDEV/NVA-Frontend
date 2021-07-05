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
import { Notifier } from './layout/Notifier';
import { AuthorityOrcidModal } from './pages/user/authority/AuthorityOrcidModal';
import { setNotification } from './redux/actions/notificationActions';
import { setAuthorityData, setPossibleAuthorities, setRoles, setUser } from './redux/actions/userActions';
import { RootStore } from './redux/reducers/rootReducer';
import { Authority } from './types/authority.types';
import { NotificationVariant } from './types/notification.types';
import { awsConfig } from './utils/aws-config';
import { isErrorStatus, isSuccessStatus, USE_MOCK_DATA } from './utils/constants';
import { mockUser } from './utils/testfiles/mock_feide_user';
import { PageSpinner } from './components/PageSpinner';
import { LanguageCodes } from './types/language.types';
import { SkipLink } from './components/SkipLink';
import { useFetch } from './utils/hooks/useFetch';
import { AuthorityApiPath } from './api/apiPaths';

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

export const App = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('feedback');
  const user = useSelector((store: RootStore) => store.user);
  const [isLoading, setIsLoading] = useState({ userAttributes: true, userRoles: true, userAuthority: true });
  const [matchingAuthorities, isLoadingMatchingAuthorities] = useFetch<Authority[]>({
    url: user?.name ? `${AuthorityApiPath.Person}?name=${encodeURIComponent(user.name)}` : '',
    errorMessage: t('feedback:error.get_authorities'),
  });

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
          setIsLoading({ userAttributes: false, userRoles: false, userAuthority: false });
        } else if (feideUser) {
          dispatch(setUser(feideUser));
        }
        setIsLoading((state) => ({ ...state, userAttributes: false }));
      } else {
        setIsLoading({ userAttributes: false, userRoles: false, userAuthority: false });
      }
    };

    if (USE_MOCK_DATA) {
      setUser(mockUser);
      setIsLoading({ userAttributes: false, userRoles: false, userAuthority: false });
    } else {
      getUser();
    }
  }, [dispatch]);

  useEffect(() => {
    // Fetch logged in user's roles
    const getRoles = async (userId: string) => {
      setIsLoading((state) => ({ ...state, userRoles: true }));
      const institutionUserResponse = await getInstitutionUser(userId);
      if (isErrorStatus(institutionUserResponse.status)) {
        dispatch(setNotification(t('feedback:error.get_roles'), NotificationVariant.Error));
      } else if (isSuccessStatus(institutionUserResponse.status)) {
        const roles = institutionUserResponse.data.roles.map((role) => role.rolename);
        dispatch(setRoles(roles));
      }
      setIsLoading((state) => ({ ...state, userRoles: false }));
    };

    if (user?.id && !user.roles) {
      getRoles(user.id);
    }
  }, [dispatch, t, user]);

  useEffect(() => {
    if (matchingAuthorities && user && !user.authority && !user.possibleAuthorities) {
      const fetchAuthority = async () => {
        const filteredAuthorities = matchingAuthorities.filter((auth) => auth.feideids.some((id) => id === user.id));
        if (filteredAuthorities.length === 1) {
          setIsLoading((state) => ({ ...state, userAuthority: true }));
          // Use exsisting authority
          const existingArpId = filteredAuthorities[0].id;
          const existingAuthorityResponse = await getAuthority(existingArpId);
          if (isErrorStatus(existingAuthorityResponse.status)) {
            dispatch(setNotification(t('error.get_authority'), NotificationVariant.Error));
          } else if (isSuccessStatus(existingAuthorityResponse.status) && existingAuthorityResponse.data) {
            let currentAuthority = existingAuthorityResponse.data;
            if (user.cristinId && !existingAuthorityResponse.data.orgunitids.includes(user.cristinId)) {
              // Add cristinId to Authority's orgunitids
              const authorityWithOrgId = await addQualifierIdForAuthority(
                existingArpId,
                AuthorityQualifiers.ORGUNIT_ID,
                user.cristinId
              );
              if (isErrorStatus(authorityWithOrgId.status)) {
                dispatch(
                  setNotification(
                    t('feedback:error.update_authority', { qualifier: t(`common:${AuthorityQualifiers.ORGUNIT_ID}`) }),
                    NotificationVariant.Error
                  )
                );
              } else if (isSuccessStatus(authorityWithOrgId.status)) {
                currentAuthority = authorityWithOrgId.data;
              }
            }
            dispatch(setAuthorityData(currentAuthority));
          }
        } else {
          dispatch(setPossibleAuthorities(matchingAuthorities));
        }
        setIsLoading((state) => ({ ...state, userAuthority: false }));
      };
      fetchAuthority();
    }
  }, [dispatch, t, matchingAuthorities, user]);

  return (
    <>
      <Helmet defaultTitle={t('common:page_title')} titleTemplate={`%s - ${t('common:page_title')}`}>
        <html lang={getLanguageTagValue(i18n.language)} />
      </Helmet>
      {Object.values(isLoading).some((isLoading) => isLoading) || isLoadingMatchingAuthorities ? (
        <PageSpinner />
      ) : (
        <BrowserRouter>
          <StyledApp>
            <Notifier />
            <SkipLink href="#main-content">{t('common:skip_to_main_content')}</SkipLink>
            <Header />
            <StyledMainContent id="main-content">
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
