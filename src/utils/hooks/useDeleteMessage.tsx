import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Dispatch } from 'redux';
import { deleteTicketMessage } from '../../api/registrationApi';
import { setNotification } from '../../redux/notificationSlice';

export const useDeleteMessage = (ticketId: string, dispatch: Dispatch, refetchData?: () => void) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (messageId: string) => deleteTicketMessage(ticketId, messageId),
    onSuccess: () => {
      dispatch(setNotification({ message: t('feedback.success.delete_message'), variant: 'success' }));
      refetchData && refetchData();
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.delete_message'), variant: 'error' })),
  });
};
