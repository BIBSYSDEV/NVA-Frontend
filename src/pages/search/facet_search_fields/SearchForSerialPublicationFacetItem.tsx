import { Autocomplete, AutocompleteProps, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSerialPublicationSearch } from '../../../api/hooks/useSerialPublicationSearch';
import { defaultChannelSearchSize } from '../../../api/publicationChannelApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField, AutocompleteTextFieldProps } from '../../../components/AutocompleteTextField';
import { SerialPublication } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { PublicationChannelOption } from '../../registration/resource_type_tab/components/PublicationChannelOption';

interface SearchForSerialPublicationProps {
  searchMode: 'journal' | 'series';
  onSelectSerialPublication: (SerialPublication: SerialPublication | null) => void;
  autocompleteProps?: Partial<AutocompleteProps<SerialPublication, false, false, false>>;
  textFieldProps?: Partial<AutocompleteTextFieldProps>;
}

export const SearchForSerialPublication = ({
  searchMode,
  onSelectSerialPublication,
  autocompleteProps,
  textFieldProps,
}: SearchForSerialPublicationProps) => {
  const { t } = useTranslation();
  const [searchSize, setSearchSize] = useState(defaultChannelSearchSize);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);

  useEffect(() => setSearchSize(defaultChannelSearchSize), [debouncedQuery]);

  const serialPublicationSearchQuery = useSerialPublicationSearch({
    searchMode,
    searchTerm: debouncedQuery,
    size: searchSize,
  });

  const options = serialPublicationSearchQuery.data?.hits ?? [];

  return (
    <Autocomplete
      {...autocompleteProps}
      options={options}
      inputMode="search"
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
        onSelectSerialPublication(selectedSerialPublication);
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
      renderValue={(value, getItemProps) => <Chip label={value.name} {...getItemProps()} />}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          variant="outlined"
          isLoading={serialPublicationSearchQuery.isLoading}
          data-testid={
            searchMode === 'series'
              ? dataTestId.aggregations.seriesFacetsSearchField
              : dataTestId.aggregations.journalFacetsSearchField
          }
          placeholder={searchMode === 'series' ? t('search.search_for_series') : t('search.search_for_journal')}
          {...textFieldProps}
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
