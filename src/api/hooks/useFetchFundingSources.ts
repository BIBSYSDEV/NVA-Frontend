import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchFundingSources } from '../cristinApi';

export const useFetchFundingSources = () => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['fundingSources'],
    queryFn: fetchFundingSources,
    meta: { errorMessage: t('feedback.error.get_funding_sources') },
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });
};
