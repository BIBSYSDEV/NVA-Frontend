import { PlaceholderDataFunction, Query, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PersonSearchParams, searchForPerson } from '../cristinApi';

interface PersonSearchOptions extends PersonSearchParams {
  keepPreviousData?: boolean;
  placeholderData?: PlaceholderDataFunction<any, Error, any, (string | PersonSearchParams)[]>;
}

export const useSearchForPerson = ({ placeholderData, ...searchParams }: PersonSearchOptions) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!searchParams.name && searchParams.name.length > 0,
    queryKey: ['person', searchParams],
    queryFn: () => searchForPerson(searchParams),
    meta: { errorMessage: t('feedback.error.person_search') },
    placeholderData,
  });
};

// Keep previous data if query has the same search term
export const keepSimilarPreviousData = <T>(
  previousData: T | undefined,
  query: Query<T, Error, T, (string | PersonSearchParams)[]> | undefined,
  searchTerm?: string | null
) => {
  if (searchTerm && query?.queryKey.some((key) => typeof key === 'object' && key.name === searchTerm)) {
    return previousData;
  }
};
