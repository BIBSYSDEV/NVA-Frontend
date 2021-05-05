import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextField, DialogActions, InputAdornment, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { RoleName, InstitutionUser } from '../../types/user.types';
import UserList from './UserList';

interface AddRoleModalContentProps {
  role: RoleName;
  users: InstitutionUser[];
  tableCaption: string;
  closeModal: () => void;
  refetchUsers?: () => void;
}

export const AddRoleModalContent = ({
  role,
  users,
  tableCaption,
  closeModal,
  refetchUsers,
}: AddRoleModalContentProps) => {
  const { t } = useTranslation('admin');
  const [searchTerm, setSearchTerm] = useState('');
  const filteredUsers = users.filter((user) => {
    const name = `${user.givenName} ${user.familyName}`;
    return (
      user.username.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    );
  });

  return (
    <>
      <Typography data-testid="add-role-info">{t('users.add_role_info')}</Typography>
      <TextField
        autoFocus
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={(event) => setSearchTerm(event.target.value)}
        label={t('users.username')}
        variant="outlined"
        helperText={t('search_for_user')}
        data-testid="add-role-search-box"
      />

      <UserList
        userList={filteredUsers}
        roleToAdd={role}
        alwaysShowPagination
        refetchUsers={refetchUsers}
        tableCaption={tableCaption}
      />

      <DialogActions>
        <Button variant="outlined" onClick={closeModal} data-testid="add-role-close-button">
          {t('common:close')}
        </Button>
      </DialogActions>
    </>
  );
};
