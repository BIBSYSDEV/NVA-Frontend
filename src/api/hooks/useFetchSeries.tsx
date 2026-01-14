import { fetchResource } from '../commonApi';
import { SerialPublication } from '../../types/registration.types';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const useFetchSeries = (seriesId: string) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['channel', seriesId],
    enabled: !!seriesId,
    queryFn: () => fetchResource<SerialPublication>(seriesId),
    meta: { errorMessage: t('feedback.error.get_series') },
    staleTime: Infinity,
  });
};
