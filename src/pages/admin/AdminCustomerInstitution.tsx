import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import CustomerInstitutionMetadataForm from './CustomerInstitutionMetadataForm';
import CustomerInstitutionAdminsForm from './CustomerInstitutionAdminsForm';
import { emptyCustomerInstitution } from '../../types/customerInstitution.types';
import { useFetchCustomerInstitution } from '../../utils/hooks/useFetchCustomerInstitution';
import useFetchUsersForInstitution from '../../utils/hooks/useFetchUsersForInstitution';
import { PageHeader } from '../../components/PageHeader';

const StyledCustomerInstitution = styled.section`
  display: flex;
  flex-direction: column;
`;

interface AdminCustomerInstitutionProps {
  customerId: string;
}

const AdminCustomerInstitution: FC<AdminCustomerInstitutionProps> = ({ customerId }) => {
  const { t } = useTranslation('admin');
  const history = useHistory();
  const editMode = customerId !== 'new';
  const [customerInstitution, isLoadingCustomerInstitution, handleSetCustomerInstitution] = useFetchCustomerInstitution(
    editMode ? customerId : ''
  );
  const [users, isLoadingUsers, refetchInstitutionUsers] = useFetchUsersForInstitution(editMode ? customerId : '');

  useEffect(() => {
    if (customerInstitution) {
      // history.replace(`/admin-institutions?id=${customerInstitution.identifier}`, { title: customerInstitution.name });
    }
  }, [history, customerInstitution]);

  return (
    <>
      <PageHeader>{t(editMode ? 'edit_institution' : 'add_institution')}</PageHeader>
      <StyledCustomerInstitution>
        {isLoadingCustomerInstitution ? (
          <CircularProgress />
        ) : (
          <>
            <CustomerInstitutionMetadataForm
              customerInstitution={customerInstitution ?? emptyCustomerInstitution}
              handleSetCustomerInstitution={handleSetCustomerInstitution}
              editMode={editMode}
            />
            {editMode && (
              <CustomerInstitutionAdminsForm
                users={users}
                refetchInstitutionUsers={refetchInstitutionUsers}
                isLoadingUsers={isLoadingUsers}
              />
            )}
          </>
        )}
      </StyledCustomerInstitution>
    </>
  );
};

export default AdminCustomerInstitution;
