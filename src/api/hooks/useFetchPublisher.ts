import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { fetchPublisher } from '../publicationChannelApi';

export const useFetchPublisher = (id: string) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!id,
    queryKey: ['channel', id],
    queryFn: () => fetchPublisher(getIdentifierFromId(id)),
    meta: { errorMessage: t('feedback.error.get_publisher') },
    staleTime: Infinity,
  });
};
