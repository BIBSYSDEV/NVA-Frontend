import { Autocomplete, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { CustomerInstitutionApiPath } from '../api/apiPaths';
import { PageHeader } from '../components/PageHeader';
import { SyledPageContent } from '../components/styled/Wrappers';
import { RootStore } from '../redux/reducers/rootReducer';
import { CustomerList } from '../types/customerInstitution.types';
import { LocalStorageKey } from '../utils/constants';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { useFetch } from '../utils/hooks/useFetch';
import { sortCustomerInstitutions } from '../utils/institutions-helpers';
import { UrlPathTemplate } from '../utils/urlPaths';

export interface PreviousPathState {
  previousPath?: string;
}

const LoginPage = () => {
  const { t } = useTranslation('authorization');
  const user = useSelector((store: RootStore) => store.user);
  const location = useLocation<PreviousPathState>();
  const { handleLogin } = useAuthentication();
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerResponse, isLoadingCustomers] = useFetch<CustomerList>({
    url: CustomerInstitutionApiPath.Customer,
    errorMessage: t('feedback:error.get_customers'),
  });

  if (user) {
    return <Redirect to={UrlPathTemplate.Home} />;
  }

  const betaEnabled = localStorage.getItem(LocalStorageKey.Beta) === 'true';
  const redirectPath = location.state?.previousPath ?? UrlPathTemplate.Home;

  if (!betaEnabled) {
    localStorage.setItem(LocalStorageKey.RedirectPath, redirectPath);
    handleLogin();
    return null;
  }

  return (
    <SyledPageContent>
      <PageHeader>{t('login')}</PageHeader>

      <Typography variant="h2" paragraph>
        {t('select_institution')}
      </Typography>
      <Autocomplete
        options={sortCustomerInstitutions(customerResponse?.customers)}
        getOptionLabel={(option) => option.displayName}
        loading={isLoadingCustomers}
        onChange={(_, value) => setSelectedCustomerId(value?.id ?? '')}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{
              'aria-label': t('select_institution'),
            }}
            placeholder={t('project:search_for_institution')}
            sx={{ maxWidth: '40rem' }}
            fullWidth
          />
        )}
      />

      {selectedCustomerId && (
        <>
          <Typography variant="h2" paragraph sx={{ mt: '2rem' }}>
            {t('login_with_feide')}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              localStorage.setItem(LocalStorageKey.RedirectPath, redirectPath);
              localStorage.setItem(LocalStorageKey.LoginInstitutionId, selectedCustomerId);
              handleLogin();
            }}>
            {t('login')}
          </Button>
        </>
      )}
    </SyledPageContent>
  );
};

export default LoginPage;
