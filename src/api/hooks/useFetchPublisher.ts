import { useQuery } from '@tanstack/react-query';
import { fetchPublisher } from '../publicationChannelApi';
import { useTranslation } from 'react-i18next';

export const useFetchPublisher = (identifier: string) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!identifier,
    queryKey: ['channel', identifier],
    queryFn: () => fetchPublisher(identifier),
    meta: { errorMessage: t('feedback.error.get_publisher') },
    staleTime: Infinity,
  });
};
