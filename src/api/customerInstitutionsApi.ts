import { CustomerInstitution } from '../types/customerInstitution.types';
import { CancelToken } from 'axios';
import { authenticatedApiRequest } from './apiRequest';
import { CustomerInstitutionApiPaths } from './apiPaths';

export const createCustomerInstitution = async (customer: CustomerInstitution, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<CustomerInstitution>({
    url: CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION,
    method: 'POST',
    data: customer,
    cancelToken,
  });

export const updateCustomerInstitution = async (customer: CustomerInstitution, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<CustomerInstitution>({
    url: `${CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION}/${customer.identifier}`,
    method: 'PUT',
    data: customer,
    cancelToken,
  });
