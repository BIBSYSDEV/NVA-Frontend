import { Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchForPublisher } from '../../../../api/hooks/useSearchForPublisher';
import { defaultChannelSearchSize } from '../../../../api/publicationChannelApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { PublicationChannelOption } from '../../../registration/resource_type_tab/components/PublicationChannelOption';

interface SearchForFacetFacetItemProps {
  onSelectPublisher: (publisherId: string) => void;
}

export const SearchForPublisherFacetItem = ({ onSelectPublisher }: SearchForFacetFacetItemProps) => {
  const { t } = useTranslation();

  const [searchSize, setSearchSize] = useState(defaultChannelSearchSize);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);

  useEffect(() => setSearchSize(defaultChannelSearchSize), [debouncedQuery]);

  const publisherSearchQuery = useSearchForPublisher({ searchTerm: debouncedQuery, size: searchSize });

  const options = publisherSearchQuery.data?.hits ?? [];

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
      onChange={(_, selectedPublisher) => {
        if (selectedPublisher) {
          onSelectPublisher(selectedPublisher.identifier);
        }
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
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          variant="outlined"
          isLoading={publisherSearchQuery.isLoading}
          data-testid={dataTestId.aggregations.publisherFacetsSearchField}
          aria-label={t('registration.resource_type.search_for_publisher')}
          placeholder={t('registration.resource_type.search_for_publisher')}
          showSearchIcon
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
