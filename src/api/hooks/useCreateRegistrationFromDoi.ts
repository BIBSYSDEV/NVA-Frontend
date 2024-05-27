import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';
import { DoiPreview, Registration } from '../../types/registration.types';
import { createRegistrationFromDoi } from '../registrationApi';

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
