import { updateCristinPerson } from '../cristinApi';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { CristinPerson } from '../../types/user.types';
import { setNotification } from '../../redux/notificationSlice';

export const useUpdateCristinPerson = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (person: CristinPerson) => {
      let updatedPerson = person;

      if (!person.verified) {
        updatedPerson = { ...person, keywords: undefined };
      }

      return await updateCristinPerson(updatedPerson.id, updatedPerson);
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_person'), variant: 'error' })),
  });
};
