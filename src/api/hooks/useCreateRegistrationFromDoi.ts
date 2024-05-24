import { useMutation } from '@tanstack/react-query';
import { createRegistrationFromDoi } from '../registrationApi';
import { setNotification } from '../../redux/notificationSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DoiPreview, Registration } from '../../types/registration.types';
import { AxiosResponse } from 'axios';

export const useCreateRegistrationFromDoi = (onSuccess: (response: AxiosResponse<Registration, any>) => void) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (doiPreview: Partial<DoiPreview>) => createRegistrationFromDoi(doiPreview),
    onSuccess: (response) => onSuccess(response),
    onError: () => {
      dispatch(setNotification({ message: t('feedback.error.create_registration'), variant: 'error' }));
    },
  });
};
