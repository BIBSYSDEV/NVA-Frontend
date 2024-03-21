import { Autocomplete, Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { fetchOrganization, OrganizationSearchParams, searchForOrganizations } from '../../../api/cristinApi';
import { ResultParam } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { OrganizationRenderOption } from '../../../components/OrganizationRenderOption';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getSortedSubUnits } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';

interface OrganizationFiltersProps {
  topLevelOrganizationId: string | null;
  unitId: string | null;
}

export const OrganizationFilters = ({ topLevelOrganizationId, unitId }: OrganizationFiltersProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm);
  const params = new URLSearchParams(history.location.search);
  const excludeSubunits = params.get(ResultParam.ExcludeSubunits) === 'true';
  const topLevelOrgParam = params.get(ResultParam.TopLevelOrganization);

  const topLevelOrganizationQuery = useQuery({
    queryKey: [topLevelOrganizationId],
    enabled: !!topLevelOrganizationId,
    queryFn: () => fetchOrganization(topLevelOrganizationId ?? ''),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });

  const organizationQueryParams: OrganizationSearchParams = {
    query: debouncedQuery,
  };
  const organizationSearchQuery = useQuery({
    enabled: !!debouncedQuery,
    queryKey: ['organization', organizationQueryParams],
    queryFn: () => searchForOrganizations(organizationQueryParams),
    meta: { errorMessage: t('feedback.error.get_institutions') },
  });

  const options = organizationSearchQuery.data?.hits ?? [];

  const subUnits = getSortedSubUnits(topLevelOrganizationQuery.data?.hasPart);
  const selectedSubUnit = subUnits.find((unit) => unit.id === unitId) ?? null;

  const isLoading = topLevelOrganizationQuery.isFetching || organizationSearchQuery.isFetching;

  const handleCheckedExcludeSubunits = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (topLevelOrgParam) {
      if (event.target.checked) {
        params.set(ResultParam.ExcludeSubunits, 'true');
      } else {
        params.delete(ResultParam.ExcludeSubunits);
      }
    }

    history.push({ search: params.toString() });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '0.5rem 1rem',
        flexDirection: { xs: 'column', lg: 'row' },
        width: '100%',
        alignItems: 'start',
      }}>
      <Autocomplete
        fullWidth
        size="small"
        options={options}
        inputMode="search"
        sx={{ minWidth: '15rem' }}
        getOptionLabel={(option) => getLanguageString(option.labels)}
        getOptionKey={(option) => option.id}
        filterOptions={(options) => options}
        onInputChange={(_, value, reason) => {
          if (reason !== 'reset') {
            setSearchTerm(value);
          }
        }}
        onChange={(_, selectedInstitution) => {
          if (selectedInstitution !== topLevelOrganizationId) {
            const params = new URLSearchParams(history.location.search);
            if (selectedInstitution) {
              params.set(ResultParam.TopLevelOrganization, selectedInstitution.id);
            } else {
              params.delete(ResultParam.TopLevelOrganization);
              params.delete(ResultParam.ExcludeSubunits);
            }
            params.set(ResultParam.From, '0');
            params.delete(ResultParam.Unit);
            history.push({ search: params.toString() });
            setSearchTerm('');
          }
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        disabled={topLevelOrganizationQuery.isFetching}
        value={topLevelOrganizationQuery.data ?? null}
        loading={isLoading}
        renderOption={(props, option) => <OrganizationRenderOption key={option.id} props={props} option={option} />}
        renderInput={(params) => (
          <AutocompleteTextField
            {...params}
            variant="outlined"
            multiline
            isLoading={isLoading}
            data-testid={dataTestId.organization.searchField}
            placeholder={t('project.search_for_institution')}
            showSearchIcon
          />
        )}
      />

      <Autocomplete
        fullWidth
        size="small"
        options={subUnits}
        value={selectedSubUnit}
        inputMode="search"
        disabled={!topLevelOrganizationId || subUnits.length === 0}
        sx={{ minWidth: '15rem' }}
        getOptionLabel={(option) => getLanguageString(option.labels)}
        getOptionKey={(option) => option.id}
        onChange={(_, selectedUnit) => {
          const params = new URLSearchParams(history.location.search);
          if (selectedUnit) {
            params.set(ResultParam.Unit, selectedUnit.id);
          } else {
            params.delete(ResultParam.Unit);
          }
          params.set(ResultParam.From, '0');
          history.push({ search: params.toString() });
        }}
        renderOption={(props, option) => <OrganizationRenderOption key={option.id} props={props} option={option} />}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            multiline
            InputLabelProps={{ shrink: true }}
            data-testid={dataTestId.organization.subSearchField}
            placeholder={t('search.search_for_sub_unit')}
          />
        )}
      />

      <FormControlLabel
        sx={{ whiteSpace: 'nowrap' }}
        control={
          <Checkbox
            disabled={!topLevelOrganizationId}
            onChange={handleCheckedExcludeSubunits}
            checked={!!topLevelOrganizationId && excludeSubunits}
          />
        }
        label={t('tasks.nvi.exclude_subunits')}
      />
    </Box>
  );
};
