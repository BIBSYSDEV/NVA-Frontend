import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCustomerRegistrationSearch } from '../../api/hooks/useFetchCustomerRegistrationSearch';
import { ResultParam } from '../../api/searchApi';
import { SearchForm } from '../../components/filters/SearchForm';
import { HeadTitle } from '../../components/HeadTitle';
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
      <HeadTitle>{title}</HeadTitle>
      <Typography variant="h1" gutterBottom>
        {title}
      </Typography>
      <SearchForm
        placeholder={t('search.search_placeholder')}
        sx={{ my: '1rem' }}
        paginationOffsetParamName={ResultParam.From}
      />
      <RegistrationSearch registrationQuery={registrationQuery} />
    </section>
  );
};

export default PortfolioSearchPage;
