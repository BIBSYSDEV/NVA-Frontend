import { Autocomplete, Box } from '@mui/material';
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
    <Autocomplete
      options={options}
      inputMode="search"
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
      disabled={organizationQuery.isFetching}
      value={organizationQuery.data ?? null}
      loading={institutionSearchQuery.isFetching}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          sx={{ maxWidth: '25rem' }}
          variant="outlined"
          isLoading={institutionSearchQuery.isFetching}
          // data-testid={customDataTestId ?? dataTestId.organization.searchField}
          label={t('common.institution')}
          placeholder={t('project.search_for_institution')}
          showSearchIcon
        />
      )}
    />
  );
};
