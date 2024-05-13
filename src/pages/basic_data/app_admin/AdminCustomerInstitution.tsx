import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUsers } from '../../../api/roleApi';
import { PageHeader } from '../../../components/PageHeader';
import { PageSpinner } from '../../../components/PageSpinner';
import { CustomerInstitution } from '../../../types/customerInstitution.types';
import { RoleName } from '../../../types/user.types';
import { useFetch } from '../../../utils/hooks/useFetch';
import { CustomerInstitutionMetadataForm } from './CustomerInstitutionMetadataForm';

interface AdminCustomerInstitutionProps {
  customerId: string;
}

export const AdminCustomerInstitution = ({ customerId }: AdminCustomerInstitutionProps) => {
  const { t } = useTranslation();
  const editMode = customerId !== 'new';
  const [customerInstitution, isLoadingCustomerInstitution] = useFetch<CustomerInstitution>({
    url: editMode ? customerId : '',
    errorMessage: t('feedback.error.get_customer'),
    withAuthentication: true,
  });

  const adminsQuery = useQuery({
    queryKey: ['institutionAdmins', customerId],
    enabled: !!customerId,
    queryFn: () => (customerId ? fetchUsers(customerId, RoleName.InstitutionAdmin) : undefined),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });

  return (
    <>
      <PageHeader
        id="admin-institution-label"
        htmlTitle={editMode ? customerInstitution?.displayName : t('basic_data.institutions.add_institution')}>
        {editMode ? t('basic_data.institutions.edit_institution') : t('basic_data.institutions.add_institution')}
      </PageHeader>

      {isLoadingCustomerInstitution || adminsQuery.isPending ? (
        <PageSpinner aria-labelledby="admin-institution-label" />
      ) : (
        <>
          <CustomerInstitutionMetadataForm
            customerInstitution={customerInstitution}
            doiAgent={customerInstitution?.doiAgent}
            editMode={editMode}
          />
        </>
      )}
    </>
  );
};
