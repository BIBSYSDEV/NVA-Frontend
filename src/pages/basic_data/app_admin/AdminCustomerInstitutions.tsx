import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/PageHeader';
import { InstitutionList } from './InstitutionList';
import { PageSpinner } from '../../../components/PageSpinner';
import { useFetch } from '../../../utils/hooks/useFetch';
import { CustomerList } from '../../../types/customerInstitution.types';
import { CustomerInstitutionApiPath } from '../../../api/apiPaths';
import { sortCustomerInstitutions } from '../../../utils/institutions-helpers';

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
          <InstitutionList institutions={sortCustomerInstitutions(customerInstitutions.customers)} />
        )
      )}
    </>
  );
};
