import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchUser } from '../../../api/roleApi';
import { fetchEmployees } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { RootState } from '../../../redux/store';
import { CristinPerson } from '../../../types/user.types';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getFullCristinName, getValueByKey } from '../../../utils/user-helpers';

export const AddCuratorDialog = (dialogProps: DialogProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  const [selectedPerson, setSelectedPerson] = useState<CristinPerson | null>(null);

  const employeeSearchQuery = useQuery({
    enabled: dialogProps.open && !!topOrgCristinId && !!debouncedSearchQuery && debouncedSearchQuery === searchQuery,
    queryKey: ['employees', topOrgCristinId, 20, 1, debouncedSearchQuery],
    queryFn: ({ signal }) => fetchEmployees(topOrgCristinId, 20, 1, debouncedSearchQuery, signal),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });

  const personCristinIdentifier = getValueByKey('CristinIdentifier', selectedPerson?.identifiers);
  const topOrgCristinIdentifier = getIdentifierFromId(topOrgCristinId);
  const username =
    personCristinIdentifier && topOrgCristinIdentifier ? `${personCristinIdentifier}@${topOrgCristinIdentifier}` : '';

  const userQuery = useQuery({
    enabled: dialogProps.open && !!selectedPerson && !!username,
    queryKey: [username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: false }, // No error message, since a Cristin Person will lack User if they have not logged in yet
    retry: false,
  });

  const isLoading = employeeSearchQuery.isFetching;

  return (
    <Dialog {...dialogProps} maxWidth="md" fullWidth>
      <DialogTitle>{t('editor.curators.add_curator')}</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={employeeSearchQuery.data?.hits ?? []}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {getFullCristinName(option.names)}
            </li>
          )}
          onInputChange={(_, value, reason) => {
            if (reason === 'clear' || reason === 'reset') {
              setSearchQuery('');
              setSelectedPerson(null);
            } else {
              setSearchQuery(value);
            }
          }}
          onChange={async (_, value) => {
            setSearchQuery('');
            setSelectedPerson(value);
          }}
          getOptionLabel={(option) => getFullCristinName(option.names)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={isLoading}
          sx={{ mb: '1rem' }}
          renderInput={(params) => (
            <AutocompleteTextField
              // data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeSearchField}
              {...params}
              label={t('common.person')}
              isLoading={isLoading}
              placeholder={t('common.search')}
              showSearchIcon
            />
          )}
        />

        {selectedPerson && userQuery.data && (
          <>
            <Typography variant="h3">{t('editor.curators.area_of_responsibility')}</Typography>
            <Typography>{userQuery.data.viewingScope.includedUnits.join(', ')}</Typography>

            <Typography variant="h3">{t('my_page.my_profile.heading.roles')}</Typography>
            <Typography>{userQuery.data.roles.map((r) => r.rolename).join(', ')}</Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dialogProps.onClose?.({}, 'escapeKeyDown')}>{t('common.cancel')}</Button>
        <Button>{t('common.add')}</Button>
      </DialogActions>
    </Dialog>
  );
};
