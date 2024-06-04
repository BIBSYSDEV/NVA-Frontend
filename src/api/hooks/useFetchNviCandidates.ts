import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FetchNviCandidatesParams, fetchNviAggregations } from '../searchApi';

export const useFetchNviCandidates = (queryParams: FetchNviCandidatesParams) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['nviCandidates', queryParams],
    queryFn: () => fetchNviAggregations(queryParams),
    meta: { errorMessage: t('feedback.error.get_nvi_candidates') },
  });
};
