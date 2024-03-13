import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Autocomplete, Box, IconButton, Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchUser, fetchUsers } from '../api/roleApi';
import { StyledBaseContributorIndicator } from '../pages/registration/contributors_tab/ContributorIndicator';
import { RootState } from '../redux/store';
import { RoleName } from '../types/user.types';
import { dataTestId } from '../utils/dataTestIds';
import { getInitials } from '../utils/general-helpers';
import { getFullName } from '../utils/user-helpers';
import { AutocompleteTextField } from './AutocompleteTextField';

interface AssigneeSelectorProps {
  assignee: string | undefined;
  iconBackgroundColor: string;
  roleFilter: RoleName;
  onSelectAssignee: (assignee: string) => Promise<void>;
  canSetAssignee: boolean;
  isUpdating: boolean;
}

export const AssigneeSelector = ({
  assignee,
  iconBackgroundColor,
  roleFilter,
  onSelectAssignee,
  canSetAssignee,
  isUpdating,
}: AssigneeSelectorProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customerId = user?.customerId ?? '';

  const [showCuratorSearch, setShowCuratorSearch] = useState(false);

  const curatorsQuery = useQuery({
    queryKey: ['curators', customerId, roleFilter],
    enabled: showCuratorSearch && !!customerId,
    queryFn: () => fetchUsers(customerId, roleFilter),
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
  const assigneeInitials = getInitials(assigneeName);

  return showCuratorSearch ? (
    <Autocomplete
      options={curatorOptions}
      renderOption={(props, option) => (
        <li {...props} key={option.username}>
          {getFullName(option.givenName, option.familyName)}
        </li>
      )}
      disabled={isLoading}
      onChange={async (_, value) => {
        try {
          await onSelectAssignee(value?.username ?? '');
        } finally {
          setShowCuratorSearch(false);
        }
      }}
      onBlur={() => setShowCuratorSearch(false)}
      getOptionLabel={(option) => getFullName(option.givenName, option.familyName)}
      isOptionEqualToValue={(option, value) => option.username === value?.username}
      value={assigneeQuery.data ?? null}
      loading={isUpdating || curatorsQuery.isLoading}
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
