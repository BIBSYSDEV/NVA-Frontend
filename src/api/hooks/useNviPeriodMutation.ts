import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createNviPeriod, updateNviPeriod } from '../scientificIndexApi';
import { setNotification } from '../../redux/notificationSlice';
import { NviPeriod } from '../../types/nvi.types';

export const useNviPeriodMutation = (nviPeriod: NviPeriod | null) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isEdit = !!nviPeriod;

  return useMutation({
    mutationFn: (data: Omit<NviPeriod, 'id' | 'status'>) =>
      nviPeriod ? updateNviPeriod({ id: nviPeriod.id, ...data }) : createNviPeriod(data),
    onSuccess: () =>
      dispatch(
        setNotification({
          message: isEdit ? t('feedback.success.update_nvi_period') : t('feedback.success.create_nvi_period'),
          variant: 'success',
        })
      ),
    onError: () =>
      dispatch(
        setNotification({
          message: isEdit ? t('feedback.error.update_nvi_period') : t('feedback.error.create_nvi_period'),
          variant: 'error',
        })
      ),
  });
};
