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

const publisherFieldTestId = dataTestId.registrationWizard.resourceType.publisherField;

const StyledSelectedPublisherContainer = styled.div`
  display: grid;
  grid-template-areas: 'field button';
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'field' 'button';
  }
`;

const StyledTextField = styled(TextField)`
  grid-area: field;
`;

const StyledDangerButton = styled(DangerButton)`
  max-width: 15rem;
  grid-area: button;
`;

export const PublisherSearch = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue, values } = useFormikContext<Registration>();
  const {
    reference: {
      publicationContext: { publisher },
    },
    date: { year },
  } = values.entityDescription as BookEntityDescription;

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const [journalOptions, isLoadingJournalOptions] = useFetch<Publisher[]>({
    url:
      !publisher && debouncedQuery && debouncedQuery === query
        ? `${PublicationChannelApiPath.PublisherSearch}?year=${getYearQuery(year)}&query=${debouncedQuery}`
        : '',
    errorMessage: t('feedback:error.get_publishers'),
  });

  const options = query && query === debouncedQuery && !isLoadingJournalOptions ? journalOptions ?? [] : [];

  return (
    <Field name={ResourceFieldNames.PubliactionContextPublisher}>
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
              onChange={(_, inputValue) => setFieldValue(name, inputValue?.name)}
              loading={isLoadingJournalOptions}
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
                  isLoading={isLoadingJournalOptions}
                  placeholder={t('resource_type.search_for_publisher')}
                  required
                  showSearchIcon
                  errorMessage={touched && error ? error : ''}
                />
              )}
            />
          </MuiThemeProvider>
        ) : (
          <StyledSelectedPublisherContainer>
            <StyledTextField
              data-testid={publisherFieldTestId}
              variant="filled"
              value={value}
              label={t('common:publisher')}
              disabled
              multiline
              required
            />
            <StyledDangerButton
              data-testid={dataTestId.registrationWizard.resourceType.removeJournalButton}
              variant="contained"
              onClick={() => {
                setFieldValue(name, '');
                setQuery('');
              }}
              endIcon={<DeleteIcon />}>
              {t('resource_type.remove_publisher')}
            </StyledDangerButton>
          </StyledSelectedPublisherContainer>
        )
      }
    </Field>
  );
};
