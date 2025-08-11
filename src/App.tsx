import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { getCustomUserAttributes } from './api/authApi';
import { AppRoutes } from './AppRoutes';
import { AcceptTermsDialog } from './components/AcceptTermsDialog';
import { CreateCristinPersonDialog } from './components/CreateCristinPersonDialog';
import { PageSpinner } from './components/PageSpinner';
import { SelectCustomerInstitutionDialog } from './components/SelectCustomerInstitutionDialog';
import { useMatomoTracking } from './matomo/useMatomoTracking';
import { setNotification } from './redux/notificationSlice';
import { RootState } from './redux/store';
import { setUser } from './redux/userSlice';
import { authOptions } from './utils/aws-config';
import { USE_MOCK_DATA } from './utils/constants';
import { getMaintenanceInfo } from './utils/status-message-helpers';
import { mockUser } from './utils/testfiles/mock_feide_user';
import { UrlPathTemplate } from './utils/urlPaths';

const MaintenanceModeApp = lazy(() => import('./MaintenanceModeApp'));

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
  const dispatch = useDispatch();
  const { t } = useTranslation();
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

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signInWithRedirect_failure') {
        dispatch(
          setNotification({
            message: t('feedback.error.login_failed'),
            variant: 'error',
            detail: payload.data.error?.message,
          })
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, t]);

  const mustAcceptTerms = user && user.currentTerms !== user.acceptedTerms;
  const mustCreatePerson = user && !user.cristinId && !mustAcceptTerms;
  const mustSelectCustomer =
    user && !mustAcceptTerms && user.cristinId && user.allowedCustomers.length > 1 && !user.customerId;

  return (
    <>
      {mustAcceptTerms && <AcceptTermsDialog newTermsUri={user.currentTerms} />}
      {mustCreatePerson && <CreateCristinPersonDialog user={user} />}
      {mustSelectCustomer && <SelectCustomerInstitutionDialog allowedCustomerIds={user.allowedCustomers} />}

      {isLoadingUserAttributes ? <PageSpinner aria-label={t('common.page_title')} /> : <AppRoutes />}
    </>
  );
};

export const App = () => {
  useMatomoTracking();
  const { t } = useTranslation();
  const maintenanceInfo = getMaintenanceInfo();

  return (
    <Suspense fallback={<PageSpinner aria-label={t('common.page_title')} />}>
      {maintenanceInfo ? (
        <RouterProvider router={createBrowserRouter([{ path: '*', element: <MaintenanceModeApp /> }])} />
      ) : (
        <RouterProvider router={createBrowserRouter([{ path: '*', element: <Root /> }])} />
      )}
    </Suspense>
  );
};
