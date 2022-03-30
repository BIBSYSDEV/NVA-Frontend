import { useHistory } from 'react-router-dom';
import { AdminCustomerInstitution } from './AdminCustomerInstitution';
import { AdminCustomerInstitutions } from './AdminCustomerInstitutions';

export const AdminCustomerInstitutionsContainer = () => {
  const history = useHistory();
  const customerId = new URLSearchParams(history.location.search).get('id'); // Will be "new" if creating new Customer

  return customerId ? <AdminCustomerInstitution customerId={customerId} /> : <AdminCustomerInstitutions />;
};
