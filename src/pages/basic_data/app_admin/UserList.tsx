import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../api/roleApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { setNotification } from '../../../redux/notificationSlice';
import { InstitutionUser, RoleName } from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { ProfilePicture } from '../../../components/ProfilePicture';

interface UserListProps {
  userList: InstitutionUser[];
  refetchUsers?: () => void;
  showScope?: boolean;
}

export const UserList = ({ userList, refetchUsers }: UserListProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [updatedRoleForUsers, setUpdatedRoleForUsers] = useState<string[]>([]);
  const [removeRoleForUser, setRemoveRoleForUser] = useState('');

  const roleToRemove = RoleName.InstitutionAdmin;

  const handleRemoveRoleFromUser = async () => {
    if (removeRoleForUser) {
      setUpdatedRoleForUsers((state) => [...state, removeRoleForUser]);

      const existingUser = userList.find((user) => user.username === removeRoleForUser);
      if (!existingUser) {
        return;
      }
      const newUser: InstitutionUser = {
        ...existingUser,
        roles: existingUser.roles.filter((role) => role.rolename !== roleToRemove),
      };
      const updateUserResponse = await updateUser(removeRoleForUser, newUser);
      if (isErrorStatus(updateUserResponse.status)) {
        setUpdatedRoleForUsers((state) => state.filter((user) => user !== removeRoleForUser));
        dispatch(setNotification({ message: t('feedback.error.remove_role'), variant: 'error' }));
      } else if (isSuccessStatus(updateUserResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.removed_role'), variant: 'success' }));
        refetchUsers?.();
      }
    }
    setRemoveRoleForUser('');
  };

  const isLastInstitutionAdmin = roleToRemove === RoleName.InstitutionAdmin && userList.length === 1;

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
                    data-testid={`button-remove-role-${roleToRemove}-${user.username}`}
                    onClick={() => setRemoveRoleForUser(user.username)}>
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

          {roleToRemove && (
            <ConfirmDialog
              open={!!removeRoleForUser}
              title={t('basic_data.institutions.remove_role_title')}
              isLoading={updatedRoleForUsers.length > 0}
              onCancel={() => setRemoveRoleForUser('')}
              onAccept={handleRemoveRoleFromUser}
              dialogDataTestId="confirm-remove-role-dialog">
              {t('basic_data.institutions.remove_role_text')}
            </ConfirmDialog>
          )}
        </>
      )}
    </>
  );
};
