import { SearchResponse2 } from '../types/common.types';
import { Publisher, SerialPublication } from '../types/registration.types';
import { getYearQuery } from '../utils/registration-helpers';
import { PublicationChannelApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest2 } from './apiRequest';

// Until the endpoint supports search without year
const publicationChannelYearWorkaround = '2023';

export interface CreateSerialPublicationPayload {
  type: 'Journal' | 'Series';
  name: string;
  homepage: string;
  printIssn?: string;
  onlineIssn?: string;
}

export interface CreatePublisherPayload {
  name: string;
  homepage: string;
  isbnPrefix?: string;
}

export const createSerialPublication = async (newSerialPublication: CreateSerialPublicationPayload) => {
  const createSerialPublicationResponse = await authenticatedApiRequest2<SerialPublication>({
    url: PublicationChannelApiPath.SerialPublication,
    method: 'POST',
    data: newSerialPublication,
  });

  return createSerialPublicationResponse.data;
};

export const createPublisher = async (newPublisher: CreatePublisherPayload) => {
  const createPublisherResponse = await authenticatedApiRequest2<Publisher>({
    url: PublicationChannelApiPath.Publisher,
    method: 'POST',
    data: newPublisher,
  });

  return createPublisherResponse.data;
};

export const fetchSerialPublication = async (identifier: string) => {
  const fetchSerialPublicationResponse = await apiRequest2<SerialPublication>({
    url: `${PublicationChannelApiPath.SerialPublication}/${identifier}/${publicationChannelYearWorkaround}`,
  });
  return fetchSerialPublicationResponse.data;
};

export const fetchPublisher = async (identifier: string) => {
  const fetchPublisherResponse = await apiRequest2<Publisher>({
    url: `${PublicationChannelApiPath.Publisher}/${identifier}/${publicationChannelYearWorkaround}`,
  });
  return fetchPublisherResponse.data;
};

export const defaultChannelSearchSize = 50;

export const searchForPublishers = async (query: string, year: string, size = defaultChannelSearchSize) => {
  const searchForPublishersResponse = await apiRequest2<SearchResponse2<Publisher>>({
    url: PublicationChannelApiPath.Publisher,
    method: 'GET',
    params: {
      query,
      year: getYearQuery(year),
      size,
    },
  });

  return searchForPublishersResponse.data;
};

export const searchForSerialPublications = async (query: string, year: string, size = defaultChannelSearchSize) => {
  const searchForJournalsResponse = await apiRequest2<SearchResponse2<SerialPublication>>({
    url: PublicationChannelApiPath.SerialPublication,
    method: 'GET',
    params: {
      query,
      year: getYearQuery(year),
      size,
    },
  });

  return searchForJournalsResponse.data;
};
