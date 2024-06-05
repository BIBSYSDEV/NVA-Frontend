import { Autocomplete, AutocompleteProps, Avatar, Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchUsersByCustomer } from '../api/roleApi';
import { TicketSearchParam } from '../api/searchApi';
import { RootState } from '../redux/store';
import { InstitutionUser, RoleName } from '../types/user.types';
import { dataTestId } from '../utils/dataTestIds';
import { getInitials } from '../utils/general-helpers';
import { getFullName } from '../utils/user-helpers';
import { AutocompleteTextField } from './AutocompleteTextField';

interface CuratorSelectorProps extends Pick<AutocompleteProps<unknown, undefined, undefined, undefined>, 'sx'> {
  roleFilter: RoleName[];
}

export const CuratorSelector = ({ roleFilter, ...props }: CuratorSelectorProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customerId = user?.customerId ?? '';

  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const curatorsQuery = useQuery({
    queryKey: ['curators', customerId, roleFilter],
    enabled: !!customerId,
    queryFn: () => fetchUsersByCustomer(customerId, roleFilter),
    meta: { errorMessage: t('feedback.error.get_curators_for_institution') },
  });

  // Ensure current user is first in list of curators
  const curatorOptions = (curatorsQuery.data ?? []).sort((a, b) =>
    a.username === user?.nvaUsername ? -1 : b.username === user?.nvaUsername ? 1 : 0
  );

  const selectedCurator =
    curatorOptions.find((curator) => curator.username === searchParams.get(TicketSearchParam.Assignee)) ?? null;

  const CuratorAvatar = (curator: InstitutionUser | null) => {
    return (
      <Avatar sx={{ height: '1.5rem', width: '1.5rem', fontSize: 'inherit', bgcolor: 'primary.main' }}>
        {getInitials(getFullName(curator?.givenName, curator?.familyName))}
      </Avatar>
    );
  };

  return (
    <Autocomplete
      {...props}
      options={curatorOptions}
      value={selectedCurator}
      autoHighlight
      disabled={curatorsQuery.isPending}
      loading={curatorsQuery.isPending}
      getOptionLabel={(option) => getFullName(option.givenName, option.familyName)}
      isOptionEqualToValue={(option, value) => option.username === value?.username}
      onChange={(_, value) => {
        if (value) {
          searchParams.set(TicketSearchParam.Assignee, value.username);
        } else {
          searchParams.delete(TicketSearchParam.Assignee);
        }
        history.push({ search: searchParams.toString() });
      }}
      renderOption={(props, curator) => (
        <li {...props} key={curator.username}>
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {CuratorAvatar(curator)}
            <Typography>{getFullName(curator.givenName, curator.familyName)}</Typography>
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          data-testid={dataTestId.tasksPage.curatorSelector}
          variant="outlined"
          size="small"
          label={t('my_page.roles.curator')}
          isLoading={curatorsQuery.isPending}
          placeholder={t('common.search')}
          InputProps={{
            ...params.InputProps,
            startAdornment: CuratorAvatar(selectedCurator),
          }}
        />
      )}
    />
  );
};
