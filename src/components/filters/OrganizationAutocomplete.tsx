import { Autocomplete } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { defaultOrganizationSearchSize } from '../../api/cristinApi';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { useSearchForOrganizations } from '../../api/hooks/useSearchForOrganizations';
import { RootState } from '../../redux/store';
import { Organization } from '../../types/organization.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { getLanguageString } from '../../utils/translation-helpers';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../AutocompleteTextField';
import { OrganizationRenderOption } from '../OrganizationRenderOption';

interface OrganizationAutocompleteProps {
  value: Organization | null;
  valueIsLoading: boolean;
  onChange: (organization: Organization | null) => void;
}

/**
 * A single-select autocomplete dropdown for searching up and picking an organization (institution).
 *
 * NOTE: It looks like an empty dropdown with a small down-arrow, but clicking it shows a single option - the user's
 * own top level organization - which makes it look like that's the only choice. To get other options, the user has to
 * start typing in the input field, which will then show a list of results matching the input.
 *
 * It's a pure, controlled UI component: it owns only its internal search text/paging state, while the selected `value`
 * and what happens on selection (`onChange`) are controlled by the parent. It has no knowledge of the URL - callers
 * that keep the selection in sync with URL query params (like `OrganizationFilters`) must read the current organization
 * from the URL and pass it in as `value`, and handle updating the URL themselves inside `onChange`.
 */
export const OrganizationAutocomplete = ({ value, valueIsLoading, onChange }: OrganizationAutocompleteProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchSize, setSearchSize] = useState(defaultOrganizationSearchSize);
  const debouncedQuery = useDebounce(searchTerm);

  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const organizationSearchQuery = useSearchForOrganizations({ query: debouncedQuery, results: searchSize });

  const userOrganization = organizationQuery.data;
  const defaultOptions = userOrganization ? [userOrganization] : [];
  const options = organizationSearchQuery.data?.hits ?? defaultOptions;
  const isLoading = valueIsLoading || organizationSearchQuery.isFetching;

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
      onChange={(_, selectedOrganization) => {
        onChange(selectedOrganization);
        setSearchTerm('');
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      disabled={valueIsLoading}
      value={value}
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
