import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../api/roleApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ProfilePicture } from '../../../components/ProfilePicture';
import { setNotification } from '../../../redux/notificationSlice';
import { InstitutionUser, RoleName } from '../../../types/user.types';

interface UserListProps {
  userList: InstitutionUser[];
  refetchUsers: () => Promise<unknown>;
}

export const UserList = ({ userList, refetchUsers }: UserListProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [userToUpdate, setUserToUpdate] = useState<InstitutionUser | null>(null);

  const removeAdminRole = useMutation({
    mutationFn: async (existingUser: InstitutionUser) => {
      const updatedUser: InstitutionUser = {
        ...existingUser,
        roles: existingUser.roles.filter((role) => role.rolename !== RoleName.InstitutionAdmin),
      };
      await updateUser(existingUser.username, updatedUser);
      await refetchUsers();
      setUserToUpdate(null);
    },
    onSuccess: () => dispatch(setNotification({ message: t('feedback.success.removed_role'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.remove_role'), variant: 'error' })),
  });

  const isLastInstitutionAdmin = userList.length === 1;

  const sortedList = userList.sort((a, b) =>
    `${a.givenName} ${a.familyName}`.toLocaleLowerCase() < `${b.givenName} ${b.familyName}`.toLocaleLowerCase() ? -1 : 1
  );

  return (
    <>
      {sortedList.length === 0 ? (
        <Typography>
          <i>{t('editor.curators.no_users_found')}</i>
        </Typography>
      ) : (
        <>
          <List>
            {sortedList.map((user) => (
              <ListItem
                sx={{ backgroundColor: 'white' }}
                key={user.username}
                divider
                secondaryAction={
                  <IconButton
                    aria-label={t('common.remove')}
                    color="primary"
                    disabled={isLastInstitutionAdmin}
                    data-testid={`button-remove-role-${user.username}`}
                    onClick={() => setUserToUpdate(user)}>
                    <CancelIcon />
                  </IconButton>
                }>
                <ListItemAvatar>
                  <ProfilePicture fullName={`${user.givenName} ${user.familyName}`} personId={user.cristinId ?? ''} />
                </ListItemAvatar>
                <ListItemText primary={`${user.givenName} ${user.familyName}`} />
              </ListItem>
            ))}
          </List>

          <ConfirmDialog
            open={!!userToUpdate}
            title={t('basic_data.institutions.remove_role_title')}
            isLoading={removeAdminRole.isPending}
            onCancel={() => setUserToUpdate(null)}
            onAccept={() => userToUpdate && removeAdminRole.mutate(userToUpdate)}
            dialogDataTestId="confirm-remove-role-dialog">
            {t('basic_data.institutions.remove_role_text')}
          </ConfirmDialog>
        </>
      )}
    </>
  );
};
