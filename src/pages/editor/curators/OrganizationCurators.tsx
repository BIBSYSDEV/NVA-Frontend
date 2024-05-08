import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import { Autocomplete, Box, MenuItem, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchResource } from '../../../api/commonApi';
import { fetchUsers } from '../../../api/roleApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { OrganizationRenderOption } from '../../../components/OrganizationRenderOption';
import { RootState } from '../../../redux/store';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getSortedSubUnits } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { getFullName } from '../../../utils/user-helpers';
import { rolesWithAreaOfResponsibility } from '../../basic_data/institution_admin/edit_user/TasksFormSection';
import { OrganizationCuratorsAccordion } from './OrganizationCuratorsAccordion';

export interface OrganizationCuratorsProps {
  heading: string;
  canEditUsers?: boolean;
}

enum SearchTypeValue {
  Unit,
  Person,
}

export const OrganizationCurators = ({ heading, canEditUsers = false }: OrganizationCuratorsProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const organizationId = user?.topOrgCristinId;
  const customerId = user?.customerId;

  const [searchType, setSearchType] = useState(SearchTypeValue.Unit);
  const [searchValue, setSearchValue] = useState('');

  const organizationQuery = useQuery({
    queryKey: ['organization', organizationId],
    enabled: !!organizationId,
    queryFn: organizationId ? () => fetchResource<Organization>(organizationId) : undefined,
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  const curatorsQuery = useQuery({
    queryKey: ['curators', customerId],
    enabled: !!customerId,
    queryFn: () => (customerId ? fetchUsers(customerId, rolesWithAreaOfResponsibility) : undefined),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });

  const allSubUnits = getSortedSubUnits(organizationQuery.data?.hasPart);
  const allCurators = curatorsQuery.data ?? [];

  return (
    <>
      <Helmet>
        <title>{heading}</title>
      </Helmet>
      <Typography variant="h1" sx={{ mb: '1rem' }}>
        {heading}
      </Typography>

      {organizationQuery.isLoading || curatorsQuery.isLoading ? (
        <ListSkeleton height={100} minWidth={100} />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Box sx={{ display: 'flex', gap: '0.5rem', flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              select
              sx={{ width: '9rem', '.MuiSelect-select': { display: 'flex', gap: '0.5rem' } }}
              SelectProps={{ sx: { bgcolor: 'registration.main' } }}
              size="small"
              value={searchType}
              inputProps={{ 'aria-label': t('common.type') }}
              onChange={(event) => {
                setSearchType(event.target.value as unknown as SearchTypeValue);
                setSearchValue('');
              }}>
              <MenuItem value={SearchTypeValue.Unit} sx={{ display: 'flex', gap: '0.5rem' }}>
                <AccountBalanceIcon fontSize="small" />
                {t('registration.contributors.department')}
              </MenuItem>
              <MenuItem value={SearchTypeValue.Person} sx={{ display: 'flex', gap: '0.5rem' }}>
                <PersonIcon fontSize="small" />
                {t('my_page.roles.curator')}
              </MenuItem>
            </TextField>

            {searchType === SearchTypeValue.Unit ? (
              <Autocomplete
                fullWidth
                size="small"
                value={allSubUnits.find((unit) => unit.id === searchValue) ?? null}
                data-testid={dataTestId.editor.organizationOverviewSearchField}
                options={allSubUnits}
                inputMode="search"
                getOptionLabel={(option) => getLanguageString(option.labels)}
                renderOption={(props, option) => (
                  <OrganizationRenderOption key={option.id} props={props} option={option} />
                )}
                filterOptions={(options, state) =>
                  options.filter(
                    (option) =>
                      Object.values(option.labels).some((label) =>
                        label.toLowerCase().includes(state.inputValue.toLowerCase())
                      ) || getIdentifierFromId(option.id).includes(state.inputValue)
                  )
                }
                getOptionKey={(option) => option.id}
                onChange={(_, selectedUnit) => setSearchValue(selectedUnit?.id ?? '')}
                renderInput={(params) => (
                  <AutocompleteTextField
                    {...params}
                    showSearchIcon
                    variant="outlined"
                    placeholder={t('editor.curators.search_for_unit')}
                  />
                )}
              />
            ) : (
              <Autocomplete
                fullWidth
                size="small"
                value={allCurators.find((curator) => curator.username === searchValue) ?? null}
                data-testid={dataTestId.editor.organizationOverviewSearchField}
                options={curatorsQuery.data ?? []}
                inputMode="search"
                getOptionLabel={(option) => getFullName(option.givenName, option.familyName)}
                filterOptions={(options, state) =>
                  options.filter((option) =>
                    getFullName(option.givenName, option.familyName)
                      .toLowerCase()
                      .includes(state.inputValue.toLowerCase())
                  )
                }
                getOptionKey={(option) => option.username}
                onChange={(_, selectedUser) => setSearchValue(selectedUser?.username ?? '')}
                renderInput={(params) => (
                  <AutocompleteTextField
                    {...params}
                    showSearchIcon
                    variant="outlined"
                    placeholder={t('editor.curators.search_for_curator')}
                  />
                )}
              />
            )}
          </Box>

          {organizationQuery.data && (
            <OrganizationCuratorsAccordion
              organization={organizationQuery.data}
              unitSearch={searchType === SearchTypeValue.Unit ? searchValue : undefined}
              curatorSearch={searchType === SearchTypeValue.Person ? searchValue : undefined}
              curators={curatorsQuery.data ?? []}
              refetchCurators={curatorsQuery.refetch}
              canEditUsers={canEditUsers}
              parentOrganizationIds={[]}
            />
          )}
        </Box>
      )}
    </>
  );
};
