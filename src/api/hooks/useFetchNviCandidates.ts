import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FetcNviCandidatesParams, fetchNviAggregations } from '../searchApi';

export const useFetchNviCandidates = (queryParams: FetcNviCandidatesParams) => {
  const { t } = useTranslation();

  const nviQuery = useQuery({
    queryKey: ['nviCandidates', queryParams],
    queryFn: () => fetchNviAggregations(queryParams),
    meta: { errorMessage: t('feedback.error.get_nvi_candidates') },
  });
  return nviQuery;
};
