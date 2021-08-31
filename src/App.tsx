import Amplify from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { addQualifierIdForAuthority, AuthorityQualifiers } from './api/authorityApi';
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
import { AuthorityApiPath, RoleApiPath } from './api/apiPaths';
import { InstitutionUser } from './types/user.types';

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
  const [isLoading, setIsLoading] = useState({ userAttributes: true, userAuthority: true });

  const [authoritiesById, isLoadingAuthoritiesById] = useFetch<Authority[]>({
    url: user?.id ? `${AuthorityApiPath.Person}?feideid=${encodeURIComponent(user.id)}` : '',
    errorMessage: t('feedback:error.get_authorities'),
  });

  const [authoritiesByName, isLoadingAuthoritiesByName] = useFetch<Authority[]>({
    url:
      authoritiesById?.length === 0 && user?.name
        ? `${AuthorityApiPath.Person}?name=${encodeURIComponent(user.name)}`
        : '',
    errorMessage: t('feedback:error.get_authorities'),
  });

  const [institutionUser, isLoadingInstitutionUser] = useFetch<InstitutionUser>({
    url: user?.id && !user.roles ? `${RoleApiPath.Users}/${encodeURIComponent(user.id)}` : '',
    errorMessage: t('feedback:error.get_roles'),
    withAuthentication: true,
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
      if (!feideUser) {
        // User is not authenticated
        setIsLoading({ userAttributes: false, userAuthority: false });
      } else {
        dispatch(setUser(feideUser));
      }
      setIsLoading((state) => ({ ...state, userAttributes: false }));
    };

    if (USE_MOCK_DATA) {
      setUser(mockUser);
      setIsLoading({ userAttributes: false, userAuthority: false });
    } else {
      getUser();
    }
  }, [dispatch]);

  useEffect(() => {
    if (user && !user.roles && institutionUser) {
      const roles = institutionUser.roles.map((role) => role.rolename);
      dispatch(setRoles(roles));
    }
  }, [dispatch, institutionUser, user]);

  useEffect(() => {
    if (authoritiesById && user && !user.authority && !user.possibleAuthorities) {
      if (authoritiesById.length === 1) {
        const authority = authoritiesById[0];
        dispatch(setAuthorityData(authority));
        const addQualifier = async () => {
          if (user.cristinId && !authority.orgunitids.includes(user.cristinId)) {
            // Add cristinId to Authority's orgunitids
            const authorityWithOrgId = await addQualifierIdForAuthority(
              authority.id,
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
              dispatch(setAuthorityData(authority));
            } else if (isSuccessStatus(authorityWithOrgId.status)) {
              dispatch(setAuthorityData(authorityWithOrgId.data));
            }
          }
        };
        addQualifier();
      } else if (authoritiesById.length > 1) {
        dispatch(setPossibleAuthorities(authoritiesById));
      }
    }
    setIsLoading((state) => ({ ...state, userAuthority: false }));
  }, [dispatch, t, authoritiesById, user]);

  useEffect(() => {
    if (authoritiesByName && user && !user.authority && !user.possibleAuthorities) {
      dispatch(setPossibleAuthorities(authoritiesByName));
    }
  }, [dispatch, t, authoritiesByName, user]);

  return (
    <>
      <Helmet defaultTitle={t('common:page_title')} titleTemplate={`%s - ${t('common:page_title')}`}>
        <html lang={getLanguageTagValue(i18n.language)} />
      </Helmet>
      {Object.values(isLoading).some((isLoading) => isLoading) ||
      isLoadingAuthoritiesById ||
      isLoadingAuthoritiesByName ||
      isLoadingInstitutionUser ? (
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
          {user && (user.authority || user.possibleAuthorities) && <AuthorityOrcidModal user={user} />}
        </BrowserRouter>
      )}
    </>
  );
};
