import { CancelToken } from 'axios';
import {
  ClaimedChannel,
  CustomerInstitution,
  CustomerList,
  DoiAgent,
  ProtectedDoiAgent,
  VocabularyList,
} from '../types/customerInstitution.types';
import { PublicationInstanceType } from '../types/registration.types';
import { CustomerInstitutionApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest, authenticatedApiRequest2 } from './apiRequest';

export const fetchCustomers = async (signal?: AbortSignal) => {
  const fetchCustomersResponse = await apiRequest2<CustomerList>({
    url: CustomerInstitutionApiPath.Customer,
    signal,
  });
  return fetchCustomersResponse.data;
};

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

export type ChannelPolicy = 'OwnerOnly' | 'Everyone';

interface ClaimChannelPayload {
  channel: string;
  constraint: {
    scope: PublicationInstanceType[];
    publishingPolicy: ChannelPolicy;
    editingPolicy: ChannelPolicy;
  };
}

export const setChannelClaim = async (customerId: string, data: ClaimChannelPayload) =>
  await authenticatedApiRequest2({
    url: `${customerId}/channel-claim`,
    method: 'POST',
    data,
  });

interface ClaimedChannelList {
  channelClaims: ClaimedChannel[];
}

export const fetchClaimedChannels = async (channelType: 'publisher' | 'serial-publication', signal: AbortSignal) => {
  const getClaimedChannels = await authenticatedApiRequest2<ClaimedChannelList>({
    url: CustomerInstitutionApiPath.ChannelClaims,
    params: { channelType },
    signal,
  });

  return getClaimedChannels.data;
};

export const fetchChannelClaim = async (channelIdentifier: string, signal: AbortSignal) => {
  const getChannelClaim = await authenticatedApiRequest2<ClaimedChannel>({
    url: `${CustomerInstitutionApiPath.ChannelClaim}/${channelIdentifier}`,
    signal,
  });

  return getChannelClaim.data;
};

export const deleteChannelClaim = async (customerId: string, channelIdentifier: string) => {
  const deleteResponse = await authenticatedApiRequest2<null>({
    url: `${customerId}/channel-claim/${channelIdentifier}`,
    method: 'DELETE',
  });
  return deleteResponse.data;
};
