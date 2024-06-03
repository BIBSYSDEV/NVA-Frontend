import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FetchNviCandidatesParams, fetchNviCandidates } from '../searchApi';

interface FetchNviCandidatesProps {
  params: FetchNviCandidatesParams;
  enabled?: boolean;
}

export const useFetchNviCandidates = ({ params, enabled }: FetchNviCandidatesProps) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['nviCandidates', params],
    enabled,
    queryFn: () => fetchNviCandidates(params),
    meta: { errorMessage: t('feedback.error.get_nvi_candidates') },
  });
};
