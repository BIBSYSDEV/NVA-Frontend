import { SearchResponse } from '../types/common.types';
import { Journal, Publisher, Series } from '../types/registration.types';
import { getYearQuery } from '../utils/registration-helpers';
import { PublicationChannelApiPath } from './apiPaths';
import { authenticatedApiRequest2 } from './apiRequest';

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
  const createJournalResponse = await authenticatedApiRequest2<null>({
    url: PublicationChannelApiPath.Journal,
    method: 'POST',
    data: newJournal,
  });

  return createJournalResponse.data;
};

export const createSeries = async (newSeries: CreateJournalPayload) => {
  const createSeriesResponse = await authenticatedApiRequest2<null>({
    url: PublicationChannelApiPath.Series,
    method: 'POST',
    data: newSeries,
  });

  return createSeriesResponse.data;
};

export const createPublisher = async (newPublisher: CreatePublisherPayload) => {
  const createPublisherResponse = await authenticatedApiRequest2<null>({
    url: PublicationChannelApiPath.Publisher,
    method: 'POST',
    data: newPublisher,
  });

  return createPublisherResponse.data;
};

export const searchForSeries = async (query: string, year: string) => {
  const searchForSeriesResponse = await authenticatedApiRequest2<SearchResponse<Series>>({
    url: PublicationChannelApiPath.Series,
    method: 'GET',
    params: {
      query,
      year: getYearQuery(year),
    },
  });

  return searchForSeriesResponse.data;
};

export const searchForPublishers = async (query: string, year: string) => {
  const searchForPublishersResponse = await authenticatedApiRequest2<SearchResponse<Publisher>>({
    url: PublicationChannelApiPath.Publisher,
    method: 'GET',
    params: {
      query,
      year: getYearQuery(year),
    },
  });

  return searchForPublishersResponse.data;
};

export const searchForJournals = async (query: string, year: string) => {
  const searchForJournalsResponse = await authenticatedApiRequest2<SearchResponse<Journal>>({
    url: PublicationChannelApiPath.Journal,
    method: 'GET',
    params: {
      query,
      year: getYearQuery(year),
    },
  });

  return searchForJournalsResponse.data;
};
