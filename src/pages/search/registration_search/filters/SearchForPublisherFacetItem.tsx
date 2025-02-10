import { Autocomplete } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchForPublisher } from '../../../../api/hooks/useSearchForPublisher';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { PublicationChannelOption } from '../../../registration/resource_type_tab/components/PublicationChannelOption';

interface SearchForInstitutionFacetRowProps {
  onSelectChannel: (institutionId: string) => void;
}

const defaultChannelSearchSize = 10;
const currentYearString = new Date().getFullYear().toString();

export const SearchForPublisherFacetItem = ({ onSelectChannel }: SearchForInstitutionFacetRowProps) => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchSize, setSearchSize] = useState(defaultChannelSearchSize);
  const debouncedQuery = useDebounce(searchQuery);
  const channelSearchQuery = useSearchForPublisher({
    searchTerm: debouncedQuery,
    year: currentYearString,
    size: searchSize,
  });

  const options = channelSearchQuery.data?.hits ?? [];

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
          onSelectChannel(selectedPublisher.identifier);
        }
        setSearchQuery('');
      }}
      loading={channelSearchQuery.isFetching}
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
          isLoading={channelSearchQuery.isLoading}
          data-testid={dataTestId.organization.searchField}
          aria-label={t('registration.resource_type.search_for_publisher')}
          placeholder={t('registration.resource_type.search_for_publisher')}
          showSearchIcon
        />
      )}
      slotProps={{
        listbox: {
          component: AutocompleteListboxWithExpansion,
          ...({
            hasMoreHits: !!channelSearchQuery.data?.totalHits && channelSearchQuery.data.totalHits > searchSize,
            onShowMoreHits: () => setSearchSize(searchSize + defaultChannelSearchSize),
            isLoadingMoreHits: channelSearchQuery.isFetching && searchSize > options.length,
          } satisfies AutocompleteListboxWithExpansionProps),
        },
      }}
    />
  );
};
