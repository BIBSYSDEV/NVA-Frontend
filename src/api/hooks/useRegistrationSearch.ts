import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FetchResultsParams, fetchResults } from '../searchApi';

interface useFetchResultsProps {
  enabled?: boolean;
  params: FetchResultsParams;
}

export const useRegistrationSearch = ({ enabled, params }: useFetchResultsProps) => {
  const { t } = useTranslation();

  return useQuery({
    enabled,
    queryKey: ['registrations', params],
    queryFn: ({ signal }) => fetchResults(params, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });
};
