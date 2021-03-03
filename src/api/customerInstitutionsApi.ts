import { CustomerInstitution } from '../types/customerInstitution.types';
import { CancelToken } from 'axios';
import { authenticatedApiRequest } from './apiRequest';

export enum CustomerInstitutionApiPaths {
  CUSTOMER_INSTITUTION = '/customer',
}

interface CustomerInstitutionsResponse {
  customers: CustomerInstitution[];
}

export const getAllCustomerInstitutions = async (cancelToken?: CancelToken) =>
  await authenticatedApiRequest<CustomerInstitutionsResponse>({
    url: CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION,
    cancelToken,
  });

export const getCustomerInstitution = async (customerId: string, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<CustomerInstitution>({
    url: customerId,
    method: 'GET',
    cancelToken,
  });

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
