import React, { FC, useEffect } from 'react';

import CustomerInstitutionMetadataForm from './CustomerInstitutionMetadataForm';
import CustomerInstitutionAdminsForm from './CustomerInstitutionAdminsForm';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import { useFetchCustomerInstitution } from '../../utils/hooks/useFetchCustomerInstitution';
import { CircularProgress } from '@material-ui/core';
import { emptyCustomerInstitution } from '../../types/customerInstitution.types';

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

  // TODO: Fetch existing admins (needs endpoint to retrieve all admins of given institution)

  useEffect(() => {
    if (customerInstitution) {
      history.replace(`/admin-institutions/${customerInstitution.identifier}`, { title: customerInstitution.name });
    }
  }, [history, customerInstitution]);

  return (
    <StyledCustomerInstitution>
      {isLoadingCustomerInstitution ? (
        <CircularProgress />
      ) : (
        <>
          <CustomerInstitutionMetadataForm
            customerInstitution={customerInstitution ?? emptyCustomerInstitution}
            handleSetCustomerInstitution={handleSetCustomerInstitution}
          />
          {editMode && <CustomerInstitutionAdminsForm />}
        </>
      )}
    </StyledCustomerInstitution>
  );
};

export default AdminCustomerInstitutionPage;
