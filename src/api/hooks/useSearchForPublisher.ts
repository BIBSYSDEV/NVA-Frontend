import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { keepSimilarPreviousData } from '../../utils/searchHelpers';
import { searchForPublishers } from '../publicationChannelApi';

interface PublisherSearchParams {
  searchTerm: string;
  size: number;
  year: string;
}

export const useSearchForPublisher = ({ searchTerm, year, size }: PublisherSearchParams) => {
  const { t } = useTranslation();
  return useQuery({
    queryKey: ['publisherSearch', searchTerm, year, size],
    enabled: searchTerm.length > 3,
    queryFn: () => searchForPublishers(searchTerm, year, size),
    meta: { errorMessage: t('feedback.error.get_publishers') },
    placeholderData: (data, query) => keepSimilarPreviousData(data, query, searchTerm),
  });
};
