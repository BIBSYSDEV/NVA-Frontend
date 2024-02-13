import { Autocomplete, Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { useState } from 'react';
import { searchForPublishers } from '../../../api/publicationChannelApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { PublicationChannelChipLabel } from '../../registration/resource_type_tab/components/PublicationChannelChipLabel';
import { PublicationChannelOption } from '../../registration/resource_type_tab/components/PublicationChannelOption';

export const PublisherFilters = () => {
  const [query, setQuery] = useState('Nature');
  const debouncedQuery = useDebounce(query);

  const publisherOptionsQuery = useQuery({
    queryKey: ['publisherSearch', debouncedQuery],
    enabled: debouncedQuery.length > 3 && debouncedQuery === query,
    queryFn: () => searchForPublishers(debouncedQuery, '2023'),
    meta: { errorMessage: t('feedback.error.get_publishers') },
  });

  return (
    <Autocomplete
      sx={{ minWidth: '15rem' }}
      options={
        debouncedQuery && query === debouncedQuery && !publisherOptionsQuery.isLoading
          ? publisherOptionsQuery.data?.hits ?? []
          : []
      }
      filterOptions={(options) => options}
      inputValue={query}
      onInputChange={(_, newInputValue) => {
        setQuery(newInputValue);
      }}
      blurOnSelect
      disableClearable={!query}
      loading={publisherOptionsQuery.isFetching}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, state) => (
        <PublicationChannelOption key={option.id} props={props} option={option} state={state} />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            data-testid={dataTestId.registrationWizard.resourceType.publisherChip}
            label={<PublicationChannelChipLabel value={option} />}
          />
        ))
      }
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          required
          label={t('common.publisher')}
          isLoading={publisherOptionsQuery.isFetching}
          placeholder={t('registration.resource_type.search_for_publisher')}
          showSearchIcon
        />
      )}
    />
  );
};
