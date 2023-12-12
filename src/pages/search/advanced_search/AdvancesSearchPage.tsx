import { Autocomplete, Box, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { OrganizationSearchParams, fetchOrganization, searchForOrganizations } from '../../../api/cristinApi';
import { FetchResultsParams, ResultParam, fetchResults } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { BetaFunctionality } from '../../../components/BetaFunctionality';
import { SearchForm } from '../../../components/SearchForm';
import { SortSelector } from '../../../components/SortSelector';
import { setNotification } from '../../../redux/notificationSlice';
import { Organization } from '../../../types/organization.types';
import { RegistrationFieldName } from '../../../types/publicationFieldNames';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getLanguageString } from '../../../utils/translation-helpers';
import { RegistrationSearch } from '../registration_search/RegistrationSearch';

export const AdvancedSearchPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const topLevelOrganization = params.get(ResultParam.TopLevelOrganization);
  const resultSearchQueryConfig: FetchResultsParams = {
    title: params.get(ResultParam.Title),
    topLevelOrganization: topLevelOrganization,
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

      <OrganizationFilters currentTopLevelOrganization={topLevelOrganization} />

      <RegistrationSearch registrationQuery={resultSearchQuery} />
    </Box>
  );
};

interface OrganizationFiltersProps {
  currentTopLevelOrganization: string | null;
}

export const OrganizationFilters = ({ currentTopLevelOrganization }: OrganizationFiltersProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm);

  const organizationQuery = useQuery({
    queryKey: [currentTopLevelOrganization],
    enabled: !!currentTopLevelOrganization,
    queryFn: () => fetchOrganization(currentTopLevelOrganization ?? ''),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_institution'), variant: 'error' })),
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
  });

  const options = institutionSearchQuery.data?.hits ?? [];

  return (
    <Box sx={{ width: '100%', display: 'flex', gap: '1rem' }}>
      <Autocomplete
        options={options}
        inputMode="search"
        fullWidth
        sx={{ maxWidth: '30rem' }}
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
            params.set(ResultParam.TopLevelOrganization, selectedInstitution.id);
          } else {
            params.delete(ResultParam.TopLevelOrganization);
          }
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
            // data-testid={customDataTestId ?? dataTestId.organization.searchField}
            label={t('common.institution')}
            placeholder={t('project.search_for_institution')}
            showSearchIcon
          />
        )}
      />
      {organizationQuery.data?.hasPart && organizationQuery.data.hasPart.length > 0 && (
        <SubOrganizationFilter units={organizationQuery.data.hasPart} level={1} />
      )}
    </Box>
  );
};

interface SubOrganizationFilterProps {
  units: Organization[];
  level: number;
}

const subUnitParamName = 'subUnit';

const SubOrganizationFilter = ({ units, level }: SubOrganizationFilterProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const paramName = `${subUnitParamName}${level}`;
  const selectedUnitId = params.get(paramName);

  const selectedUnit = units.find((unit) => unit.id === selectedUnitId);

  return (
    <>
      <Autocomplete
        options={units}
        value={selectedUnit ?? null}
        inputMode="search"
        fullWidth
        sx={{ maxWidth: '30rem' }}
        getOptionLabel={(option) => getLanguageString(option.labels)}
        onChange={(_, selectedInstitution) => {
          const params = new URLSearchParams(history.location.search);
          if (selectedInstitution) {
            params.set(paramName, selectedInstitution.id);
          } else {
            params.delete(paramName);
          }

          const paramKeys = params.keys();
          for (const key of paramKeys) {
            if (key.startsWith(subUnitParamName) && key !== paramName) {
              const paramLevel = +key[key.length - 1];
              if (paramLevel >= level) {
                params.delete(key);
              }
            }
          }

          history.push({ search: params.toString() });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            // data-testid={dataTestId.organization.subSearchField}
            label={t('search.sub_unit')}
            placeholder={t('common.search')}
          />
        )}
      />

      {selectedUnit?.hasPart && selectedUnit.hasPart.length > 0 && (
        <SubOrganizationFilter units={selectedUnit.hasPart} level={++level} />
      )}
    </>
  );
};
