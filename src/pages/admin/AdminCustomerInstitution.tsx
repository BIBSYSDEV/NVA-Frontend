import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import BackgroundDiv from '../../components/BackgroundDiv';
import { PageHeader } from '../../components/PageHeader';
import { emptyCustomerInstitution } from '../../types/customerInstitution.types';
import { useFetchCustomerInstitution } from '../../utils/hooks/useFetchCustomerInstitution';
import useFetchUsersForInstitution from '../../utils/hooks/useFetchUsersForInstitution';
import CustomerInstitutionAdminsForm from './CustomerInstitutionAdminsForm';
import CustomerInstitutionMetadataForm from './CustomerInstitutionMetadataForm';

const StyledCustomerInstitution = styled.section`
  display: flex;
  flex-direction: column;
`;

interface AdminCustomerInstitutionProps {
  customerId: string;
}

const AdminCustomerInstitution: FC<AdminCustomerInstitutionProps> = ({ customerId }) => {
  const { t } = useTranslation('admin');
  const editMode = customerId !== 'new';
  const [customerInstitution, isLoadingCustomerInstitution, handleSetCustomerInstitution] = useFetchCustomerInstitution(
    editMode ? customerId : ''
  );
  const [users, isLoadingUsers, refetchInstitutionUsers] = useFetchUsersForInstitution(editMode ? customerId : '');

  return (
    <BackgroundDiv>
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
    </BackgroundDiv>
  );
};

export default AdminCustomerInstitution;
