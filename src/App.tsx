import { Box, Typography } from '@mui/material';
import { Amplify } from 'aws-amplify';
import { Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router';
import { getCustomUserAttributes } from './api/authApi';
import { AppRoutes } from './AppRoutes';
import { AcceptTermsDialog } from './components/AcceptTermsDialog';
import { CreateCristinPersonDialog } from './components/CreateCristinPersonDialog';
import { PageSpinner } from './components/PageSpinner';
import { SelectCustomerInstitutionDialog } from './components/SelectCustomerInstitutionDialog';
import { Layout } from './Layout';
import { useMatomoTracking } from './matomo/useMatomoTracking';
import { RootState } from './redux/store';
import { setUser } from './redux/userSlice';
import { authOptions } from './utils/aws-config';
import { USE_MOCK_DATA } from './utils/constants';
import { useMaintenanceInfo } from './utils/hooks/useMaintenanceInfo';
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

const Root = () => {
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
    const getUser = async () => {
      const customUserAttributes = await getCustomUserAttributes();
      if (customUserAttributes) {
        dispatch(setUser(customUserAttributes));
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

  const mustAcceptTerms = user && user.currentTerms !== user.acceptedTerms;
  const mustCreatePerson = user && !user.cristinId && !mustAcceptTerms;
  const mustSelectCustomer =
    user && !mustAcceptTerms && user.cristinId && user.allowedCustomers.length > 1 && !user.customerId;

  return (
    <>
      <Helmet defaultTitle={t('common.page_title')} titleTemplate={`%s - ${t('common.page_title')}`}>
        <html lang={getLanguageTagValue(i18n.language)} />
      </Helmet>

      {mustAcceptTerms && <AcceptTermsDialog newTermsUri={user.currentTerms} />}
      {mustCreatePerson && <CreateCristinPersonDialog user={user} />}
      {mustSelectCustomer && <SelectCustomerInstitutionDialog allowedCustomerIds={user.allowedCustomers} />}

      {isLoadingUserAttributes ? <PageSpinner aria-label={t('common.page_title')} /> : <AppRoutes />}
    </>
  );
};

const router = createBrowserRouter([{ path: '*', element: <Root /> }]);

export const App = () => {
  const { t } = useTranslation();
  const maintenaneInfo = useMaintenanceInfo();

  return (
    <Suspense fallback={<PageSpinner aria-label={t('common.page_title')} />}>
      {maintenaneInfo ? (
        <RouterProvider router={createBrowserRouter([{ path: '*', element: <StatusPageRouter /> }])} />
      ) : (
        <RouterProvider router={router} />
      )}
    </Suspense>
  );
};

const StatusPageRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="*"
          element={
            <Box sx={{ my: '2rem' }}>
              <Typography variant="h1" gutterBottom>
                {import.meta.env.VITE_STATUS_HEADING_NB}
              </Typography>
              <Typography>{import.meta.env.VITE_STATUS_DESCRIPTION_NB}</Typography>
            </Box>
          }
        />
      </Route>
    </Routes>
  );
};
