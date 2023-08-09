import { useTranslation } from 'react-i18next';
import { SearchApiPath } from '../../api/apiPaths';
import { RegistrationSearchResponse } from '../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../constants';
import { createRegistrationSearchQuery, SearchConfig } from '../searchHelpers';
import { useFetch } from './useFetch';

export const useSearchRegistrations = (
  searchConfig?: SearchConfig,
  numberOfResults = ROWS_PER_PAGE_OPTIONS[0],
  searchAfter = 0
) => {
  const { t } = useTranslation();
  const searchQuery = createRegistrationSearchQuery(searchConfig ?? {});

  const url = searchQuery
    ? `${SearchApiPath.Registrations}?query=${searchQuery}&results=${numberOfResults}&from=${searchAfter}`
    : `${SearchApiPath.Registrations}?results=${numberOfResults}&from=${searchAfter}`;

  const fetchRegistrations = useFetch<RegistrationSearchResponse>({ url, errorMessage: t('feedback.error.search') });

  return fetchRegistrations;
};
