import React, { FC } from 'react';

import CustomerInstitutionMetadataForm from './CustomerInstitutionMetadataForm';
import CustomerInstitutionAdminsForm from './CustomerInstitutionAdminsForm';
import styled from 'styled-components';

const StyledCustomerInstitution = styled.section`
  display: flex;
  flex-direction: column;
`;

const AdminCustomerInstitutionPage: FC = () => {
  return (
    <StyledCustomerInstitution>
      <CustomerInstitutionMetadataForm />
      <CustomerInstitutionAdminsForm />
    </StyledCustomerInstitution>
  );
};

export default AdminCustomerInstitutionPage;
