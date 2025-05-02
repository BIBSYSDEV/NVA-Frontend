import { useQuery } from '@tanstack/react-query';
import { fetchPublisher } from '../publicationChannelApi';
import { useTranslation } from 'react-i18next';
import { getIdentifierFromId } from '../../utils/general-helpers';

export const useFetchPublisher = (id: string, enabled = true) => {
  const { t } = useTranslation();

  return useQuery({
    enabled,
    queryKey: ['channel', id],
    queryFn: () => fetchPublisher(getIdentifierFromId(id)),
    meta: { errorMessage: t('feedback.error.get_publisher') },
    staleTime: Infinity,
  });
};
