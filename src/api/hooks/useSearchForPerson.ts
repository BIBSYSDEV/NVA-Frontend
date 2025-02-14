import { PlaceholderDataFunction, Query, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PersonSearchParams, searchForPerson } from '../cristinApi';

type SearchResponseType = Awaited<ReturnType<typeof searchForPerson>>;
type PlaceholderDataFunctionType = PlaceholderDataFunction<
  SearchResponseType,
  Error,
  SearchResponseType,
  (string | PersonSearchParams)[]
>;

interface PersonSearchOptions extends PersonSearchParams {
  enabled?: boolean;
  placeholderData?: PlaceholderDataFunctionType;
}

export const useSearchForPerson = ({ enabled, placeholderData, ...searchParams }: PersonSearchOptions) => {
  const { t } = useTranslation();

  return useQuery({
    enabled,
    queryKey: ['personSearch', searchParams],
    queryFn: () => searchForPerson(searchParams),
    meta: { errorMessage: t('feedback.error.person_search') },
    placeholderData,
  });
};

// Keep previous data if query has the same search term
export const keepSimilarPreviousData = (
  previousData: SearchResponseType | undefined,
  query: Query<SearchResponseType, Error, SearchResponseType, (string | PersonSearchParams)[]> | undefined,
  searchTerm?: string | null
) => {
  if (searchTerm && query?.queryKey.some((key) => typeof key === 'object' && key.name === searchTerm)) {
    return previousData;
  }
};
