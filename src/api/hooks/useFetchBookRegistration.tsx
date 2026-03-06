import { fetchProtectedResource } from '../commonApi';
import { BookRegistration } from '../../types/publication_types/bookRegistration.types';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const useFetchBookRegistration = (containerId: string) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['registration', containerId],
    enabled: !!containerId,
    queryFn: () => fetchProtectedResource<BookRegistration>(containerId),
    meta: { errorMessage: t('feedback.error.get_registration') },
  });
};
