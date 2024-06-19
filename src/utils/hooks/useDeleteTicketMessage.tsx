import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { deleteTicketMessage } from '../../api/registrationApi';
import { setNotification } from '../../redux/notificationSlice';

export const useDeleteTicketMessage = (ticketId: string, refetchData?: () => void) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (messageId: string) => deleteTicketMessage(ticketId, messageId),
    onSuccess: () => {
      dispatch(setNotification({ message: t('feedback.success.delete_message'), variant: 'success' }));
      refetchData && refetchData();
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.delete_message'), variant: 'error' })),
  });
};
