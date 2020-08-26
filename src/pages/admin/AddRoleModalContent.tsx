import React, { FC, useState } from 'react';
import { RoleName, InstitutionUser } from '../../types/user.types';
import { Button, TextField, DialogActions } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import NormalText from '../../components/NormalText';
import UserList from './UserList';

interface AddRoleModalContentProps {
  role: RoleName;
  users: InstitutionUser[];
  closeModal: () => void;
}

export const AddRoleModalContent: FC<AddRoleModalContentProps> = ({ role, users, closeModal }) => {
  const { t } = useTranslation('admin');
  const [searchTerm, setSearchTerm] = useState('');
  const filteredUsers = users.filter((user) => user.username.toLocaleLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <NormalText>{t('users.add_role_info')}</NormalText>
      <TextField
        fullWidth
        onChange={(event) => setSearchTerm(event.target.value)}
        label={t('users.username')}
        variant="outlined"
        helperText={t('search_for_user')}
      />

      <UserList userList={filteredUsers} allowAddRole={role} />

      <DialogActions>
        <Button variant="outlined" onClick={closeModal}>
          {t('common:close')}
        </Button>
      </DialogActions>
    </>
  );
};
