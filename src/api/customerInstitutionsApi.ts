import { CustomerInstitution } from '../types/customerInstitution.types';
import { CancelToken } from 'axios';
import { authenticatedApiRequest } from './apiRequest';
import { CustomerInstitutionApiPath } from './apiPaths';

export const createCustomerInstitution = async (customer: CustomerInstitution, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<CustomerInstitution>({
    url: CustomerInstitutionApiPath.Customer,
    method: 'POST',
    data: customer,
    cancelToken,
  });

export const updateCustomerInstitution = async (customer: CustomerInstitution, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<CustomerInstitution>({
    url: `${CustomerInstitutionApiPath.Customer}/${customer.identifier}`,
    method: 'PUT',
    data: customer,
    cancelToken,
  });
