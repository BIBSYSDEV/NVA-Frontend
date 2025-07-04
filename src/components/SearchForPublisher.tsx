import { Autocomplete, AutocompleteProps, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePublisherSearch } from '../api/hooks/usePublisherSearch';
import { defaultChannelSearchSize } from '../api/publicationChannelApi';
import { PublicationChannelOption } from '../pages/registration/resource_type_tab/components/PublicationChannelOption';
import { Publisher } from '../types/registration.types';
import { useDebounce } from '../utils/hooks/useDebounce';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from './AutocompleteListboxWithExpansion';
import { AutocompleteTextField, AutocompleteTextFieldProps } from './AutocompleteTextField';

interface SearchForPublisherProps {
  onSelectPublisher: (publisher: Publisher | null) => void;
  autocompleteProps?: Partial<AutocompleteProps<Publisher, false, false, false>>;
  textFieldProps?: Partial<AutocompleteTextFieldProps>;
}

export const SearchForPublisher = ({
  onSelectPublisher,
  autocompleteProps,
  textFieldProps,
}: SearchForPublisherProps) => {
  const { t } = useTranslation();

  const [searchSize, setSearchSize] = useState(defaultChannelSearchSize);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);

  useEffect(() => setSearchSize(defaultChannelSearchSize), [debouncedQuery]);

  const publisherSearchQuery = usePublisherSearch({ searchTerm: debouncedQuery, size: searchSize });

  const options = publisherSearchQuery.data?.hits ?? [];

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
      onChange={(_, selectedPublisher) => {
        onSelectPublisher(selectedPublisher);
        setSearchQuery('');
      }}
      loading={publisherSearchQuery.isFetching}
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
          isLoading={publisherSearchQuery.isLoading}
          placeholder={t('registration.resource_type.search_for_publisher')}
          {...textFieldProps}
        />
      )}
      slotProps={{
        listbox: {
          component: AutocompleteListboxWithExpansion,
          ...({
            hasMoreHits: !!publisherSearchQuery.data?.totalHits && publisherSearchQuery.data.totalHits > searchSize,
            onShowMoreHits: () => setSearchSize(searchSize + defaultChannelSearchSize),
            isLoadingMoreHits: publisherSearchQuery.isFetching && searchSize > options.length,
          } satisfies AutocompleteListboxWithExpansionProps),
        },
      }}
    />
  );
};
