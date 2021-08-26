import { Field, FieldProps, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MuiThemeProvider, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from 'styled-components';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { lightTheme, autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { Journal, Registration } from '../../../../types/registration.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { PublicationChannelApiPath } from '../../../../api/apiPaths';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { dataTestId } from '../../../../utils/dataTestIds';
import { DangerButton } from '../../../../components/DangerButton';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { JournalEntityDescription } from '../../../../types/publication_types/journalRegistration.types';
import { getYearQuery } from '../../../../utils/registration-helpers';

const journalFieldTestId = dataTestId.registrationWizard.resourceType.journalField;

const StyledSelectedJournalContainer = styled.div`
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

export const JournalSearch = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue, values } = useFormikContext<Registration>();
  const {
    reference: {
      publicationContext: { title },
    },
    date: { year },
  } = values.entityDescription as JournalEntityDescription;

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const [journalOptions, isLoadingJournalOptions] = useFetch<Journal[]>({
    url:
      !title && debouncedQuery && debouncedQuery === query
        ? `${PublicationChannelApiPath.JournalSearch}?year=${getYearQuery(year)}&query=${debouncedQuery}`
        : '',
  });

  const options = query && query === debouncedQuery && !isLoadingJournalOptions ? journalOptions ?? [] : [];

  return (
    <Field name={ResourceFieldNames.PubliactionContextTitle}>
      {({ field: { value, name }, meta: { error, touched } }: FieldProps<string>) =>
        !value ? (
          <MuiThemeProvider theme={lightTheme}>
            <Autocomplete
              {...autocompleteTranslationProps}
              id={journalFieldTestId}
              data-testid={journalFieldTestId}
              aria-labelledby={`${journalFieldTestId}-label`}
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
                <StyledFlexColumn>
                  <Typography variant="subtitle1">
                    <EmphasizeSubstring text={option.name} emphasized={state.inputValue} />
                  </Typography>
                  {option.level && (
                    <Typography variant="body2" color="textSecondary">
                      {t('resource_type.level')}: {option.level}
                    </Typography>
                  )}
                </StyledFlexColumn>
              )}
              renderInput={(params) => (
                <AutocompleteTextField
                  {...params}
                  label={t('resource_type.journal')}
                  isLoading={isLoadingJournalOptions}
                  placeholder={t('resource_type.search_for_journal')}
                  required
                  showSearchIcon
                  errorMessage={touched && error ? error : ''}
                />
              )}
            />
          </MuiThemeProvider>
        ) : (
          <StyledSelectedJournalContainer>
            <StyledTextField
              data-testid={journalFieldTestId}
              variant="filled"
              value={value}
              label={t('resource_type.journal')}
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
              {t('resource_type.remove_journal')}
            </StyledDangerButton>
          </StyledSelectedJournalContainer>
        )
      }
    </Field>
  );
};
