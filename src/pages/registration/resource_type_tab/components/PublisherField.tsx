import { Autocomplete, Box, Button, Chip, Typography } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PublicationChannelApiPath } from '../../../../api/apiPaths';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { NpiLevelTypography } from '../../../../components/NpiLevelTypography';
import { SearchResponse } from '../../../../types/common.types';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { BookEntityDescription } from '../../../../types/publication_types/bookRegistration.types';
import { PublicationChannelType, Publisher, Registration } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';
import { getYearQuery } from '../../../../utils/registration-helpers';
import { PublicationChannelOption } from './PublicationChannelOption';
import { PublisherFormDialog } from './PublisherFormDialog';

const publisherFieldTestId = dataTestId.registrationWizard.resourceType.publisherField;

export const PublisherField = () => {
  const { t } = useTranslation();
  const { setFieldValue, setFieldTouched, values } = useFormikContext<Registration>();
  const { reference, publicationDate } = values.entityDescription as BookEntityDescription;
  const publisher = reference?.publicationContext.publisher;
  const year = publicationDate?.year ?? '';

  const [showPublisherForm, setShowPublisherForm] = useState(false);
  const togglePublisherForm = () => setShowPublisherForm(!showPublisherForm);

  const [query, setQuery] = useState(!publisher?.id ? publisher?.name ?? '' : '');
  const debouncedQuery = useDebounce(query);
  const [publisherOptions, isLoadingPublisherOptions] = useFetch<SearchResponse<Publisher>>({
    url:
      debouncedQuery && debouncedQuery === query
        ? `${PublicationChannelApiPath.Publisher}?year=${getYearQuery(year)}&query=${encodeURIComponent(
            debouncedQuery
          )}`
        : '',
    errorMessage: t('feedback.error.get_publishers'),
  });

  useEffect(() => {
    if (
      publisherOptions?.hits.length === 1 &&
      publisher?.name &&
      publisherOptions.hits[0].name.toLowerCase() === publisher.name.toLowerCase()
    ) {
      setFieldValue(ResourceFieldNames.PublicationContextPublisherType, PublicationChannelType.Publisher, false);
      setFieldValue(ResourceFieldNames.PublicationContextPublisherId, publisherOptions.hits[0].id);
      setQuery('');
    }
  }, [setFieldValue, publisher?.name, publisherOptions]);

  const [fetchedPublisher, isLoadingPublisher] = useFetchResource<Publisher>(
    publisher?.id ?? '',
    t('feedback.error.get_publisher')
  );

  return (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <Field name={ResourceFieldNames.PublicationContextPublisherId}>
        {({ field, meta }: FieldProps<string>) => (
          <Autocomplete
            fullWidth
            multiple
            id={publisherFieldTestId}
            data-testid={publisherFieldTestId}
            aria-labelledby={`${publisherFieldTestId}-label`}
            popupIcon={null}
            options={
              debouncedQuery && query === debouncedQuery && !isLoadingPublisherOptions
                ? publisherOptions?.hits ?? []
                : []
            }
            filterOptions={(options) => options}
            inputValue={query}
            onInputChange={(_, newInputValue, reason) => {
              if (reason !== 'reset') {
                setQuery(newInputValue);
              }
              if (reason === 'input' && !newInputValue && publisher?.name) {
                setFieldValue(ResourceFieldNames.PublicationContextPublisher, {
                  type: PublicationChannelType.UnconfirmedPublisher,
                });
              }
            }}
            onBlur={() => setFieldTouched(field.name, true, false)}
            blurOnSelect
            disableClearable={!query}
            value={publisher?.id && fetchedPublisher ? [fetchedPublisher] : []}
            onChange={(_, inputValue, reason) => {
              if (reason === 'selectOption') {
                setFieldValue(ResourceFieldNames.PublicationContextPublisher, {
                  type: PublicationChannelType.Publisher,
                  id: inputValue.pop()?.id,
                });
              } else if (reason === 'removeOption') {
                setFieldValue(ResourceFieldNames.PublicationContextPublisher, {
                  type: PublicationChannelType.UnconfirmedPublisher,
                });
              }
              setQuery('');
            }}
            loading={isLoadingPublisherOptions || isLoadingPublisher}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, state) => (
              <PublicationChannelOption props={props} option={option} state={state} />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  data-testid={dataTestId.registrationWizard.resourceType.publisherChip}
                  label={
                    <>
                      <Typography variant="subtitle1">{option.name}</Typography>
                      <NpiLevelTypography
                        variant="body2"
                        color="textSecondary"
                        scientificValue={option.scientificValue}
                      />
                    </>
                  }
                />
              ))
            }
            renderInput={(params) => (
              <AutocompleteTextField
                {...params}
                required
                label={t('common.publisher')}
                isLoading={isLoadingPublisherOptions || isLoadingPublisher}
                placeholder={!publisher?.id ? t('registration.resource_type.search_for_publisher') : ''}
                showSearchIcon={!publisher?.id}
                errorMessage={meta.touched && !!meta.error ? meta.error : ''}
              />
            )}
          />
        )}
      </Field>
      {!publisher?.id && (
        <>
          <Button
            variant="outlined"
            sx={{ height: 'fit-content', whiteSpace: 'nowrap', mt: '0.5rem' }}
            onClick={togglePublisherForm}>
            {t('registration.resource_type.create_publisher')}
          </Button>
          <PublisherFormDialog open={showPublisherForm} closeDialog={togglePublisherForm} />
        </>
      )}
    </Box>
  );
};
