import React, { FC } from 'react';

import CustomerInstitutionMetadataForm from './CustomerInstitutionMetadataForm';
import CustomerInstitutionAdminsForm from './CustomerInstitutionAdminsForm';

const AdminCustomerInstitutionPage: FC = () => {
  return (
    <>
      <CustomerInstitutionMetadataForm />
      <CustomerInstitutionAdminsForm />
    </>
  );
};

export default AdminCustomerInstitutionPage;
