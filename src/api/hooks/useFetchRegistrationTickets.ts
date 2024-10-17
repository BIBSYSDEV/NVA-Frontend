import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchRegistrationTickets } from '../registrationApi';

export const useFetchRegistrationTickets = (registrationId = '', { enabled = !!registrationId } = {}) => {
  const { t } = useTranslation();

  return useQuery({
    enabled,
    queryKey: ['registrationTickets', registrationId],
    queryFn: () => fetchRegistrationTickets(registrationId),
    meta: { errorMessage: t('feedback.error.get_tickets') },
  });
};
