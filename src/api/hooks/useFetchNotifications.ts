import { useQuery } from '@tanstack/react-query';
import { fetchCustomerTickets } from '../searchApi';
import { getTaskNotificationsParams } from '../../utils/searchHelpers';
import { User } from '../../types/user.types';
import { useTranslation } from 'react-i18next';

interface FetchNotificationsOptions {
  enabled?: boolean;
  user: User | null;
}

export const useFetchNotifications = ({ enabled = false, user }: FetchNotificationsOptions) => {
  const { t } = useTranslation();
  const tasksNotificationParams = getTaskNotificationsParams(user);

  return useQuery({
    enabled: enabled,
    queryKey: ['taskNotifications', tasksNotificationParams],
    queryFn: () => fetchCustomerTickets(tasksNotificationParams),
    meta: { errorMessage: t('feedback.error.get_messages') },
  });
};
