import { Field, FieldProps, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MuiThemeProvider, TextField, Typography } from '@material-ui/core';
import { Autocomplete, Skeleton } from '@material-ui/lab';
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

export const JournalField = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue, setFieldTouched, values } = useFormikContext<Registration>();
  const {
    reference: { publicationContext },
    date: { year },
  } = values.entityDescription as JournalEntityDescription;

  const [query, setQuery] = useState(publicationContext.title ?? '');
  const debouncedQuery = useDebounce(query);
  const [journalOptions, isLoadingJournalOptions] = useFetch<Journal[]>({
    url:
      !publicationContext.id && debouncedQuery && debouncedQuery === query
        ? `${PublicationChannelApiPath.JournalSearch}?year=${getYearQuery(year)}&query=${debouncedQuery}`
        : '',
  });
  const options = query && query === debouncedQuery && !isLoadingJournalOptions ? journalOptions ?? [] : [];

  const [journal, isLoadingJournal] = useFetch<Journal>({
    url: publicationContext.id ?? '',
    errorMessage: t('feedback:error.get_journal'),
  });

  const issnString =
    journal?.printIssn || journal?.onlineIssn
      ? [
          journal.printIssn ? `${t('resource_type.print_issn')}: ${journal.printIssn}` : '',
          journal.onlineIssn ? `${t('resource_type.online_issn')}: ${journal.onlineIssn}` : '',
        ]
          .filter((issn) => issn)
          .join(', ')
      : '';
  const selectedJournalString = journal ? (issnString ? `${journal.name} (${issnString})` : journal.name) : '';

  return (
    <Field name={ResourceFieldNames.PubliactionContextId}>
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
              onBlur={() => (!touched ? setFieldTouched(name) : null)}
              onChange={(_, inputValue) => {
                setFieldValue(ResourceFieldNames.PubliactionContextType, 'Journal');
                setFieldValue(name, inputValue?.id);
              }}
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
                  errorMessage={touched && !!error ? error : ''}
                />
              )}
            />
          </MuiThemeProvider>
        ) : (
          <StyledSelectedJournalContainer>
            <StyledTextField
              data-testid={journalFieldTestId}
              variant="filled"
              value={selectedJournalString}
              label={t('resource_type.journal')}
              disabled
              multiline
              required
            />
            <StyledDangerButton
              data-testid={dataTestId.registrationWizard.resourceType.removeJournalButton}
              variant="contained"
              onClick={() => {
                setFieldValue(ResourceFieldNames.PubliactionContextType, 'UnconfirmedJournal');
                setFieldValue(name, '');
                setQuery('');
              }}
              endIcon={<DeleteIcon />}>
              {t('resource_type.remove_journal')}
            </StyledDangerButton>
            {isLoadingJournal ? (
              <Skeleton width={300} />
            ) : (
              journal?.level && (
                <Typography>
                  {t('resource_type.level')}: {journal.level}
                </Typography>
              )
            )}
          </StyledSelectedJournalContainer>
        )
      }
    </Field>
  );
};
