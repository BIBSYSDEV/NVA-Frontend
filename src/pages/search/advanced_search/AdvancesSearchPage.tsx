import { Autocomplete, Box, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { OrganizationSearchParams, fetchOrganization, searchForOrganizations } from '../../../api/cristinApi';
import { FetchResultsParams, ResultParam, fetchResults } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { BetaFunctionality } from '../../../components/BetaFunctionality';
import { SearchForm } from '../../../components/SearchForm';
import { SortSelector } from '../../../components/SortSelector';
import { RegistrationFieldName } from '../../../types/publicationFieldNames';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getSortedSubUnits } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { RegistrationSearch } from '../registration_search/RegistrationSearch';

enum AdvancedQueryParams {
  Institution = 'institution',
  SubUnit = 'subUnit',
}

export const AdvancedSearchPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const institutionId = params.get(AdvancedQueryParams.Institution);
  const subUnitId = params.get(AdvancedQueryParams.SubUnit);

  const unitFilter = subUnitId ?? institutionId;

  const resultSearchQueryConfig: FetchResultsParams = {
    title: params.get(ResultParam.Title),
    unit: unitFilter,
  };

  const resultSearchQuery = useQuery({
    queryKey: ['registrations', resultSearchQueryConfig],
    queryFn: () => fetchResults(resultSearchQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
    keepPreviousData: true,
  });

  return (
    <Box component={BetaFunctionality} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <SearchForm sx={{ width: '100%' }} paramName={ResultParam.Title} placeholder={t('search.search_for_title')} />
        <SortSelector
          options={[
            {
              orderBy: RegistrationFieldName.ModifiedDate,
              sortOrder: 'desc',
              label: t('search.sort_by_modified_date'),
            },
            {
              orderBy: RegistrationFieldName.PublishedDate,
              sortOrder: 'desc',
              label: t('search.sort_by_published_date_desc'),
            },
            {
              orderBy: RegistrationFieldName.PublishedDate,
              sortOrder: 'asc',
              label: t('search.sort_by_published_date_asc'),
            },
          ]}
          sortKey="sort"
          orderKey="order"
        />
      </Box>

      <OrganizationFilters institutionId={institutionId} subUnitId={subUnitId} />

      <RegistrationSearch registrationQuery={resultSearchQuery} />
    </Box>
  );
};

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
    // meta: { errorMessage: t('feedback.error.get_institution') },
  });

  const options = institutionSearchQuery.data?.hits ?? [];

  const subUnits = getSortedSubUnits(organizationQuery.data?.hasPart);
  const selectedSubUnit = subUnits.find((unit) => unit.id === subUnitId) ?? null;

  return (
    <Box sx={{ width: '100%', display: 'flex', gap: '1rem' }}>
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
          const params = new URLSearchParams(history.location.search);
          if (selectedInstitution) {
            params.set(AdvancedQueryParams.Institution, selectedInstitution.id);
          } else {
            params.delete(AdvancedQueryParams.Institution);
          }
          params.delete(AdvancedQueryParams.SubUnit);
          history.push({ search: params.toString() });
          setSearchTerm('');
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        disabled={organizationQuery.isFetching}
        value={organizationQuery.data ?? null}
        loading={institutionSearchQuery.isFetching}
        renderInput={(params) => (
          <AutocompleteTextField
            {...params}
            variant="outlined"
            isLoading={institutionSearchQuery.isFetching}
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
            params.set(AdvancedQueryParams.SubUnit, selectedUnit.id);
          } else {
            params.delete(AdvancedQueryParams.SubUnit);
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
            placeholder={t('common.search')}
          />
        )}
      />
    </Box>
  );
};
