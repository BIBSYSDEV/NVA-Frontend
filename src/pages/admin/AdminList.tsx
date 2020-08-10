import React, { FC, useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { TableRow, TableCell, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import NormalText from '../../components/NormalText';
import { InstitutionUser, RoleName, UserRole } from '../../types/user.types';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getInstitutionUser, updateUserRoles } from '../../api/roleApi';

interface AdminListProps {
  admins: InstitutionUser[];
}

export const AdminList: FC<AdminListProps> = ({ admins }) => {
  const { t } = useTranslation('admin');
  const [adminToRemove, setAdminToRemove] = useState('');

  const removeAdmin = async () => {
    console.log('RM', adminToRemove);
    const currentUserResponse = await getInstitutionUser(adminToRemove);
    if (currentUserResponse) {
      if (currentUserResponse.error) {
        //TODO
      } else {
        const newUser: InstitutionUser = {
          ...currentUserResponse,
          roles: currentUserResponse.roles.filter((role: UserRole) => role.rolename !== RoleName.INSTITUTION_ADMIN),
        };
        const updateUserResponse = await updateUserRoles(newUser);
        if (updateUserResponse) {
          if (updateUserResponse.error) {
            //TODO
          } else {
            //TODO
          }
        }
      }
    }

    setAdminToRemove('');
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
        title="Fjern Administrator">
        Er du sikker på at du vil fjerne {adminToRemove} som administrator?
      </ConfirmDialog>
    </>
  );
};
