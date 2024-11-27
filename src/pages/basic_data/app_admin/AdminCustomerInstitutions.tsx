import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { CustomerInstitutionApiPath } from '../../../api/apiPaths';
import { PageHeader } from '../../../components/PageHeader';
import { PageSpinner } from '../../../components/PageSpinner';
import { CustomerList } from '../../../types/customerInstitution.types';
import { useFetch } from '../../../utils/hooks/useFetch';
import { sortCustomerInstitutions } from '../../../utils/institutions-helpers';
import { SearchTextField } from '../../search/SearchTextField';
import { InstitutionList } from './InstitutionList';

export const AdminCustomerInstitutions = () => {
  const { t } = useTranslation();
  const [customerInstitutions, isLoadingCustomerInstitutions] = useFetch<CustomerList>({
    url: CustomerInstitutionApiPath.Customer,
    withAuthentication: true,
    errorMessage: t('feedback.error.get_customers'),
  });

  return (
    <>
      <PageHeader id="admin-institutions-label">{t('basic_data.institutions.admin_institutions')}</PageHeader>
      {isLoadingCustomerInstitutions ? (
        <PageSpinner aria-labelledby="admin-institutions-label" />
      ) : (
        customerInstitutions && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <SearchTextField />
            <InstitutionList institutions={sortCustomerInstitutions(customerInstitutions.customers)} />
          </Box>
        )
      )}
    </>
  );
};
