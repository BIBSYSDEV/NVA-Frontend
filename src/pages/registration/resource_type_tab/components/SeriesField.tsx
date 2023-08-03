import { Autocomplete, Box, Button, Chip } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PublicationChannelApiPath } from '../../../../api/apiPaths';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { SearchResponse } from '../../../../types/common.types';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { BookEntityDescription } from '../../../../types/publication_types/bookRegistration.types';
import { PublicationChannelType, Registration, Series } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';
import { getYearQuery } from '../../../../utils/registration-helpers';
import { JournalFormDialog } from './JournalFormDialog';
import { PublicationChannelChipLabel } from './PublicationChannelChipLabel';
import { PublicationChannelOption } from './PublicationChannelOption';

const seriesFieldTestId = dataTestId.registrationWizard.resourceType.seriesField;

export const SeriesField = () => {
  const { t } = useTranslation();
  const { setFieldValue, values } = useFormikContext<Registration>();
  const { reference, publicationDate } = values.entityDescription as BookEntityDescription;
  const series = reference?.publicationContext.series;
  const year = publicationDate?.year ?? '';

  const [showSeriesForm, setShowSeriesForm] = useState(false);
  const toggleSeriesForm = () => setShowSeriesForm(!showSeriesForm);

  const [query, setQuery] = useState(!series?.id ? series?.title ?? '' : '');
  const debouncedQuery = useDebounce(query);
  const [seriesOptions, isLoadingSeriesOptions] = useFetch<SearchResponse<Series>>({
    url:
      debouncedQuery && debouncedQuery === query
        ? `${PublicationChannelApiPath.Series}?year=${getYearQuery(year)}&query=${encodeURIComponent(debouncedQuery)}`
        : '',
    errorMessage: t('feedback.error.get_series'),
  });

  useEffect(() => {
    if (
      seriesOptions?.hits.length === 1 &&
      series?.title &&
      seriesOptions.hits[0].name.toLowerCase() === series.title.toLowerCase()
    ) {
      setFieldValue(ResourceFieldNames.Series, {
        type: PublicationChannelType.Series,
        id: seriesOptions.hits[0].id,
      });
      setQuery('');
    }
  }, [setFieldValue, series?.title, seriesOptions]);

  const [journal, isLoadingJournal] = useFetchResource<Series>(series?.id ?? '', t('feedback.error.get_series'));

  return (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <Field name={ResourceFieldNames.SeriesId}>
        {({ field, meta }: FieldProps<string>) => (
          <Autocomplete
            fullWidth
            multiple
            id={seriesFieldTestId}
            data-testid={seriesFieldTestId}
            aria-labelledby={`${seriesFieldTestId}-label`}
            popupIcon={null}
            options={
              debouncedQuery && query === debouncedQuery && !isLoadingSeriesOptions ? seriesOptions?.hits ?? [] : []
            }
            filterOptions={(options) => options}
            inputValue={query}
            onInputChange={(_, newInputValue, reason) => {
              if (reason !== 'reset') {
                setQuery(newInputValue);
              }
              if (reason === 'input' && !newInputValue && series?.title) {
                setFieldValue(ResourceFieldNames.Series, { type: PublicationChannelType.UnconfirmedSeries });
              }
            }}
            blurOnSelect
            disableClearable={!query}
            value={field.value && journal ? [journal] : []}
            onChange={(_, inputValue, reason) => {
              if (reason === 'selectOption') {
                setFieldValue(ResourceFieldNames.Series, {
                  type: PublicationChannelType.Series,
                  id: inputValue.pop()?.id,
                });
              } else if (reason === 'removeOption') {
                setFieldValue(ResourceFieldNames.Series, { type: PublicationChannelType.UnconfirmedSeries });
              }
              setQuery('');
            }}
            loading={isLoadingSeriesOptions || isLoadingJournal}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, state) => (
              <PublicationChannelOption key={option.id} props={props} option={option} state={state} />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  data-testid={dataTestId.registrationWizard.resourceType.seriesChip}
                  label={<PublicationChannelChipLabel value={option} />}
                />
              ))
            }
            renderInput={(params) => (
              <AutocompleteTextField
                {...params}
                label={t('common.title')}
                isLoading={isLoadingSeriesOptions || isLoadingJournal}
                placeholder={!field.value ? t('registration.resource_type.search_for_series') : ''}
                showSearchIcon={!field.value}
                errorMessage={meta.touched && !!meta.error ? meta.error : ''}
              />
            )}
          />
        )}
      </Field>
      {!series?.id && (
        <>
          <Button
            variant="outlined"
            sx={{ height: 'fit-content', whiteSpace: 'nowrap', mt: '0.5rem' }}
            onClick={toggleSeriesForm}>
            {t('registration.resource_type.create_series')}
          </Button>
          <JournalFormDialog open={showSeriesForm} closeDialog={toggleSeriesForm} isSeries />
        </>
      )}
    </Box>
  );
};
