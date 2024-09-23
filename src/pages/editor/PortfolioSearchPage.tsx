import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useCustomerRegistrationSearch } from '../../api/hooks/useFetchCustomerRegistrationSearch';
import { SearchForm } from '../../components/SearchForm';
import { useRegistrationsQueryParams } from '../../utils/hooks/useRegistrationSearchParams';
import { RegistrationSearch } from '../search/registration_search/RegistrationSearch';

interface PortfolioSearchPageProps {
  title: string;
}

export const PortfolioSearchPage = ({ title }: PortfolioSearchPageProps) => {
  const { t } = useTranslation();
  const params = useRegistrationsQueryParams();
  const registrationQuery = useCustomerRegistrationSearch(params);

  return (
    <section>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {title}
      </Typography>
      <SearchForm placeholder={t('search.search_placeholder')} sx={{ my: '1rem' }} />
      <RegistrationSearch registrationQuery={registrationQuery} />
    </section>
  );
};
