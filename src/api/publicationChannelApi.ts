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
