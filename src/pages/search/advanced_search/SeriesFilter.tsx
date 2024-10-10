import { Autocomplete } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { defaultChannelSearchSize, fetchSeries, searchForSeries } from '../../../api/publicationChannelApi';
import { ResultParam } from '../../../api/searchApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { StyledFilterHeading } from '../../../components/styled/Wrappers';
import { Series } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { keepSimilarPreviousData, syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { PublicationChannelOption } from '../../registration/resource_type_tab/components/PublicationChannelOption';

export const SeriesFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const seriesParam = searchParams.get(ResultParam.Series);
  const [seriesQuery, setSeriesQuery] = useState('');
  const debouncedQuery = useDebounce(seriesQuery);
  const [searchSize, setSearchSize] = useState(defaultChannelSearchSize);

  // Reset search size when query changes
  useEffect(() => setSearchSize(defaultChannelSearchSize), [debouncedQuery]);

  const seriesOptionsQuery = useQuery({
    queryKey: ['seriesSearch', debouncedQuery, searchSize],
    enabled: debouncedQuery.length > 3 && debouncedQuery === seriesQuery,
    queryFn: () => searchForSeries(debouncedQuery, '2023', searchSize),
    meta: { errorMessage: t('feedback.error.get_series') },
    placeholderData: (data, query) => keepSimilarPreviousData(data, query, debouncedQuery),
  });

  const options = seriesOptionsQuery.data?.hits ?? [];

  const selectedSeriesQuery = useQuery({
    enabled: !!seriesParam,
    queryKey: ['channel', seriesParam],
    queryFn: () => (seriesParam ? fetchSeries(seriesParam) : undefined),
    meta: { errorMessage: t('feedback.error.get_series') },
    staleTime: Infinity,
  });

  const handleChange = (selectedValue: Series | null) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    if (selectedValue) {
      syncedParams.set(ResultParam.Series, selectedValue.identifier);
    } else {
      syncedParams.delete(ResultParam.Series);
    }
    syncedParams.delete(ResultParam.From);

    history.push({ search: syncedParams.toString() });
  };

  const isFetching = seriesParam ? selectedSeriesQuery.isPending : seriesOptionsQuery.isFetching;

  return (
    <section>
      <StyledFilterHeading>{t('registration.resource_type.series')}</StyledFilterHeading>
      <Autocomplete
        size="small"
        sx={{ minWidth: '15rem' }}
        value={seriesParam && selectedSeriesQuery.data ? selectedSeriesQuery.data : null}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={options}
        filterOptions={(options) => options}
        inputValue={seriesQuery}
        onInputChange={(_, newInputValue) => setSeriesQuery(newInputValue)}
        onChange={(_, newValue) => handleChange(newValue)}
        blurOnSelect
        disableClearable={!seriesQuery}
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
        ListboxComponent={AutocompleteListboxWithExpansion}
        ListboxProps={
          {
            hasMoreHits: !!seriesOptionsQuery.data?.totalHits && seriesOptionsQuery.data.totalHits > searchSize,
            onShowMoreHits: () => setSearchSize(searchSize + defaultChannelSearchSize),
            isLoadingMoreHits: seriesOptionsQuery.isFetching && searchSize > options.length,
          } satisfies AutocompleteListboxWithExpansionProps as any
        }
        data-testid={dataTestId.startPage.advancedSearch.seriesField}
        renderInput={(params) => (
          <AutocompleteTextField
            {...params}
            variant="outlined"
            isLoading={isFetching}
            placeholder={t('registration.resource_type.search_for_title_or_issn')}
            showSearchIcon={!seriesParam}
            multiline
          />
        )}
      />
    </section>
  );
};
