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
import { dataTestId } from '../../utils/dataTestIds';
import { getLanguageString } from '../../utils/translation-helpers';

interface ViewingScopeCellProps {
  user: InstitutionUser;
  options: Organization[];
}

export const ViewingScopeCell = ({ user, options }: ViewingScopeCellProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('admin');
  const [isUpdating, setIsUpdating] = useState(false);
  const selectedId = user.viewingScope?.includedUnits[0] ?? '';
  const selectedOption = options.find((option) => option.id === selectedId) ?? null;

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
      aria-label={t('users.area_of_responsibility')}
      data-testid={dataTestId.myInstitutionUsersPage.areaOfResponsibilifyField}
      options={options}
      value={selectedOption}
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
          fullWidth
          placeholder={t('users.area_of_responsibility_placeholder')}
        />
      )}
    />
  );
};
