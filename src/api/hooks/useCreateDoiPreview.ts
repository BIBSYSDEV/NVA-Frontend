import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';
import { getRegistrationByDoi } from '../registrationApi';

export const useCreateDoiPreview = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (doi: string) => getRegistrationByDoi(doi),
    onError: () => {
      dispatch(setNotification({ message: t('feedback.error.get_doi'), variant: 'error' }));
    },
  });
};
