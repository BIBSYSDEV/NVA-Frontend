import React, { FC } from 'react';
import { RoleName } from '../../types/user.types';
import { Button, TextField, DialogActions } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import NormalText from '../../components/NormalText';

interface AddRoleModalContentProps {
  role: RoleName;
  closeModal: () => void;
}

export const AddRoleModalContent: FC<AddRoleModalContentProps> = ({ role, closeModal }) => {
  const { t } = useTranslation('admin');

  return (
    <>
      <NormalText>{t('users.add_role_info')}</NormalText>
      <TextField fullWidth label={t('users.username')} variant="outlined" helperText={t('search_for_user')} />
      <DialogActions>
        <Button variant="outlined" onClick={closeModal}>
          {t('common:close')}
        </Button>
      </DialogActions>
    </>
  );
};
