import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FetchNviCandidatesParams, fetchNviCandidates } from '../searchApi';

export const useFetchNviCandidates = (queryParams: FetchNviCandidatesParams, enabled = true) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['nviCandidates', queryParams],
    enabled,
    queryFn: () => fetchNviCandidates(queryParams),
    meta: { errorMessage: t('feedback.error.get_nvi_candidates') },
  });
};
