import { Autocomplete, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { fetchSeries, searchForSeries } from '../../../api/publicationChannelApi';
import { ResultParam } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { Series } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';

export const SeriesFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const seriesParam = searchParams.get(ResultParam.Series);
  const [seriesQuery, setSeriesQuery] = useState('');
  const debouncedQuery = useDebounce(seriesQuery);

  const seriesOptionsQuery = useQuery({
    queryKey: ['seriesSearch', debouncedQuery],
    enabled: debouncedQuery.length > 3 && debouncedQuery === seriesQuery,
    queryFn: () => searchForSeries(debouncedQuery, '2023'),
    meta: { errorMessage: t('feedback.error.get_series') },
  });

  const seriesList = seriesOptionsQuery.data?.hits ?? [];

  const selectedSeriesQuery = useQuery({
    enabled: !!seriesParam,
    queryKey: [seriesParam],
    queryFn: () => (seriesParam ? fetchSeries(seriesParam) : undefined),
    meta: { errorMessage: t('feedback.error.get_series') },
    staleTime: Infinity,
  });

  const handleChange = (selectedValue: Series | null) => {
    if (selectedValue) {
      searchParams.set(ResultParam.Series, selectedValue.identifier);
    } else {
      searchParams.delete(ResultParam.Series);
    }

    history.push({ search: searchParams.toString() });
  };

  const isFetching = seriesParam ? selectedSeriesQuery.isPending : seriesOptionsQuery.isFetching;

  return (
    <Autocomplete
      size="small"
      sx={{ minWidth: '15rem' }}
      value={seriesParam && selectedSeriesQuery.data ? selectedSeriesQuery.data : null}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      options={debouncedQuery && seriesQuery === debouncedQuery && !seriesOptionsQuery.isPending ? seriesList : []}
      filterOptions={(options) => options}
      inputValue={seriesQuery}
      onInputChange={(_, newInputValue) => setSeriesQuery(newInputValue)}
      onChange={(_, newValue) => handleChange(newValue)}
      blurOnSelect
      disableClearable={!seriesQuery}
      loading={isFetching}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Typography>{option.name}</Typography>
        </li>
      )}
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
  );
};
