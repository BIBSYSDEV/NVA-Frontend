import { Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSerialPublicationSearch } from '../../../../api/hooks/useSerialPublicationSearch';
import { defaultChannelSearchSize } from '../../../../api/publicationChannelApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { PublicationChannelOption } from '../../../registration/resource_type_tab/components/PublicationChannelOption';

interface SearchForSerialPublicationFacetItemProps {
  searchMode: 'journal' | 'series';
  onSelectSerialPublication: (identifier: string) => void;
}

export const SearchForSerialPublicationFacetItem = ({
  searchMode,
  onSelectSerialPublication,
}: SearchForSerialPublicationFacetItemProps) => {
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
          data-testid={
            searchMode === 'series'
              ? dataTestId.aggregations.seriesFacetsSearchField
              : dataTestId.aggregations.journalFacetsSearchField
          }
          aria-label={searchMode === 'series' ? t('search.search_for_series') : t('search.search_for_journal')}
          placeholder={searchMode === 'series' ? t('search.search_for_series') : t('search.search_for_journal')}
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
