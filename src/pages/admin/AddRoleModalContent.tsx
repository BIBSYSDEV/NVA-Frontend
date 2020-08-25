import React, { FC } from 'react';
import { RoleName, InstitutionUser } from '../../types/user.types';
import { Button, TextField, DialogActions } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import NormalText from '../../components/NormalText';

interface AddRoleModalContentProps {
  role: RoleName;
}

export const AddRoleModalContent: FC<AddRoleModalContentProps> = ({ role }) => {
  const { t } = useTranslation('admin');
  // const handleSubmitUser = async () => {
  //     const newUserRole = await assignUserRole(user.institution, username, role);
  //     if (newUserRole) {
  //       if (newUserRole.error) {
  //         dispatch(setNotification(newUserRole.error, NotificationVariant.Error));
  //       } else if (newUserRole.info) {
  //         dispatch(setNotification(newUserRole.info, NotificationVariant.Info));
  //       } else {
  //         setCurrentUserList([...currentUserList, newUserRole]);
  //         dispatch(setNotification(t('feedback:success.added_role')));
  //       }
  //     }
  //     toggleShowNewUserForm();
  //   };

  return (
    <>
      <NormalText>
        Om du ikke finner brukeren, så må du sjekke at vedkommende er tilknyttet din institusjon og har logget på
        tjenesten tidligere.
      </NormalText>
      <Autocomplete
        options={[]}
        getOptionLabel={(option) => option.username}
        value={null}
        getOptionSelected={(option: InstitutionUser, value: InstitutionUser | null) =>
          value?.username === option.username
        }
        onChange={() => {}}
        renderInput={(params) => (
          <TextField {...params} label={t('users.username')} variant="outlined" helperText={t('search_for_user')} />
        )}
      />
      <DialogActions>
        <Button variant="contained" color="primary">
          Add user
        </Button>
      </DialogActions>
    </>
  );
};
