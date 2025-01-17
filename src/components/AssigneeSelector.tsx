import { Autocomplete } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchUserQuery } from '../api/hooks/useFetchUserQuery';
import { fetchUsersByCustomer } from '../api/roleApi';
import { RootState } from '../redux/store';
import { RoleName } from '../types/user.types';
import { dataTestId } from '../utils/dataTestIds';
import { getFullName } from '../utils/user-helpers';
import { AutocompleteTextField } from './AutocompleteTextField';

interface AssigneeSelectorProps {
  assignee: string | undefined;
  roleFilter: RoleName;
  onSelectAssignee: (assignee: string) => Promise<void>;
  canSetAssignee: boolean;
  isUpdating: boolean;
}

export const AssigneeSelector = ({
  assignee,
  roleFilter,
  onSelectAssignee,
  canSetAssignee,
  isUpdating,
}: AssigneeSelectorProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customerId = user?.customerId ?? '';

  const curatorsQuery = useQuery({
    queryKey: ['curators', customerId, roleFilter],
    enabled: !!customerId,
    queryFn: () => fetchUsersByCustomer(customerId, roleFilter),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });

  // Ensure current user is first in list of curators
  const curatorOptions = (curatorsQuery.data ?? []).sort((a, b) =>
    a.username === user?.nvaUsername ? -1 : b.username === user?.nvaUsername ? 1 : 0
  );

  const assigneeQuery = useFetchUserQuery(assignee ?? '');
  const isLoading = isUpdating || assigneeQuery.isFetching;

  return (
    <Autocomplete
      sx={{ mb: '0.5rem' }}
      value={assigneeQuery.data ?? null}
      disabled={!canSetAssignee || isLoading}
      loading={curatorsQuery.isFetching}
      options={curatorOptions}
      getOptionLabel={(option) => getFullName(option.givenName, option.familyName)}
      isOptionEqualToValue={(option, value) => option.username === value?.username}
      renderOption={({ key, ...props }, option) => (
        <li {...props} key={option.username}>
          {getFullName(option.givenName, option.familyName)}
        </li>
      )}
      onChange={async (_, value) => {
        await onSelectAssignee(value?.username ?? '');
      }}
      renderInput={(params) => (
        <AutocompleteTextField
          data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeSearchField}
          {...params}
          label={t('my_page.roles.curator')}
          isLoading={isLoading}
          placeholder={t('common.search')}
          showSearchIcon
        />
      )}
    />
  );
};
