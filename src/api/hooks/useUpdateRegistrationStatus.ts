import { useMutation } from '@tanstack/react-query';
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

  return useMutation({
    mutationFn: ({ registrationIdentifier, data }: UpdateRequest) =>
      updateRegistrationStatus(registrationIdentifier, data),
    onSuccess: (_, variables) => {
      dispatch(setNotification({ message: t('feedback.success.update_registration'), variant: 'success' }));
      variables.onSuccess?.();
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' })),
  });
};
