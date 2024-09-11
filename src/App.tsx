import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Amplify } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { getUserAttributes } from './api/authApi';
import { CreateCristinPersonDialog } from './components/CreateCristinPersonDialog';
import { EnvironmentBanner } from './components/EnvironmentBanner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageSpinner } from './components/PageSpinner';
import { SelectCustomerInstitutionDialog } from './components/SelectCustomerInstitutionDialog';
import { SkipLink } from './components/SkipLink';
import { Footer } from './layout/Footer';
import { Notifier } from './layout/Notifier';
import { Header } from './layout/header/Header';
import { useMatomoTracking } from './matomo/useMatomoTracking';
import { RootState } from './redux/store';
import { setUser } from './redux/userSlice';
import { authOptions } from './utils/aws-config';
import { USE_MOCK_DATA } from './utils/constants';
import { getDateFnsLocale, getDatePickerLocaleText } from './utils/date-helpers';
import { mockUser } from './utils/testfiles/mock_feide_user';
import { UrlPathTemplate } from './utils/urlPaths';

const getLanguageTagValue = (language: string) => {
  if (language === 'eng') {
    return 'en';
  }
  return 'no';
};

if (
  (window.location.pathname === UrlPathTemplate.MyPagePersonalia ||
    window.location.pathname === UrlPathTemplate.MyPageResearchProfile) &&
  window.location.hash.startsWith('#access_token=')
) {
  // Workaround to allow adding orcid for aws-amplify > 4.2.2
  // Without this the user will be redirected to / for some reason
  window.location.href = window.location.href.replace('#', '?');
}

export const App = () => {
  useMatomoTracking();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const [isLoadingUserAttributes, setIsLoadingUserAttributes] = useState(true);

  useEffect(() => {
    // Setup aws-amplify
    if (!USE_MOCK_DATA) {
      Amplify.configure(authOptions);
    }
  }, []);

  useEffect(() => {
    // Fetch attributes of authenticated user
    const getUser = async () => {
      const feideUser = await getUserAttributes();
      if (feideUser) {
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

  const mustCreatePerson = user && !user.cristinId;
  const mustSelectCustomer = user && user.cristinId && user.allowedCustomers.length > 1 && !user.customerId;

  return (
    <>
      <Helmet defaultTitle={t('common.page_title')} titleTemplate={`%s - ${t('common.page_title')}`}>
        <html lang={getLanguageTagValue(i18n.language)} />
      </Helmet>

      {mustCreatePerson && <CreateCristinPersonDialog user={user} />}
      {mustSelectCustomer && <SelectCustomerInstitutionDialog allowedCustomerIds={user.allowedCustomers} />}

      {isLoadingUserAttributes ? (
        <PageSpinner aria-label={t('common.page_title')} />
      ) : (
        <BrowserRouter>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Notifier />
            <SkipLink href="#main-content">{t('common.skip_to_main_content')}</SkipLink>
            <Header />
            <EnvironmentBanner />
            <Box
              component="main"
              id="main-content"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
                flexGrow: 1,
                mb: '0.5rem',
              }}>
              <ErrorBoundary>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={getDateFnsLocale(i18n.language)}
                  dateFormats={{ keyboardDate: 'dd.MM.yyyy' }}
                  localeText={getDatePickerLocaleText(i18n.language)}>
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
