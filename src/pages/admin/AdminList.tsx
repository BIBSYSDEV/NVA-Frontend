import React, { FC, useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { TableRow, TableCell, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import NormalText from '../../components/NormalText';
import ConfirmDialog from '../../components/ConfirmDialog';
import { InstitutionUser, RoleName, UserRole } from '../../types/user.types';
import { NotificationVariant } from '../../types/notification.types';
import { getInstitutionUser, updateUserRoles } from '../../api/roleApi';
import { setNotification } from '../../redux/actions/notificationActions';

interface AdminListProps {
  admins: InstitutionUser[];
  refetchInstitutionUsers: () => void;
}

export const AdminList: FC<AdminListProps> = ({ admins, refetchInstitutionUsers }) => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const [adminToRemove, setAdminToRemove] = useState('');
  const [isLoadingRemoveRole, setIsLoadingRemoveRole] = useState(false);

  const removeAdmin = async () => {
    setIsLoadingRemoveRole(true);
    const currentUserResponse = await getInstitutionUser(adminToRemove);
    if (currentUserResponse) {
      if (currentUserResponse.error) {
        dispatch(setNotification(currentUserResponse.error, NotificationVariant.Error));
      } else {
        const newUser: InstitutionUser = {
          ...currentUserResponse,
          roles: currentUserResponse.roles.filter((role: UserRole) => role.rolename !== RoleName.INSTITUTION_ADMIN),
        };
        const updateUserResponse = await updateUserRoles(newUser);
        if (updateUserResponse) {
          if (updateUserResponse.error) {
            dispatch(setNotification(updateUserResponse.error, NotificationVariant.Error));
          } else {
            dispatch(setNotification(t('feedback:success.admin_removed')));
            refetchInstitutionUsers();
          }
        }
      }
    }
    setAdminToRemove('');
    setIsLoadingRemoveRole(false);
  };

  return (
    <>
      {admins.map((admin) => (
        <TableRow key={admin.username}>
          <TableCell>
            <NormalText>{admin.username}</NormalText>
          </TableCell>
          <TableCell>
            <Button color="secondary" size="small" variant="outlined" onClick={() => setAdminToRemove(admin.username)}>
              <DeleteIcon />
              {t('common:remove')}
            </Button>
          </TableCell>
        </TableRow>
      ))}
      <ConfirmDialog
        open={!!adminToRemove}
        onAccept={() => removeAdmin()}
        onCancel={() => setAdminToRemove('')}
        disableAccept={isLoadingRemoveRole}
        title={t('remove_admin_title')}>
        <NormalText>{t('remove_admin_text', { username: adminToRemove })}</NormalText>
      </ConfirmDialog>
    </>
  );
};
