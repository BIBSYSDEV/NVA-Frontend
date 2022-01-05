import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { RoleApiPath } from '../../api/apiPaths';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { setNotification } from '../../redux/actions/notificationActions';
import { Organization } from '../../types/institution.types';
import { NotificationVariant } from '../../types/notification.types';
import { InstitutionUser } from '../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { getLanguageString } from '../../utils/translation-helpers';

interface ViewingScopeCellProps {
  user: InstitutionUser;
  options: Organization[];
}

export const ViewingScopeCell = ({ user, options }: ViewingScopeCellProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);
  const selectedId = user.viewingScope?.includedUnits[0] ?? '';
  const selectedOption = options.find((option) => option.id === selectedId);

  const updateUser = async (newScopeId?: string) => {
    if (!newScopeId) {
      return;
    }
    setIsUpdating(true);
    const newUser: InstitutionUser = { ...user, viewingScope: { includedUnits: [newScopeId] } };

    const updateUserResponse = await authenticatedApiRequest({
      url: `${RoleApiPath.Users}/${user.username}`,
      method: 'PUT',
      data: newUser,
    });

    if (isSuccessStatus(updateUserResponse.status)) {
      dispatch(setNotification(t('feedback:success.update_institution_user')));
    } else if (isErrorStatus(updateUserResponse.status)) {
      dispatch(setNotification(t('feedback:error.update_institution_user'), NotificationVariant.Error));
    }
    setIsUpdating(false);
  };

  return (
    <Autocomplete
      options={options}
      value={selectedOption ?? null}
      getOptionLabel={(option) => getLanguageString(option.name)}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {getLanguageString(option.name)}
        </li>
      )}
      disabled={isUpdating}
      onChange={(_, value) => updateUser(value?.id)}
      renderInput={(params) => (
        <TextField
          {...params}
          disabled={isUpdating}
          // data-testid={dataTestId.organization.searchField}
          InputProps={{ ...params.InputProps, 'aria-label': t('admin:users.area_of_responsibility') }}
          fullWidth
        />
      )}
    />
  );
};
