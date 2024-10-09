import { Button, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useCustomerRegistrationSearch } from '../../api/hooks/useFetchCustomerRegistrationSearch';
import { BetaFunctionality } from '../../components/BetaFunctionality';
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
      <BetaFunctionality>
        <Button
          onClick={() => {
            throw new Error();
          }}>
          Default Error
        </Button>
        <Button
          onClick={() => {
            throw new Error('Custom error text');
          }}>
          Custom Error
        </Button>
        <Button
          onClick={() => {
            new Promise((resolve, reject) => {
              reject('Reject promise!');
            });
          }}>
          Reject promise
        </Button>
      </BetaFunctionality>
      <Typography variant="h1" gutterBottom>
        {title}
      </Typography>
      <SearchForm placeholder={t('search.search_placeholder')} sx={{ my: '1rem' }} />
      <RegistrationSearch registrationQuery={registrationQuery} />
    </section>
  );
};
