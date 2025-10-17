import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { CristinPerson, InstitutionUser, RoleName } from '../../types/user.types';
import { setNotification } from '../../redux/notificationSlice';
import { createUser, updateUser } from '../roleApi';
import { getValueByKey } from '../../utils/user-helpers';

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
      // You cannot have the CuratorThesisEmbargo role without having the CuratorThesis role.
      // This is a new constraint, so we need to remove the Embargo role if the CuratorThesis role is not present whenever we update a user.
      const filteredRoles = !institutionUser.roles.some((role) => role.rolename === RoleName.CuratorThesis)
        ? institutionUser.roles.filter((role) => role.rolename !== RoleName.CuratorThesisEmbargo)
        : institutionUser.roles;
      const updatedInstitutionUser = { ...institutionUser, roles: filteredRoles };

      if (userExists) {
        return await updateUser(updatedInstitutionUser.username, updatedInstitutionUser);
      } else {
        return await createUser({
          customerId,
          roles: updatedInstitutionUser.roles,
          cristinIdentifier: getValueByKey('CristinIdentifier', cristinPerson?.identifiers),
          viewingScope: institutionUser.viewingScope,
        });
      }
    },
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.update_institution_user'), variant: 'error' })),
    onSuccess: () =>
      dispatch(setNotification({ message: t('feedback.success.update_institution_user'), variant: 'success' })),
  });
};
