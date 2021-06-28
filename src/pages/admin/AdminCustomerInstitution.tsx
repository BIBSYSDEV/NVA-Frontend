import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { CustomerInstitution, emptyCustomerInstitution } from '../../types/customerInstitution.types';
import { PageSpinner } from '../../components/PageSpinner';
import { CustomerInstitutionAdminsForm } from './CustomerInstitutionAdminsForm';
import { CustomerInstitutionMetadataForm } from './CustomerInstitutionMetadataForm';
import { useFetch } from '../../utils/hooks/useFetch';
import { InstitutionUser } from '../../types/user.types';
import { RoleApiPath } from '../../api/apiPaths';

const StyledCustomerInstitution = styled.section`
  display: flex;
  flex-direction: column;
`;

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
  const [users, isLoadingUsers, refetchInstitutionUsers] = useFetch<InstitutionUser[]>({
    url: customerId ? `${RoleApiPath.InstitutionUsers}?institution=${encodeURIComponent(customerId)}` : '',
    errorMessage: t('feedback:error.get_users_for_institution'),
  });

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader htmlTitle={editMode ? customerInstitution?.displayName : t('add_institution')}>
        {t(editMode ? 'edit_institution' : 'add_institution')}
      </PageHeader>

      <StyledCustomerInstitution>
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
                users={users ?? []}
                refetchInstitutionUsers={refetchInstitutionUsers}
                isLoadingUsers={isLoadingUsers}
              />
            )}
          </>
        )}
      </StyledCustomerInstitution>
    </StyledPageWrapperWithMaxWidth>
  );
};
