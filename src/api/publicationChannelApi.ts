import { SearchResponse2 } from '../types/common.types';
import { Journal, Publisher, Series } from '../types/registration.types';
import { getYearQuery } from '../utils/registration-helpers';
import { PublicationChannelApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest2 } from './apiRequest';

// Until the endpoint supports search without year
const publicationChannelYearWorkaround = '2023';

export interface CreateJournalPayload {
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

export const createJournal = async (newJournal: CreateJournalPayload) => {
  const createJournalResponse = await authenticatedApiRequest2<Journal>({
    url: PublicationChannelApiPath.Journal,
    method: 'POST',
    data: newJournal,
  });

  return createJournalResponse.data;
};

export const createSeries = async (newSeries: CreateJournalPayload) => {
  const createSeriesResponse = await authenticatedApiRequest2<Series>({
    url: PublicationChannelApiPath.Series,
    method: 'POST',
    data: newSeries,
  });

  return createSeriesResponse.data;
};

export const createPublisher = async (newPublisher: CreatePublisherPayload) => {
  const createPublisherResponse = await authenticatedApiRequest2<Publisher>({
    url: PublicationChannelApiPath.Publisher,
    method: 'POST',
    data: newPublisher,
  });

  return createPublisherResponse.data;
};

export const fetchJournal = async (identifier: string) => {
  const fetchJournalResponse = await apiRequest2<Journal>({
    url: `${PublicationChannelApiPath.Journal}/${identifier}/${publicationChannelYearWorkaround}`,
  });
  return fetchJournalResponse.data;
};

export const fetchPublisher = async (identifier: string) => {
  const fetchPublisherResponse = await apiRequest2<Publisher>({
    url: `${PublicationChannelApiPath.Publisher}/${identifier}/${publicationChannelYearWorkaround}`,
  });
  return fetchPublisherResponse.data;
};

export const fetchSeries = async (identifier: string) => {
  const fetchSeriesResponse = await apiRequest2<Series>({
    url: `${PublicationChannelApiPath.Series}/${identifier}/${publicationChannelYearWorkaround}`,
  });
  return fetchSeriesResponse.data;
};

export const defaultChannelSearchSize = 50;

export const searchForSeries = async (query: string, year: string, size = defaultChannelSearchSize) => {
  const searchForSeriesResponse = await apiRequest2<SearchResponse2<Series>>({
    url: PublicationChannelApiPath.Series,
    method: 'GET',
    params: {
      query,
      year: getYearQuery(year),
      size,
    },
  });

  return searchForSeriesResponse.data;
};

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

export const searchForJournals = async (query: string, year: string, size = defaultChannelSearchSize) => {
  const searchForJournalsResponse = await apiRequest2<SearchResponse2<Journal>>({
    url: PublicationChannelApiPath.Journal,
    method: 'GET',
    params: {
      query,
      year: getYearQuery(year),
      size,
    },
  });

  return searchForJournalsResponse.data;
};
