import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Autocomplete, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchUser, fetchUsers } from '../api/roleApi';
import { StyledBaseContributorIndicator } from '../pages/registration/contributors_tab/ContributorIndicator';
import { RootState } from '../redux/store';
import { RoleName } from '../types/user.types';
import { dataTestId } from '../utils/dataTestIds';
import { getContributorInitials } from '../utils/registration-helpers';
import { getFullName } from '../utils/user-helpers';
import { AutocompleteTextField } from './AutocompleteTextField';

interface AssigneeSelectorProps {
  assignee?: string;
  canSetAssignee: boolean; // merge with onSelect prop?
  onSelectAssignee: (assignee: string) => Promise<unknown> | unknown;
  isUpdating?: boolean;
  roleFilter: RoleName;
  iconBackgroundColor: string; // TODO: better type?
}

export const AssigneeSelector = ({
  assignee,
  canSetAssignee,
  onSelectAssignee,
  isUpdating = false,
  roleFilter,
  iconBackgroundColor,
}: AssigneeSelectorProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customerId = user?.customerId ?? '';

  const [showCuratorSearch, setShowCuratorSearch] = useState(false);

  const curatorsQuery = useQuery({
    queryKey: ['curators', customerId, roleFilter],
    enabled: showCuratorSearch && !!customerId,
    queryFn: () => (customerId ? fetchUsers(customerId, roleFilter) : undefined),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });

  // Ensure current user is first in list of curators
  const curatorOptions = (curatorsQuery.data ?? []).sort((a, b) =>
    a.username === user?.nvaUsername ? -1 : b.username === user?.nvaUsername ? 1 : 0
  );

  const assigneeQuery = useQuery({
    enabled: !!assignee,
    queryKey: [assignee],
    queryFn: () => (assignee ? fetchUser(assignee) : undefined),
    meta: { errorMessage: t('feedback.error.get_person') },
  });

  const isLoading = isUpdating || curatorsQuery.isLoading || assigneeQuery.isFetching;

  const assigneeName = getFullName(assigneeQuery.data?.givenName, assigneeQuery.data?.familyName);
  const assigneeInitials = getContributorInitials(assigneeName);

  return showCuratorSearch ? (
    <Autocomplete
      options={curatorOptions}
      renderOption={(props, option) => (
        <li {...props} key={option.username}>
          {getFullName(option.givenName, option.familyName)}
        </li>
      )}
      disabled={isLoading}
      filterOptions={(options, state) => {
        const filter = state.inputValue.toLocaleLowerCase();
        return options.filter((option) => {
          const name = getFullName(option.givenName, option.familyName).toLocaleLowerCase();
          return name.includes(filter);
        });
      }}
      onChange={async (_, value) => {
        try {
          await onSelectAssignee(value?.username ?? '');
        } finally {
          setShowCuratorSearch(false);
        }
      }}
      onBlur={() => setShowCuratorSearch(false)}
      getOptionLabel={(option) => getFullName(option.givenName, option.familyName)}
      isOptionEqualToValue={(option, value) => option.username === value.username}
      value={assigneeQuery.data}
      loading={isUpdating || curatorsQuery.isLoading}
      sx={{ mb: '0.5rem' }}
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
  ) : (
    <Box sx={{ height: '1.75rem', display: 'flex', gap: '0.5rem', mb: '0.5rem' }}>
      <Tooltip title={`${t('my_page.roles.curator')}: ${assignee ? assigneeName : t('common.none')}`}>
        <StyledBaseContributorIndicator
          sx={{ bgcolor: iconBackgroundColor }}
          data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeIndicator}>
          {assignee ? assigneeInitials : ''}
        </StyledBaseContributorIndicator>
      </Tooltip>
      {canSetAssignee && (
        <IconButton
          data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeButton}
          title={t('registration.public_page.tasks_panel.assign_curator')}
          onClick={() => setShowCuratorSearch(true)}>
          <MoreHorizIcon />
        </IconButton>
      )}
    </Box>
  );
};
