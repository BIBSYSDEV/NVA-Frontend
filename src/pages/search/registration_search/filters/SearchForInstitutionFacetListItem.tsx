import { Autocomplete, ListItem } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchForOrganizations } from '../../../../api/hooks/useSearchForOrganizations';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { OrganizationRenderOption } from '../../../../components/OrganizationRenderOption';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { getLanguageString } from '../../../../utils/translation-helpers';

interface SearchForInstitutionFacetRowProps {
  onSelectInstitution: (institutionId: string) => void;
}

const defaultOrganizationSearchSize = 10;

export const SearchForInstitutionFacetListItem = ({ onSelectInstitution }: SearchForInstitutionFacetRowProps) => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchSize, setSearchSize] = useState(defaultOrganizationSearchSize);
  const debouncedQuery = useDebounce(searchQuery);
  const institutionSearchQuery = useSearchForOrganizations({ query: debouncedQuery, results: searchSize });

  const options = institutionSearchQuery.data?.hits ?? [];

  return (
    <ListItem sx={{ p: '0.25rem 0.5rem' }}>
      <Autocomplete
        fullWidth
        size="small"
        options={options}
        inputMode="search"
        value={null}
        getOptionLabel={(option) => getLanguageString(option.labels)}
        getOptionKey={(option) => option.id}
        filterOptions={(options) => options}
        onInputChange={(_, value) => setSearchQuery(value)}
        onChange={(event, selectedInstitution) => {
          event.preventDefault();
          if (selectedInstitution) {
            onSelectInstitution(selectedInstitution.id);
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
            value={null}
            isLoading={institutionSearchQuery.isLoading}
            data-testid={dataTestId.organization.searchField}
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
    </ListItem>
  );
};
