import { Field, FieldProps, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { PublicationChannelType, Publisher, Registration } from '../../../../types/registration.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { PublicationChannelApiPath } from '../../../../api/apiPaths';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { dataTestId } from '../../../../utils/dataTestIds';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { BookEntityDescription } from '../../../../types/publication_types/bookRegistration.types';
import { getYearQuery } from '../../../../utils/registration-helpers';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';
import { NpiLevelTypography } from '../../../../components/NpiLevelTypography';

const publisherFieldTestId = dataTestId.registrationWizard.resourceType.publisherField;

export const PublisherField = () => {
  const { t } = useTranslation();
  const { setFieldValue, setFieldTouched, values } = useFormikContext<Registration>();
  const { reference, date } = values.entityDescription as BookEntityDescription;
  const publisher = reference?.publicationContext.publisher;
  const year = date?.year ?? '';

  const [query, setQuery] = useState(!publisher?.id ? publisher?.name ?? '' : '');
  const debouncedQuery = useDebounce(query);
  const [publisherOptions, isLoadingPublisherOptions] = useFetch<Publisher[]>({
    url:
      debouncedQuery && debouncedQuery === query
        ? `${PublicationChannelApiPath.PublisherSearch}?year=${getYearQuery(year)}&query=${encodeURIComponent(
            debouncedQuery
          )}`
        : '',
    errorMessage: t('feedback.error.get_publishers'),
  });

  useEffect(() => {
    if (
      publisherOptions?.length === 1 &&
      publisher?.name &&
      publisherOptions[0].name.toLowerCase() === publisher.name.toLowerCase()
    ) {
      setFieldValue(ResourceFieldNames.PublicationContextPublisherType, PublicationChannelType.Publisher, false);
      setFieldValue(ResourceFieldNames.PublicationContextPublisherId, publisherOptions[0].id);
      setQuery('');
    }
  }, [setFieldValue, publisher?.name, publisherOptions]);

  const [fetchedPublisher, isLoadingPublisher] = useFetchResource<Publisher>(
    publisher?.id ?? '',
    t('feedback.error.get_publisher')
  );

  return (
    <Field name={ResourceFieldNames.PublicationContextPublisherId}>
      {({ field, meta }: FieldProps<string>) => (
        <Autocomplete
          multiple
          id={publisherFieldTestId}
          data-testid={publisherFieldTestId}
          aria-labelledby={`${publisherFieldTestId}-label`}
          popupIcon={null}
          options={
            debouncedQuery && query === debouncedQuery && !isLoadingPublisherOptions ? publisherOptions ?? [] : []
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
            <li {...props}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1">
                  <EmphasizeSubstring text={option.name} emphasized={state.inputValue} />
                </Typography>
                <NpiLevelTypography variant="body2" color="textSecondary" level={option.level} />
              </Box>
            </li>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                data-testid={dataTestId.registrationWizard.resourceType.publisherChip}
                label={
                  <>
                    <Typography variant="subtitle1">{option.name}</Typography>
                    <NpiLevelTypography variant="body2" color="textSecondary" level={option.level} />
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
  );
};
