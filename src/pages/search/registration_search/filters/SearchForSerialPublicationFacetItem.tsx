import { Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSerialPublicationSearch } from '../../../../api/hooks/useSerialPublicationSearch';
import { defaultChannelSearchSize } from '../../../../api/publicationChannelApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { PublicationChannelOption } from '../../../registration/resource_type_tab/components/PublicationChannelOption';

interface SearchForSerialPublicationFacetItemProps {
  label: string;
  dataTestId: string;
  onSelectSerialPublication: (identifier: string) => void;
}

export const SearchForSerialPublicationFacetItem = ({
  label,
  dataTestId,
  onSelectSerialPublication,
}: SearchForSerialPublicationFacetItemProps) => {
  const [searchSize, setSearchSize] = useState(defaultChannelSearchSize);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);

  useEffect(() => setSearchSize(defaultChannelSearchSize), [debouncedQuery]);

  const serialPublicationSearchQuery = useSerialPublicationSearch({ searchTerm: debouncedQuery, size: searchSize });

  const options = serialPublicationSearchQuery.data?.hits ?? [];

  return (
    <Autocomplete
      fullWidth
      size="small"
      sx={{ p: '0.25rem 0.5rem' }}
      options={options}
      inputMode="search"
      value={null}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.id}
      filterOptions={(options) => options}
      inputValue={searchQuery}
      onInputChange={(_, value, reason) => {
        if (reason !== 'blur' && reason !== 'reset') {
          setSearchQuery(value);
        }
      }}
      onChange={(_, selectedSerialPublication) => {
        if (selectedSerialPublication) {
          onSelectSerialPublication(selectedSerialPublication.identifier);
        }
        setSearchQuery('');
      }}
      loading={serialPublicationSearchQuery.isFetching}
      renderOption={({ key, ...props }, option, state) => (
        <PublicationChannelOption
          key={option.identifier}
          props={props}
          option={option}
          state={state}
          hideScientificLevel
        />
      )}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          variant="outlined"
          isLoading={serialPublicationSearchQuery.isLoading}
          data-testid={dataTestId}
          aria-label={label}
          placeholder={label}
          showSearchIcon
        />
      )}
      slotProps={{
        listbox: {
          component: AutocompleteListboxWithExpansion,
          ...({
            hasMoreHits:
              !!serialPublicationSearchQuery.data?.totalHits &&
              serialPublicationSearchQuery.data.totalHits > searchSize,
            onShowMoreHits: () => setSearchSize(searchSize + defaultChannelSearchSize),
            isLoadingMoreHits: serialPublicationSearchQuery.isFetching && searchSize > options.length,
          } satisfies AutocompleteListboxWithExpansionProps),
        },
      }}
    />
  );
};
