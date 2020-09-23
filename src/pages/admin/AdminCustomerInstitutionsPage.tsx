import React, { FC } from 'react';

import { useHistory } from 'react-router-dom';
import AdminCustomerInstitution from './AdminCustomerInstitution';
import AdminCustomerInstitutions from './AdminCustomerInstitutions';

const AdminCustomerInstitutionsPage: FC = () => {
  const history = useHistory();
  const customerId = new URLSearchParams(history.location.search).get('id'); // Will be "new" if creating new Customer

  return <>{customerId ? <AdminCustomerInstitution customerId={customerId} /> : <AdminCustomerInstitutions />}</>;
};

export default AdminCustomerInstitutionsPage;
