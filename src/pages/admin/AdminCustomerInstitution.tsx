import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
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

const AdminCustomerInstitution: FC = () => {
  const { t } = useTranslation('admin');
  const history = useHistory();
  const { identifier } = useParams();
  const editMode = identifier !== 'new';
  const [customerInstitution, isLoadingCustomerInstitution, handleSetCustomerInstitution] = useFetchCustomerInstitution(
    identifier,
    editMode
  );
  const [users, isLoadingUsers, refetchInstitutionUsers] = useFetchUsersForInstitution(editMode ? identifier : '');

  useEffect(() => {
    if (customerInstitution) {
      history.replace(`/admin-institutions/${customerInstitution.identifier}`, { title: customerInstitution.name });
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
