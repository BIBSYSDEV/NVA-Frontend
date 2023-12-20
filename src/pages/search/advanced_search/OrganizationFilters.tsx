import { Autocomplete, Box, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { OrganizationSearchParams, fetchOrganization, searchForOrganizations } from '../../../api/cristinApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getSortedSubUnits } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { AdvancedSearchQueryParams } from './AdvancesSearchPage';

interface OrganizationFiltersProps {
  institutionId: string | null;
  subUnitId: string | null;
}

export const OrganizationFilters = ({ institutionId, subUnitId }: OrganizationFiltersProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm);

  const organizationQuery = useQuery({
    queryKey: [institutionId],
    enabled: !!institutionId,
    queryFn: () => fetchOrganization(institutionId ?? ''),
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
  const selectedSubUnit = subUnits.find((unit) => unit.id === subUnitId) ?? null;

  const isLoading = organizationQuery.isFetching || institutionSearchQuery.isFetching;

  return (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <Autocomplete
        options={options}
        inputMode="search"
        fullWidth
        sx={{ maxWidth: '20rem' }}
        getOptionLabel={(option) => getLanguageString(option.labels)}
        filterOptions={(options) => options}
        onInputChange={(_, value, reason) => {
          if (reason !== 'reset') {
            setSearchTerm(value);
          }
        }}
        onChange={(_, selectedInstitution) => {
          if (selectedInstitution !== institutionId) {
            const params = new URLSearchParams(history.location.search);
            if (selectedInstitution) {
              params.set(AdvancedSearchQueryParams.Institution, selectedInstitution.id);
            } else {
              params.delete(AdvancedSearchQueryParams.Institution);
            }

            params.delete(AdvancedSearchQueryParams.SubUnit);
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
            label={t('common.institution')}
            placeholder={t('project.search_for_institution')}
            showSearchIcon
          />
        )}
      />

      <Autocomplete
        options={subUnits}
        value={selectedSubUnit}
        inputMode="search"
        disabled={!institutionId || subUnits.length === 0}
        fullWidth
        sx={{ maxWidth: '20rem' }}
        getOptionLabel={(option) => getLanguageString(option.labels)}
        onChange={(_, selectedUnit) => {
          const params = new URLSearchParams(history.location.search);
          if (selectedUnit) {
            params.set(AdvancedSearchQueryParams.SubUnit, selectedUnit.id);
          } else {
            params.delete(AdvancedSearchQueryParams.SubUnit);
          }

          history.push({ search: params.toString() });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            multiline
            InputLabelProps={{ shrink: true }}
            data-testid={dataTestId.organization.subSearchField}
            label={t('search.sub_unit')}
            placeholder={t('search.search_for_sub_unit')}
          />
        )}
      />
    </Box>
  );
};
