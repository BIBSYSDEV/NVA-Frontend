import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BookRegistration } from '../../types/publication_types/bookRegistration.types';
import { fetchResource } from '../commonApi';

export const useFetchBookRegistration = (containerId: string) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['registration', containerId],
    enabled: !!containerId,
    queryFn: () => fetchResource<BookRegistration>(containerId),
    meta: { errorMessage: t('feedback.error.get_registration') },
  });
};
