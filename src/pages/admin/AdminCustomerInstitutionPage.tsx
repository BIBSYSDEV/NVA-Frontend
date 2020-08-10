import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';

import CustomerInstitutionMetadataForm from './CustomerInstitutionMetadataForm';
import CustomerInstitutionAdminsForm from './CustomerInstitutionAdminsForm';
import { emptyCustomerInstitution } from '../../types/customerInstitution.types';
import { useFetchCustomerInstitution } from '../../utils/hooks/useFetchCustomerInstitution';
import useFetchUsersForInstitution from '../../utils/hooks/useFetchUsersForInstitution';

const StyledCustomerInstitution = styled.section`
  display: flex;
  flex-direction: column;
`;

const AdminCustomerInstitutionPage: FC = () => {
  const history = useHistory();
  const { identifier } = useParams();
  const editMode = identifier !== 'new';
  const [customerInstitution, isLoadingCustomerInstitution, handleSetCustomerInstitution] = useFetchCustomerInstitution(
    identifier,
    editMode
  );
  const [users, isLoadingUsers] = useFetchUsersForInstitution(editMode ? identifier : '');

  useEffect(() => {
    if (customerInstitution) {
      history.replace(`/admin-institutions/${customerInstitution.identifier}`, { title: customerInstitution.name });
    }
  }, [history, customerInstitution]);

  return (
    <StyledCustomerInstitution>
      {isLoadingCustomerInstitution || isLoadingUsers ? (
        <CircularProgress />
      ) : (
        <>
          <CustomerInstitutionMetadataForm
            customerInstitution={customerInstitution ?? emptyCustomerInstitution}
            handleSetCustomerInstitution={handleSetCustomerInstitution}
            editMode={editMode}
          />
          {editMode && <CustomerInstitutionAdminsForm users={users} />}
        </>
      )}
    </StyledCustomerInstitution>
  );
};

export default AdminCustomerInstitutionPage;
