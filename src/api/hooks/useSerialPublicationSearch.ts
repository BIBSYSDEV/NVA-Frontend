import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { keepSimilarPreviousData } from '../../utils/searchHelpers';
import { searchForSerialPublications } from '../publicationChannelApi';

interface SerialPublicationSearchParams {
  searchMode: 'journal' | 'series' | 'serial-publication';
  searchTerm: string;
  size: number;
  year?: string;
}

export const useSerialPublicationSearch = ({
  searchMode,
  searchTerm,
  year = new Date().getFullYear().toString(),
  size,
}: SerialPublicationSearchParams) => {
  const { t } = useTranslation();
  return useQuery({
    queryKey: ['serialPublicationSearch', searchTerm, year, size],
    enabled: searchTerm.length > 3,
    queryFn: () => searchForSerialPublications(searchTerm, year, size),
    meta: {
      errorMessage:
        searchMode === 'series'
          ? t('feedback.error.get_series')
          : searchMode === 'journal'
            ? t('feedback.error.get_journals')
            : t('feedback.error.get_serial_publication'),
    },
    placeholderData: (data, query) => keepSimilarPreviousData(data, query, searchTerm),
  });
};
