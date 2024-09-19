import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useCustomerRegistrationSearch } from '../../api/hooks/useFetchCustomerRegistrationSearch';
import { useRegistrationsQueryParams } from '../../utils/hooks/useRegistrationSearchParams';
import { RegistrationSearch } from '../search/registration_search/RegistrationSearch';

export const EditorPortfolio = () => {
  const { t } = useTranslation();

  const params = useRegistrationsQueryParams();
  const registrationQuery = useCustomerRegistrationSearch({ params });

  return (
    <>
      <Helmet>
        <title>{t('common.result_portfolio')}</title>
      </Helmet>
      <Typography variant="h1">{t('common.result_portfolio')}</Typography>
      <RegistrationSearch registrationQuery={registrationQuery} />
    </>
  );
};
