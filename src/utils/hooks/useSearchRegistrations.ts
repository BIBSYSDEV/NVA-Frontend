import { useTranslation } from 'react-i18next';
import { SearchApiPaths } from '../../api/searchApi';
import { SearchResult } from '../../types/search.types';
import { ROWS_PER_PAGE_OPTIONS } from '../constants';
import { createSearchQuery, SearchConfig } from '../searchHelpers';
import { useFetch } from './useFetch';

export const useSearchRegistrations = (
  searchConfig?: SearchConfig,
  numberOfResults = ROWS_PER_PAGE_OPTIONS[1],
  searchAfter = 0
) => {
  const { t } = useTranslation('feedback');
  const searchQuery = createSearchQuery(searchConfig ?? {});

  const url = searchQuery
    ? `${SearchApiPaths.REGISTRATIONS}?query=${searchQuery}&results=${numberOfResults}&from=${searchAfter}`
    : `${SearchApiPaths.REGISTRATIONS}?results=${numberOfResults}&from=${searchAfter}`;

  const fetchRegistrations = useFetch<SearchResult>({ url, errorMessage: t('error.search') });

  return fetchRegistrations;
};
