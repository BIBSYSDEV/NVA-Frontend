import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useCustomerRegistrationSearch } from '../../api/hooks/useFetchCustomerRegistrationSearch';
import { useRegistrationsQueryParams } from '../../utils/hooks/useRegistrationSearchParams';
import { RegistrationSearch } from '../search/registration_search/RegistrationSearch';

interface PortfolioSearchPageProps {
  title: string;
}

export const PortfolioSearchPage = ({ title }: PortfolioSearchPageProps) => {
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
      <RegistrationSearch registrationQuery={registrationQuery} />
    </section>
  );
};
