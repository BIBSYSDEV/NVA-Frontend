import { useTranslation } from 'react-i18next';
import { RoleApiPath } from '../../../api/apiPaths';
import { PageHeader } from '../../../components/PageHeader';
import { PageSpinner } from '../../../components/PageSpinner';
import { CustomerInstitution } from '../../../types/customerInstitution.types';
import { RoleName, UserList } from '../../../types/user.types';
import { useFetch } from '../../../utils/hooks/useFetch';
import { filterUsersByRole } from '../../../utils/role-helpers';
import { CustomerInstitutionAdminsForm } from './CustomerInstitutionAdminsForm';
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

  const [userList, isLoadingUsers, refetchInstitutionUsers] = useFetch<UserList>({
    url: customerId ? `${RoleApiPath.InstitutionUsers}?institution=${encodeURIComponent(customerId)}` : '',
    errorMessage: t('feedback.error.get_users_for_institution'),
    withAuthentication: true,
  });
  const admins = filterUsersByRole(userList?.users ?? [], RoleName.InstitutionAdmin);

  return (
    <>
      <PageHeader
        id="admin-institution-label"
        htmlTitle={editMode ? customerInstitution?.displayName : t('basic_data.institutions.add_institution')}>
        {editMode ? t('basic_data.institutions.edit_institution') : t('basic_data.institutions.add_institution')}
      </PageHeader>

      {isLoadingCustomerInstitution || isLoadingUsers ? (
        <PageSpinner aria-labelledby="admin-institution-label" />
      ) : (
        <>
          <CustomerInstitutionMetadataForm
            customerInstitution={customerInstitution}
            doiAgent={customerInstitution?.doiAgent}
            editMode={editMode}
          />

          {editMode && customerInstitution && (
            <CustomerInstitutionAdminsForm
              admins={admins}
              refetchInstitutionUsers={refetchInstitutionUsers}
              cristinInstitutionId={customerInstitution.cristinId}
            />
          )}
        </>
      )}
    </>
  );
};
