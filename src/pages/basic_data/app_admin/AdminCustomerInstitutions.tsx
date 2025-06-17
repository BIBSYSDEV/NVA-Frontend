import { useTranslation } from 'react-i18next';
import { useFetchCustomers } from '../../../api/hooks/useFetchCustomers';
import { PageHeader } from '../../../components/PageHeader';
import { PageSpinner } from '../../../components/PageSpinner';
import { sortCustomerInstitutions } from '../../../utils/institutions-helpers';
import { CustomerInstitutionList } from './CustomerInstitutionList';

export const AdminCustomerInstitutions = () => {
  const { t } = useTranslation();

  const customersQuery = useFetchCustomers();
  const customers = customersQuery.data?.data.customers ?? [];

  return (
    <>
      <PageHeader id="admin-institutions-label">{t('basic_data.institutions.admin_institutions')}</PageHeader>
      {customersQuery.isPending ? (
        <PageSpinner aria-labelledby="admin-institutions-label" />
      ) : (
        customers && <CustomerInstitutionList customerInstitutions={sortCustomerInstitutions(customers)} />
      )}
    </>
  );
};
