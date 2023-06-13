import { Auth } from '@aws-amplify/auth';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { getDateFnsLocale } from './utils/date-helpers';
import { getCurrentUserAttributes } from './api/authApi';
import { AppRoutes } from './AppRoutes';
import { Footer } from './layout/Footer';
import { Header } from './layout/header/Header';
import { Notifier } from './layout/Notifier';
import { setNotification } from './redux/notificationSlice';
import { setUser } from './redux/userSlice';
import { RootState } from './redux/store';
import { authOptions } from './utils/aws-config';
import { LocalStorageKey, USE_MOCK_DATA } from './utils/constants';
import { mockUser } from './utils/testfiles/mock_feide_user';
import { PageSpinner } from './components/PageSpinner';
import { SkipLink } from './components/SkipLink';
import { UrlPathTemplate } from './utils/urlPaths';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SelectCustomerInstitutionDialog } from './components/SelectCustomerInstitutionDialog';
import { CreateCristinPersonDialog } from './components/CreateCristinPersonDialog';

const getLanguageTagValue = (language: string) => {
  if (language === 'eng') {
    return 'en';
  }
  return 'no';
};

if (
  window.location.pathname === UrlPathTemplate.MyPageMyPersonalia &&
  window.location.hash.startsWith('#access_token=')
) {
  // Workaround to allow adding orcid for aws-amplify > 4.2.2
  // Without this the user will be redirected to / for some reason
  window.location.href = window.location.href.replace('#', '?');
}

export const App = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [isLoadingUserAttributes, setIsLoadingUserAttributes] = useState(true);

  useEffect(() => {
    // Setup aws-amplify
    if (!USE_MOCK_DATA) {
      Auth.configure(authOptions);
    }
  }, []);

  const hasExpiredToken = !!localStorage.getItem(LocalStorageKey.ExpiredToken);
  useEffect(() => {
    // Handle expired token
    if (hasExpiredToken) {
      dispatch(setNotification({ message: t('authorization.expired_token_info'), variant: 'info' }));
      localStorage.removeItem(LocalStorageKey.ExpiredToken);
    }
  }, [t, dispatch, hasExpiredToken]);

  useEffect(() => {
    // Fetch attributes of authenticated user
    const getUser = async () => {
      const feideUser = await getCurrentUserAttributes();
      if (!feideUser) {
        // User is not authenticated
        setIsLoadingUserAttributes(false);
      } else {
        dispatch(setUser(feideUser));
      }
      setIsLoadingUserAttributes(false);
    };

    if (USE_MOCK_DATA) {
      setUser(mockUser);
      setIsLoadingUserAttributes(false);
    } else {
      getUser();
    }
  }, [dispatch]);

  const mustCreateperson = user && !user.cristinId;
  const mustSelectCustomer = user && user.cristinId && user.allowedCustomers.length > 1 && !user.customerId;

  return (
    <>
      <Helmet defaultTitle={t('common.page_title')} titleTemplate={`%s - ${t('common.page_title')}`}>
        <html lang={getLanguageTagValue(i18n.language)} />
      </Helmet>

      {mustCreateperson && <CreateCristinPersonDialog user={user} />}
      {mustSelectCustomer && <SelectCustomerInstitutionDialog allowedCustomerIds={user.allowedCustomers} />}

      {isLoadingUserAttributes ? (
        <PageSpinner aria-label={t('common.page_title')} />
      ) : (
        <BrowserRouter>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Notifier />
            <SkipLink href="#main-content">{t('common.skip_to_main_content')}</SkipLink>
            <Header />
            <Box
              component="main"
              id="main-content"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
                flexGrow: 1,
              }}>
              <ErrorBoundary>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getDateFnsLocale(i18n.language)}>
                  <AppRoutes />
                </LocalizationProvider>
              </ErrorBoundary>
            </Box>
            <Footer />
          </Box>
        </BrowserRouter>
      )}
    </>
  );
};
