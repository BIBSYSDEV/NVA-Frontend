import { CancelToken } from 'axios';
import {
  ClaimedChannel,
  CustomerInstitution,
  DoiAgent,
  ProtectedDoiAgent,
  VocabularyList,
} from '../types/customerInstitution.types';
import { CustomerInstitutionApiPath } from './apiPaths';
import { authenticatedApiRequest, authenticatedApiRequest2 } from './apiRequest';

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

export const fetchDoiAgent = async (doiAgentId: string) =>
  await authenticatedApiRequest2<ProtectedDoiAgent>({
    url: doiAgentId,
    method: 'GET',
  });

export const updateDoiAgent = async (doiAgent: DoiAgent, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<DoiAgent>({
    url: doiAgent.id,
    method: 'PUT',
    data: doiAgent,
    cancelToken,
  });

export const fetchVocabulary = async (customerId: string) => {
  const getVocabulary = await authenticatedApiRequest2<VocabularyList>({
    url: `${customerId}/vocabularies`,
  });

  return getVocabulary.data;
};

interface ClaimedChannelList {
  channelClaims: ClaimedChannel[];
}

export const fetchClaimedChannels = async (signal?: AbortSignal) => {
  const getClaimedChannels = await authenticatedApiRequest2<ClaimedChannelList>({
    url: CustomerInstitutionApiPath.ChannelClaims,
    method: 'GET',
    signal,
  });

  return getClaimedChannels.data;
};
