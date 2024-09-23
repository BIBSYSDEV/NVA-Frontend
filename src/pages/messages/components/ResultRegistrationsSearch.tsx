import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useCustomerRegistrationSearch } from '../../../api/hooks/useFetchCustomerRegistrationSearch';
import { SearchForm } from '../../../components/SearchForm';
import { useRegistrationsQueryParams } from '../../../utils/hooks/useRegistrationSearchParams';
import { RegistrationSearch } from '../../search/registration_search/RegistrationSearch';

export const ResultRegistrationSearch = () => {
  const { t } = useTranslation();

  const params = useRegistrationsQueryParams();
  const registrationQuery = useCustomerRegistrationSearch(params);

  return (
    <section>
      <Helmet>
        <title>{t('common.result_registrations')}</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {t('common.result_registrations')}
      </Typography>
      <SearchForm placeholder={t('search.search_placeholder')} sx={{ my: '1rem' }} />
      <RegistrationSearch registrationQuery={registrationQuery} />
    </section>
  );
};
