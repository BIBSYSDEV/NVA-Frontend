import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchRegistrationLog } from '../registrationApi';

export const useFetchRegistrationLog = (id: string) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!id,
    queryKey: ['log', id],
    queryFn: () => fetchRegistrationLog(id),
    meta: { errorMessage: t('feedback.error.fetch_log') },
  });
};
