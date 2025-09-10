import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';
import { Registration } from '../../types/registration.types';
import { isErrorStatus } from '../../utils/constants';
import { updateRegistrationQueryData } from '../../utils/registration-helpers';
import { updateRegistration } from '../registrationApi';

interface UpdateRegistrationConfig {
  onSuccess?: () => void;
  ignoreSuccessMessage?: boolean;
}

export const useUpdateRegistration = ({ onSuccess, ignoreSuccessMessage = false }: UpdateRegistrationConfig = {}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Registration) => {
      const response = await updateRegistration(values);
      if (isErrorStatus(response.status)) {
        throw new Error('Error updating registration');
      }
      return response;
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' })),
    onSuccess: (response) => {
      if (!ignoreSuccessMessage) {
        dispatch(setNotification({ message: t('feedback.success.update_registration'), variant: 'success' }));
      }
      if (response.data) {
        updateRegistrationQueryData(queryClient, response.data);
      }
      onSuccess?.();
    },
  });
};
