import { CustomerInstitution } from '../types/customerInstitution.types';
import { CancelToken } from 'axios';
import { authenticatedApiRequest2 } from './apiRequest';

export enum CustomerInstitutionApiPaths {
  CUSTOMER_INSTITUTION = '/customer',
}

export const createCustomerInstitution = async (customer: CustomerInstitution, cancelToken?: CancelToken) =>
  await authenticatedApiRequest2<CustomerInstitution>({
    url: CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION,
    method: 'POST',
    data: customer,
    cancelToken,
  });

export const updateCustomerInstitution = async (customer: CustomerInstitution, cancelToken?: CancelToken) =>
  await authenticatedApiRequest2<CustomerInstitution>({
    url: `${CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION}/${customer.identifier}`,
    method: 'PUT',
    data: customer,
    cancelToken,
  });
