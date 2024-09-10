import { useLocation } from 'react-router-dom';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { AdminCustomerInstitution } from './AdminCustomerInstitution';
import { AdminCustomerInstitutions } from './AdminCustomerInstitutions';

export const AdminCustomerInstitutionsContainer = () => {
  const location = useLocation();
  const customerId = new URLSearchParams(location.search).get('id'); // Will be "new" if creating new Customer

  return (
    <BackgroundDiv>
      {customerId ? <AdminCustomerInstitution customerId={customerId} /> : <AdminCustomerInstitutions />}
    </BackgroundDiv>
  );
};
