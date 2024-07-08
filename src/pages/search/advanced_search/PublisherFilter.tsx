import { Autocomplete, Typography } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { fetchPublisher, searchForPublishers } from '../../../api/publicationChannelApi';
import { ResultParam } from '../../../api/searchApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { Publisher } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';

const defaultSearchSize = 5;

export const PublisherFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const publisherParam = searchParams.get(ResultParam.Publisher);
  const [publisherQuery, setPublisherQuery] = useState('');
  const debouncedQuery = useDebounce(publisherQuery);
  const [searchSize, setSearchSize] = useState(defaultSearchSize);

  const publisherOptionsQuery = useQuery({
    queryKey: ['publisherSearch', debouncedQuery, searchSize],
    enabled: debouncedQuery.length > 3 && debouncedQuery === publisherQuery,
    queryFn: () => searchForPublishers(debouncedQuery, '2023', searchSize),
    meta: { errorMessage: t('feedback.error.get_publishers') },
    placeholderData: keepPreviousData,
  });

  const publisherList = publisherOptionsQuery.data?.hits ?? [];

  const selectedPublisherQuery = useQuery({
    enabled: !!publisherParam,
    queryKey: [publisherParam],
    queryFn: () => (publisherParam ? fetchPublisher(publisherParam) : undefined),
    meta: { errorMessage: t('feedback.error.get_publisher') },
    staleTime: Infinity,
  });

  const handleChange = (selectedValue: Publisher | null) => {
    if (selectedValue) {
      searchParams.set(ResultParam.Publisher, selectedValue.identifier);
    } else {
      searchParams.delete(ResultParam.Publisher);
    }

    history.push({ search: searchParams.toString() });
  };

  const isFetching = publisherParam ? selectedPublisherQuery.isPending : publisherOptionsQuery.isFetching;

  return (
    <Autocomplete
      size="small"
      sx={{ minWidth: '15rem' }}
      value={publisherParam && selectedPublisherQuery.data ? selectedPublisherQuery.data : null}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      options={
        debouncedQuery && publisherQuery === debouncedQuery && !publisherOptionsQuery.isPending ? publisherList : []
      }
      filterOptions={(options) => options}
      inputValue={publisherQuery}
      onInputChange={(_, newInputValue) => setPublisherQuery(newInputValue)}
      onChange={(_, newValue) => handleChange(newValue)}
      blurOnSelect
      disableClearable={!publisherQuery}
      loading={isFetching}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Typography>{option.name}</Typography>
        </li>
      )}
      ListboxComponent={AutocompleteListboxWithExpansion}
      ListboxProps={
        {
          hasMoreHits: !!publisherOptionsQuery.data?.totalHits && publisherOptionsQuery.data.totalHits > searchSize,
          onShowMoreHits: () => setSearchSize(searchSize + defaultSearchSize),
          isLoadingMoreHits: publisherOptionsQuery.isFetching && !publisherOptionsQuery.isPending,
        } satisfies AutocompleteListboxWithExpansionProps as any
      }
      data-testid={dataTestId.startPage.advancedSearch.publisherField}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          variant="outlined"
          isLoading={isFetching}
          placeholder={t('registration.resource_type.search_for_publisher_placeholder')}
          showSearchIcon={!publisherParam}
          multiline
        />
      )}
    />
  );
};
