import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { CristinPerson, InstitutionUser } from '../../types/user.types';
import { setNotification } from '../../redux/notificationSlice';
import { createUser, updateUser } from '../roleApi';
import { getValueByKey, sanitizeRolesForEmbargoConstraint } from '../../utils/user-helpers';

interface UpdateInstitutionUserProps {
  institutionUser: InstitutionUser;
  customerId: string;
  cristinPerson: CristinPerson | null | undefined;
  userExists: boolean;
}

export const useUpdateInstitutionUser = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ institutionUser, customerId, cristinPerson, userExists }: UpdateInstitutionUserProps) => {
      // "New" constraint so we enforce the rule backwards on every user save.
      const filteredRoles = sanitizeRolesForEmbargoConstraint(institutionUser.roles);
      const updatedInstitutionUser = { ...institutionUser, roles: filteredRoles };

      if (userExists) {
        return await updateUser(updatedInstitutionUser.username, updatedInstitutionUser);
      } else {
        if (!customerId) {
          throw new Error('Missing customerId for user creation');
        }
        const cristinIdentifier = getValueByKey('CristinIdentifier', cristinPerson?.identifiers);
        if (!cristinIdentifier) {
          throw new Error('Missing CristinIdentifier for user creation');
        }
        return await createUser({
          customerId,
          roles: updatedInstitutionUser.roles,
          cristinIdentifier,
          viewingScope: updatedInstitutionUser.viewingScope,
        });
      }
    },
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.update_institution_user'), variant: 'error' })),
    onSuccess: () =>
      dispatch(setNotification({ message: t('feedback.success.update_institution_user'), variant: 'success' })),
  });
};
