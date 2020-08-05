import React, { FC, useEffect } from 'react';

import CustomerInstitutionMetadataForm from './CustomerInstitutionMetadataForm';
import CustomerInstitutionAdminsForm from './CustomerInstitutionAdminsForm';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';

import { emptyCustomerInstitution } from '../../types/customerInstitution.types';
import { useFetchCustomerInstitution } from '../../utils/hooks/useFetchCustomerInstitution';
import { CircularProgress } from '@material-ui/core';
import useFetchUsersForInstitution from '../../utils/hooks/useFetchUsersForInstitution';
import { RoleName } from '../../types/user.types';
import { filterUsersByRole } from '../../utils/role-helpers';

const StyledCustomerInstitution = styled.section`
  display: flex;
  flex-direction: column;
`;

const AdminCustomerInstitutionPage: FC = () => {
  const history = useHistory();
  const { identifier } = useParams();
  const currentLocation = history.location.pathname.split('/').pop() ?? '';
  const editMode = currentLocation !== 'new';
  const [customerInstitution, isLoadingCustomerInstitution, handleSetCustomerInstitution] = useFetchCustomerInstitution(
    currentLocation,
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
          />
          {editMode && <CustomerInstitutionAdminsForm admins={filterUsersByRole(users, RoleName.INSTITUTION_ADMIN)} />}
        </>
      )}
    </StyledCustomerInstitution>
  );
};

export default AdminCustomerInstitutionPage;
