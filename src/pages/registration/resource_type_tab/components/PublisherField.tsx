import { Field, FieldProps, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MuiThemeProvider, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from 'styled-components';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { lightTheme, autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { Publisher, Registration } from '../../../../types/registration.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { PublicationChannelApiPath } from '../../../../api/apiPaths';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { dataTestId } from '../../../../utils/dataTestIds';
import { DangerButton } from '../../../../components/DangerButton';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { BookEntityDescription } from '../../../../types/publication_types/bookRegistration.types';
import { getYearQuery } from '../../../../utils/registration-helpers';
import { StyledSelectedContainer } from './JournalField';

const publisherFieldTestId = dataTestId.registrationWizard.resourceType.publisherField;

const StyledTextField = styled(TextField)`
  grid-area: field;
`;

const StyledDangerButton = styled(DangerButton)`
  max-width: 15rem;
  grid-area: button;
`;

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
      !publisher?.id && debouncedQuery && debouncedQuery === query
        ? `${PublicationChannelApiPath.PublisherSearch}?year=${getYearQuery(year)}&query=${debouncedQuery}`
        : '',
    errorMessage: t('feedback:error.get_publishers'),
  });

  const options = query && query === debouncedQuery && !isLoadingPublisherOptions ? publisherOptions ?? [] : [];

  const [fetchedPublisher] = useFetch<Publisher>({
    url: publisher?.id ?? '',
    errorMessage: t('feedback:error.get_publisher'),
  });

  return (
    <Field name={ResourceFieldNames.PubliactionContextPublisherId}>
      {({ field: { value, name }, meta: { error, touched } }: FieldProps<string>) =>
        !value ? (
          <MuiThemeProvider theme={lightTheme}>
            <Autocomplete
              {...autocompleteTranslationProps}
              id={publisherFieldTestId}
              data-testid={publisherFieldTestId}
              aria-labelledby={`${publisherFieldTestId}-label`}
              popupIcon={null}
              options={options}
              filterOptions={(options) => options}
              inputValue={query}
              onInputChange={(_, newInputValue, reason) => {
                if (reason !== 'reset') {
                  setQuery(newInputValue);
                }
              }}
              onBlur={() => (!touched ? setFieldTouched(name) : null)}
              onChange={(_, inputValue) => {
                setFieldValue(ResourceFieldNames.PubliactionContextPublisherType, 'Publisher');
                setFieldValue(name, inputValue?.id);
              }}
              loading={isLoadingPublisherOptions}
              getOptionLabel={(option) => option.name}
              renderOption={(option, state) => (
                <Typography variant="subtitle1">
                  <EmphasizeSubstring text={option.name} emphasized={state.inputValue} />
                </Typography>
              )}
              renderInput={(params) => (
                <AutocompleteTextField
                  {...params}
                  label={t('common:publisher')}
                  isLoading={isLoadingPublisherOptions}
                  placeholder={t('resource_type.search_for_publisher')}
                  required
                  showSearchIcon
                  errorMessage={touched && error ? error : ''}
                />
              )}
            />
          </MuiThemeProvider>
        ) : (
          <StyledSelectedContainer>
            <StyledTextField
              data-testid={publisherFieldTestId}
              variant="filled"
              value={fetchedPublisher?.name ?? ''}
              label={t('common:publisher')}
              disabled
              multiline
              required
            />
            <StyledDangerButton
              data-testid={dataTestId.registrationWizard.resourceType.removePublisherButton}
              variant="contained"
              onClick={() => {
                setFieldValue(name, '');
                setQuery('');
              }}
              endIcon={<DeleteIcon />}>
              {t('resource_type.remove_publisher')}
            </StyledDangerButton>
          </StyledSelectedContainer>
        )
      }
    </Field>
  );
};
