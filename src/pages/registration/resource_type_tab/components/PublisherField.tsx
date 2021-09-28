import { Field, FieldProps, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, ThemeProvider, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { lightTheme, autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { Publisher, Registration } from '../../../../types/registration.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { PublicationChannelApiPath } from '../../../../api/apiPaths';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { dataTestId } from '../../../../utils/dataTestIds';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { BookEntityDescription } from '../../../../types/publication_types/bookRegistration.types';
import { getYearQuery } from '../../../../utils/registration-helpers';

const publisherFieldTestId = dataTestId.registrationWizard.resourceType.publisherField;

export const PublisherField = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue, setFieldTouched, values } = useFormikContext<Registration>();
  const {
    reference: {
      publicationContext: { publisher },
    },
    date: { year },
  } = values.entityDescription as BookEntityDescription;

  const [query, setQuery] = useState(publisher?.name ?? '');
  const debouncedQuery = useDebounce(query);
  const [publisherOptions, isLoadingPublisherOptions] = useFetch<Publisher[]>({
    url:
      debouncedQuery && debouncedQuery === query
        ? `${PublicationChannelApiPath.PublisherSearch}?year=${getYearQuery(year)}&query=${debouncedQuery}`
        : '',
    errorMessage: t('feedback:error.get_publishers'),
  });

  const [fetchedPublisher, isLoadingPublisher] = useFetch<Publisher>({
    url: publisher?.id ?? '',
    errorMessage: t('feedback:error.get_publisher'),
  });

  return (
    <ThemeProvider theme={lightTheme}>
      <Field name={ResourceFieldNames.PubliactionContextPublisherId}>
        {({ field, meta }: FieldProps<string>) => (
          <Autocomplete
            {...autocompleteTranslationProps}
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
            }}
            onBlur={() => setFieldTouched(field.name, true, false)}
            blurOnSelect
            disableClearable={!query}
            value={publisher?.id && fetchedPublisher ? [fetchedPublisher] : []}
            onChange={(_, inputValue, reason) => {
              if (reason === 'selectOption') {
                setFieldValue(ResourceFieldNames.PubliactionContextPublisherType, 'Publisher', false);
                setFieldValue(field.name, inputValue.pop()?.id);
              } else if (reason === 'removeOption') {
                setFieldValue(ResourceFieldNames.PubliactionContextPublisherType, 'UnconfirmedPublisher', false);
                setFieldValue(field.name, '');
              }
              setQuery('');
            }}
            loading={isLoadingPublisherOptions || isLoadingPublisher}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, state) => (
              <Typography {...props} variant="subtitle1" component="li">
                <EmphasizeSubstring text={option.name} emphasized={state.inputValue} />
              </Typography>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  data-testid={dataTestId.registrationWizard.resourceType.publisherChip}
                  label={<Typography variant="subtitle1">{option.name}</Typography>}
                />
              ))
            }
            renderInput={(params) => (
              <AutocompleteTextField
                {...params}
                required
                label={t('common:publisher')}
                isLoading={isLoadingPublisherOptions || isLoadingPublisher}
                placeholder={!publisher?.id ? t('resource_type.search_for_publisher') : ''}
                showSearchIcon={!publisher?.id}
                errorMessage={meta.touched && !!meta.error ? meta.error : ''}
              />
            )}
          />
        )}
      </Field>
    </ThemeProvider>
  );
};
