import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';
import { TerminatePublicationRequest, UnpublishPublicationRequest } from '../../types/registration.types';
import { updateRegistrationStatus } from '../registrationApi';

interface UpdateRequest {
  registrationIdentifier: string;
  data: UnpublishPublicationRequest | TerminatePublicationRequest;
  onSuccess?: () => void;
}

export const useUpdateRegistrationStatus = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ registrationIdentifier, data }: UpdateRequest) =>
      updateRegistrationStatus(registrationIdentifier, data),
    onSuccess: (response, variables) => {
      dispatch(setNotification({ message: t('feedback.success.update_registration'), variant: 'success' }));
      if (response.data) {
        const key1 = ['registration', response.data.identifier];
        if (queryClient.getQueryData(key1)) {
          queryClient.setQueryData(key1, response.data);
        }
        const key2 = ['registration', response.data.identifier, true];
        if (queryClient.getQueryData(key2)) {
          queryClient.setQueryData(key2, response.data);
        }
        const key3 = ['registration', response.data.identifier, false];
        if (queryClient.getQueryData(key3)) {
          queryClient.setQueryData(key3, response.data);
        }
      }
      variables.onSuccess?.();
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' })),
  });
};
