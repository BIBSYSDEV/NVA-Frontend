import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AdminCustomerInstitution from './AdminCustomerInstitution';
import AdminCustomerInstitutions from './AdminCustomerInstitutions';
import { RootStore } from '../../redux/reducers/rootReducer';
import Forbidden from '../errorpages/Forbidden';

const AdminCustomerInstitutionsPage: FC = () => {
  const location = useLocation();
  const user = useSelector((store: RootStore) => store.user);
  const customerId = new URLSearchParams(location.search).get('id'); // Will be "new" if creating new Customer

  const canCreateCustomer = user.isAppAdmin && customerId === 'new';
  const canEditCustomer =
    user.isAppAdmin || (user.isInstitutionAdmin && customerId && user.customerId === decodeURIComponent(customerId));

  return customerId && (canCreateCustomer || canEditCustomer) ? (
    <AdminCustomerInstitution customerId={customerId} />
  ) : !customerId && user.isAppAdmin ? (
    <AdminCustomerInstitutions />
  ) : (
    <Forbidden />
  );
};

export default AdminCustomerInstitutionsPage;
