import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { fetchNviCandidate } from '../searchApi';

export const nviCandidateQueryKeyword = 'nviCandidate';

export const useFetchNviCandidate = (identifier: string | undefined) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!identifier,
    queryKey: [nviCandidateQueryKeyword, identifier ?? ''],
    queryFn: () => fetchNviCandidate(identifier ?? ''),
    meta: { errorMessage: t('feedback.error.get_nvi_candidate') },
    retry(failureCount, error: Pick<AxiosError, 'response'>) {
      if (error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
