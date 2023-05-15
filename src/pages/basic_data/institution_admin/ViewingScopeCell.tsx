import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { RoleApiPath } from '../../../api/apiPaths';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { setNotification } from '../../../redux/notificationSlice';
import { Organization } from '../../../types/organization.types';
import { InstitutionUser } from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';

interface ViewingScopeCellProps {
  user: InstitutionUser;
  options: Organization[];
}

export const ViewingScopeCell = ({ user, options }: ViewingScopeCellProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [userCopy, setUserCopy] = useState(user); // Needed if empty scope before adding a new
  const selectedId = userCopy.viewingScope?.includedUnits[0] ?? '';
  const selectedOption = options.find((option) => option.id === selectedId) ?? null;

  const updateUser = async (newScopeId?: string) => {
    if (!newScopeId) {
      return;
    }
    setIsUpdating(true);

    const newUser: InstitutionUser = {
      ...userCopy,
      viewingScope: { type: 'ViewingScope', includedUnits: [newScopeId] },
    };
    const updateUserResponse = await authenticatedApiRequest({
      url: `${RoleApiPath.Users}/${userCopy.username}`,
      method: 'PUT',
      data: newUser,
    });

    if (isSuccessStatus(updateUserResponse.status)) {
      setUserCopy(newUser);
      dispatch(setNotification({ message: t('feedback.success.update_institution_user'), variant: 'success' }));
    } else if (isErrorStatus(updateUserResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.update_institution_user'), variant: 'error' }));
    }
    setIsUpdating(false);
  };

  return (
    <Autocomplete
      aria-label={t('editor.curators.area_of_responsibility')}
      data-testid={dataTestId.myInstitutionUsersPage.areaOfResponsibilityField}
      options={options}
      value={selectedOption}
      getOptionLabel={(option) => getLanguageString(option.labels)}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {getLanguageString(option.labels)}
        </li>
      )}
      disabled={isUpdating}
      onChange={(_, value) => updateUser(value?.id)}
      renderInput={(params) => (
        <TextField
          {...params}
          disabled={isUpdating}
          fullWidth
          placeholder={t('editor.curators.area_of_responsibility_placeholder')}
        />
      )}
    />
  );
};
