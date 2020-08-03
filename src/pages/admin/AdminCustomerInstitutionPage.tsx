import React, { FC, useEffect } from 'react';

import CustomerInstitutionMetadataForm from './CustomerInstitutionMetadataForm';
import CustomerInstitutionAdminsForm from './CustomerInstitutionAdminsForm';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import { useFetchCustomerInstitution } from '../../utils/hooks/useFetchCustomerInstitution';
import { CircularProgress } from '@material-ui/core';
import { emptyCustomerInstitution } from '../../types/customerInstitution.types';
import useFetchUsersForInstitution from '../../utils/hooks/useFetchUsersForInstitution';
import { RoleName } from '../../types/user.types';

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
  const [institutionUsers, isLoadingUsers] = useFetchUsersForInstitution('UNIT'); // TODO: institution id
  const admins = institutionUsers.filter((user) =>
    user.roles.some((role) => role.rolename === RoleName.INSTITUTION_ADMIN)
  );

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
          {editMode && <CustomerInstitutionAdminsForm admins={admins} />}
        </>
      )}
    </StyledCustomerInstitution>
  );
};

export default AdminCustomerInstitutionPage;
