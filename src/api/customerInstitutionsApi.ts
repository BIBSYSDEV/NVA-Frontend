import { CancelToken } from 'axios';
import { CustomerInstitution, DoiAgent } from '../types/customerInstitution.types';
import { authenticatedApiRequest } from './apiRequest';
import { CustomerInstitutionApiPath } from './apiPaths';

export const createCustomerInstitution = async (
  customer: Omit<CustomerInstitution, 'doiAgent'>,
  cancelToken?: CancelToken
) =>
  await authenticatedApiRequest<CustomerInstitution>({
    url: CustomerInstitutionApiPath.Customer,
    method: 'POST',
    data: customer,
    cancelToken,
  });

export const updateCustomerInstitution = async (
  customer: Omit<CustomerInstitution, 'doiAgent'>,
  cancelToken?: CancelToken
) =>
  await authenticatedApiRequest<CustomerInstitution>({
    url: `${CustomerInstitutionApiPath.Customer}/${customer.identifier}`,
    method: 'PUT',
    data: customer,
    cancelToken,
  });

export const updateDoiAgent = async (id: string, doiAgent: DoiAgent, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<DoiAgent>({
    url: id, // TODO: use doiAgent.id when endpoint no longer give 500?
    method: 'PUT',
    data: doiAgent,
    cancelToken,
  });
