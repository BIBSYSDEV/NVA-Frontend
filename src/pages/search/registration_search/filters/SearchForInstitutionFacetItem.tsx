import { Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchForOrganizations } from '../../../../api/hooks/useSearchForOrganizations';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { OrganizationRenderOption } from '../../../../components/OrganizationRenderOption';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { getLanguageString } from '../../../../utils/translation-helpers';

interface SearchForInstitutionFacetItemProps {
  onSelectInstitution: (institutionId: string) => void;
}

const defaultOrganizationSearchSize = 10;

export const SearchForInstitutionFacetItem = ({ onSelectInstitution }: SearchForInstitutionFacetItemProps) => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchSize, setSearchSize] = useState(defaultOrganizationSearchSize);
  const debouncedQuery = useDebounce(searchQuery);

  useEffect(() => setSearchSize(defaultOrganizationSearchSize), [debouncedQuery]);

  const institutionSearchQuery = useSearchForOrganizations({ query: debouncedQuery, results: searchSize });

  const options = institutionSearchQuery.data?.hits ?? [];

  return (
    <Autocomplete
      fullWidth
      size="small"
      sx={{ p: '0.25rem 0.5rem' }}
      options={options}
      inputMode="search"
      value={null}
      getOptionLabel={(option) => getLanguageString(option.labels)}
      getOptionKey={(option) => option.id}
      filterOptions={(options) => options}
      inputValue={searchQuery}
      onInputChange={(_, value, reason) => {
        if (reason !== 'blur' && reason !== 'reset') {
          setSearchQuery(value);
        }
      }}
      onChange={(_, selectedInstitution) => {
        if (selectedInstitution) {
          onSelectInstitution(getIdentifierFromId(selectedInstitution.id));
        }
        setSearchQuery('');
      }}
      loading={institutionSearchQuery.isFetching}
      renderOption={({ key, ...props }, option) => (
        <OrganizationRenderOption key={option.id} props={props} option={option} />
      )}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          variant="outlined"
          isLoading={institutionSearchQuery.isLoading}
          data-testid={dataTestId.aggregations.institutionFacetsSearchField}
          aria-label={t('project.search_for_institution')}
          placeholder={t('project.search_for_institution')}
          showSearchIcon
        />
      )}
      slotProps={{
        listbox: {
          component: AutocompleteListboxWithExpansion,
          ...({
            hasMoreHits: !!institutionSearchQuery.data?.size && institutionSearchQuery.data.size > searchSize,
            onShowMoreHits: () => setSearchSize(searchSize + defaultOrganizationSearchSize),
            isLoadingMoreHits: institutionSearchQuery.isFetching && searchSize > options.length,
          } satisfies AutocompleteListboxWithExpansionProps),
        },
      }}
    />
  );
};
