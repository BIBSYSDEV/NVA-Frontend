import { useTranslation } from 'react-i18next';
import { RoleApiPath } from '../../../api/apiPaths';
import { PageHeader } from '../../../components/PageHeader';
import { PageSpinner } from '../../../components/PageSpinner';
import { SyledPageContent } from '../../../components/styled/Wrappers';
import { CustomerInstitution, emptyCustomerInstitution } from '../../../types/customerInstitution.types';
import { UserList } from '../../../types/user.types';
import { useFetch } from '../../../utils/hooks/useFetch';
import { CustomerInstitutionAdminsForm } from './CustomerInstitutionAdminsForm';
import { CustomerInstitutionMetadataForm } from './CustomerInstitutionMetadataForm';

interface AdminCustomerInstitutionProps {
  customerId: string;
}

export const AdminCustomerInstitution = ({ customerId }: AdminCustomerInstitutionProps) => {
  const { t } = useTranslation('admin');
  const editMode = customerId !== 'new';
  const [customerInstitution, isLoadingCustomerInstitution] = useFetch<CustomerInstitution>({
    url: editMode ? customerId : '',
    errorMessage: t('feedback:error.get_customer'),
    withAuthentication: true,
  });
  const [userList, isLoadingUsers, refetchInstitutionUsers] = useFetch<UserList>({
    url: customerId ? `${RoleApiPath.InstitutionUsers}?institution=${encodeURIComponent(customerId)}` : '',
    errorMessage: t('feedback:error.get_users_for_institution'),
    withAuthentication: true,
  });

  return (
    <SyledPageContent>
      <PageHeader htmlTitle={editMode ? customerInstitution?.displayName : t('add_institution')}>
        {t(editMode ? 'edit_institution' : 'add_institution')}
      </PageHeader>

      {isLoadingCustomerInstitution ? (
        <PageSpinner />
      ) : (
        <>
          <CustomerInstitutionMetadataForm
            customerInstitution={customerInstitution ?? emptyCustomerInstitution}
            editMode={editMode}
          />
          {editMode && (
            <CustomerInstitutionAdminsForm
              users={userList?.users ?? []}
              refetchInstitutionUsers={refetchInstitutionUsers}
              isLoadingUsers={isLoadingUsers}
            />
          )}
        </>
      )}
    </SyledPageContent>
  );
};
