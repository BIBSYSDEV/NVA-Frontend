import { fetchResource } from '../commonApi';
import { Publisher } from '../../types/registration.types';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const useFetchPublisherFromId = (publisherId: string) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['channel', publisherId],
    enabled: !!publisherId,
    queryFn: () => fetchResource<Publisher>(publisherId),
    meta: { errorMessage: t('feedback.error.get_publisher') },
    staleTime: Infinity,
  });
};
