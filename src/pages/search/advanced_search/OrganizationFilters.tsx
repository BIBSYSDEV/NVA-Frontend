import { Autocomplete, Box, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { OrganizationSearchParams, fetchOrganization, searchForOrganizations } from '../../../api/cristinApi';
import { ResultParam } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
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

  const organizationQuery = useQuery({
    queryKey: [topLevelOrganizationId],
    enabled: !!topLevelOrganizationId,
    queryFn: () => fetchOrganization(topLevelOrganizationId ?? ''),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });

  const institutionQueryParams: OrganizationSearchParams = {
    query: debouncedQuery,
  };
  const institutionSearchQuery = useQuery({
    enabled: !!debouncedQuery,
    queryKey: ['organization', institutionQueryParams],
    queryFn: () => searchForOrganizations(institutionQueryParams),
    meta: { errorMessage: t('feedback.error.get_institutions') },
  });

  const options = institutionSearchQuery.data?.hits ?? [];

  const subUnits = getSortedSubUnits(organizationQuery.data?.hasPart);
  const selectedSubUnit = subUnits.find((unit) => unit.id === unitId) ?? null;

  const isLoading = organizationQuery.isFetching || institutionSearchQuery.isFetching;

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem 1rem', flexWrap: 'wrap' }}>
      <Autocomplete
        options={options}
        inputMode="search"
        sx={{ width: '20rem' }}
        getOptionLabel={(option) => getLanguageString(option.labels)}
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
            }
            params.set(ResultParam.From, '0');
            params.delete(ResultParam.Unit);
            history.push({ search: params.toString() });
            setSearchTerm('');
          }
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        disabled={organizationQuery.isFetching}
        value={organizationQuery.data ?? null}
        loading={isLoading}
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
        options={subUnits}
        value={selectedSubUnit}
        inputMode="search"
        disabled={!topLevelOrganizationId || subUnits.length === 0}
        sx={{ width: '20rem' }}
        getOptionLabel={(option) => getLanguageString(option.labels)}
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
    </Box>
  );
};
