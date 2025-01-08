import { Autocomplete } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { defaultChannelSearchSize, fetchPublisher, searchForPublishers } from '../../../api/publicationChannelApi';
import { ResultParam } from '../../../api/searchApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { StyledFilterHeading } from '../../../components/styled/Wrappers';
import { Publisher } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { keepSimilarPreviousData, syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { PublicationChannelOption } from '../../registration/resource_type_tab/components/PublicationChannelOption';

export const PublisherFilter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const publisherParam = searchParams.get(ResultParam.Publisher);
  const [publisherQuery, setPublisherQuery] = useState('');
  const debouncedQuery = useDebounce(publisherQuery);
  const [searchSize, setSearchSize] = useState(defaultChannelSearchSize);

  // Reset search size when query changes
  useEffect(() => setSearchSize(defaultChannelSearchSize), [debouncedQuery]);

  const publisherOptionsQuery = useQuery({
    queryKey: ['publisherSearch', debouncedQuery, searchSize],
    enabled: debouncedQuery.length > 3 && debouncedQuery === publisherQuery,
    queryFn: () => searchForPublishers(debouncedQuery, '2023', searchSize),
    meta: { errorMessage: t('feedback.error.get_publishers') },
    placeholderData: (data, query) => keepSimilarPreviousData(data, query, debouncedQuery),
  });

  const options = publisherOptionsQuery.data?.hits ?? [];

  const selectedPublisherQuery = useQuery({
    enabled: !!publisherParam,
    queryKey: ['channel', publisherParam],
    queryFn: () => (publisherParam ? fetchPublisher(publisherParam) : undefined),
    meta: { errorMessage: t('feedback.error.get_publisher') },
    staleTime: Infinity,
  });

  const handleChange = (selectedValue: Publisher | null) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    if (selectedValue) {
      syncedParams.set(ResultParam.Publisher, selectedValue.identifier);
    } else {
      syncedParams.delete(ResultParam.Publisher);
    }
    syncedParams.delete(ResultParam.From);

    navigate({ search: syncedParams.toString() });
  };

  const isFetching = publisherParam ? selectedPublisherQuery.isPending : publisherOptionsQuery.isFetching;

  return (
    <section>
      <StyledFilterHeading>{t('common.publisher')}</StyledFilterHeading>
      <Autocomplete
        size="small"
        sx={{ minWidth: '15rem' }}
        value={publisherParam && selectedPublisherQuery.data ? selectedPublisherQuery.data : null}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={options}
        filterOptions={(options) => options}
        inputValue={publisherQuery}
        onInputChange={(_, newInputValue) => setPublisherQuery(newInputValue)}
        onChange={(_, newValue) => handleChange(newValue)}
        blurOnSelect
        disableClearable={!publisherQuery}
        loading={isFetching}
        getOptionLabel={(option) => option.name}
        renderOption={({ key, ...props }, option, state) => (
          <PublicationChannelOption
            key={option.identifier}
            props={props}
            option={option}
            state={state}
            hideScientificLevel
          />
        )}
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
        slotProps={{
          listbox: {
            component: AutocompleteListboxWithExpansion,
            ...({
              hasMoreHits: !!publisherOptionsQuery.data?.totalHits && publisherOptionsQuery.data.totalHits > searchSize,
              onShowMoreHits: () => setSearchSize(searchSize + defaultChannelSearchSize),
              isLoadingMoreHits: publisherOptionsQuery.isFetching && searchSize > options.length,
            } satisfies AutocompleteListboxWithExpansionProps),
          },
        }}
      />
    </section>
  );
};
