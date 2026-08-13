import { Autocomplete } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { defaultOrganizationSearchSize } from '../../api/cristinApi';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { useSearchForOrganizations } from '../../api/hooks/useSearchForOrganizations';
import { ResultParam } from '../../api/searchApi';
import { RootState } from '../../redux/store';
import { Organization } from '../../types/organization.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { syncParamsWithSearchFields } from '../../utils/searchHelpers';
import { getLanguageString } from '../../utils/translation-helpers';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../AutocompleteTextField';
import { OrganizationRenderOption } from '../OrganizationRenderOption';

interface OrganizationAutocompleteProps {
  topLevelOrganizationId: string | null;
  unidentifiedContributorInstitutionParam: string | null;
  topLevelOrganizationQuery: UseQueryResult<Organization, unknown>;
}

export const OrganizationAutocomplete = ({
  topLevelOrganizationId,
  unidentifiedContributorInstitutionParam,
  topLevelOrganizationQuery,
}: OrganizationAutocompleteProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm);
  const user = useSelector((store: RootState) => store.user);
  const params = new URLSearchParams(location.search);

  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const userOrganization = organizationQuery.data;

  const [searchSize, setSearchSize] = useState(defaultOrganizationSearchSize);
  const organizationSearchQuery = useSearchForOrganizations({ query: debouncedQuery, results: searchSize });

  const defaultOptions = userOrganization ? [userOrganization] : [];
  const options = organizationSearchQuery.data?.hits ?? defaultOptions;

  const isLoading = topLevelOrganizationQuery.isFetching || organizationSearchQuery.isFetching;

  return (
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
          const syncedParams = syncParamsWithSearchFields(params);
          if (selectedInstitution) {
            syncedParams.set(ResultParam.TopLevelOrganization, selectedInstitution.id);
            if (unidentifiedContributorInstitutionParam) {
              syncedParams.set(ResultParam.UnidentifiedContributorInstitution, selectedInstitution.id);
            }
          } else {
            syncedParams.delete(ResultParam.TopLevelOrganization);
            syncedParams.delete(ResultParam.ExcludeSubunits);
          }
          syncedParams.delete(ResultParam.From);
          syncedParams.delete(ResultParam.Unit);
          navigate({ search: syncedParams.toString() });
          setSearchTerm('');
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      disabled={topLevelOrganizationQuery.isFetching}
      value={topLevelOrganizationQuery.data ?? null}
      loading={isLoading}
      renderOption={({ key, ...props }, option) => (
        <OrganizationRenderOption key={option.id} props={props} option={option} />
      )}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          variant="outlined"
          multiline
          isLoading={isLoading}
          data-testid={dataTestId.organization.searchField}
          placeholder={t('project.search_for_institution')}
        />
      )}
      slotProps={{
        listbox: {
          component: AutocompleteListboxWithExpansion,
          ...({
            hasMoreHits: !!organizationSearchQuery.data?.size && organizationSearchQuery.data.size > searchSize,
            onShowMoreHits: () => setSearchSize(searchSize + defaultOrganizationSearchSize),
            isLoadingMoreHits: organizationSearchQuery.isFetching && searchSize > options.length,
          } satisfies AutocompleteListboxWithExpansionProps),
        },
      }}
    />
  );
};
