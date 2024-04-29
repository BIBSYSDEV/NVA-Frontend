import { Autocomplete, Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getByIdAuthenticated } from '../../../../api/commonApi';
import { searchForSeries } from '../../../../api/publicationChannelApi';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { BookEntityDescription } from '../../../../types/publication_types/bookRegistration.types';
import { PublicationChannelType, Registration, Series } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { StyledChannelContainerBox, StyledCreateChannelButton } from './JournalField';
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

  const seriesOptionsQuery = useQuery({
    queryKey: ['seriesSearch', debouncedQuery, year],
    enabled: debouncedQuery.length > 3 && debouncedQuery === query,
    queryFn: () => searchForSeries(debouncedQuery, year),
    meta: { errorMessage: t('feedback.error.get_series') },
  });

  useEffect(() => {
    if (
      seriesOptionsQuery.data?.hits.length === 1 &&
      series?.title &&
      seriesOptionsQuery.data.hits[0].name.toLowerCase() === series.title.toLowerCase()
    ) {
      setFieldValue(ResourceFieldNames.Series, {
        type: PublicationChannelType.Series,
        id: seriesOptionsQuery.data.hits[0].id,
      });
      setQuery('');
    }
  }, [setFieldValue, series?.title, seriesOptionsQuery.data?.hits]);

  const seriesQuery = useQuery({
    queryKey: [series?.id],
    enabled: !!series?.id,
    queryFn: () => getByIdAuthenticated<Series>(series?.id ?? ''),
    meta: { errorMessage: t('feedback.error.get_series') },
    staleTime: Infinity,
  });

  return (
    <StyledChannelContainerBox>
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
              debouncedQuery && query === debouncedQuery && !seriesOptionsQuery.isLoading
                ? seriesOptionsQuery.data?.hits ?? []
                : []
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
            value={field.value && seriesQuery.data ? [seriesQuery.data] : []}
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
            loading={seriesOptionsQuery.isFetching || seriesQuery.isFetching}
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
                label={t('registration.resource_type.series_title')}
                isLoading={seriesOptionsQuery.isFetching || seriesQuery.isFetching}
                placeholder={!field.value ? t('registration.resource_type.search_for_title_or_issn') : ''}
                showSearchIcon={!field.value}
                errorMessage={meta.touched && !!meta.error ? meta.error : ''}
              />
            )}
          />
        )}
      </Field>
      {!series?.id && seriesOptionsQuery.isFetched && (
        <>
          <StyledCreateChannelButton variant="outlined" onClick={toggleSeriesForm}>
            {t('registration.resource_type.create_series')}
          </StyledCreateChannelButton>
          <JournalFormDialog
            open={showSeriesForm}
            closeDialog={toggleSeriesForm}
            initialName={query}
            isSeries
            onCreatedChannel={(newChannel) => {
              setFieldValue(ResourceFieldNames.Series, {
                type: PublicationChannelType.Series,
                id: newChannel.id,
              });
              setQuery('');
            }}
          />
        </>
      )}
    </StyledChannelContainerBox>
  );
};
