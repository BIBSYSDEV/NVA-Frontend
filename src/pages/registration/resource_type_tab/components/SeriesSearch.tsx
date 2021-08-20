import { Field, FieldProps, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, MuiThemeProvider, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { lightTheme, autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { Registration } from '../../../../types/registration.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { PublicationChannelApiPath } from '../../../../api/apiPaths';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { BookPublicationContext } from '../../../../types/publication_types/bookRegistration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { DangerButton } from '../../../../components/DangerButton';
import styled from 'styled-components';

const seriesFieldTestId = dataTestId.registrationWizard.resourceType.seriesField;

const StyledSeriesRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
`;

interface Journal {
  id: string;
  identifier: string;
  name: string;
  active: boolean;
  website: string;
  level: string;
  onlineIssn: string;
  printIssn: string;
}

export const SeriesSearch = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue, values } = useFormikContext<Registration>();

  const { seriesUri } = values.entityDescription.reference.publicationContext as BookPublicationContext;

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const year = values.entityDescription.date.year ?? new Date().getFullYear();
  const [journalOptions, isLoadingJournalOptions] = useFetch<Journal[]>({
    url: debouncedQuery ? `${PublicationChannelApiPath.JournalSearch}?year=${year}&query=${debouncedQuery}` : '',
  });

  const [journal, isLoadingJournal] = useFetch<Journal[]>({
    url: seriesUri ?? '',
  });

  const options = query && query === debouncedQuery && !isLoadingJournalOptions ? journalOptions ?? [] : [];

  return (
    <Field name="entityDescription.reference.publicationContext.seriesUri">
      {({ field }: FieldProps<string>) => (
        <StyledSeriesRow>
          <MuiThemeProvider theme={lightTheme}>
            <Autocomplete
              {...autocompleteTranslationProps}
              id={seriesFieldTestId}
              data-testid={seriesFieldTestId}
              aria-labelledby={`${seriesFieldTestId}-label`}
              popupIcon={null}
              options={options}
              filterOptions={(options) => options}
              inputValue={query}
              onInputChange={(_, newInputValue) => setQuery(newInputValue)}
              value={seriesUri ? journal?.[0] ?? null : null}
              onChange={(_, inputValue) => {
                setFieldValue(field.name, inputValue?.id ?? null);
              }}
              debug
              loading={isLoadingJournalOptions}
              getOptionSelected={(option) => option.id === field.value}
              disabled={!!seriesUri}
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
                  label={t('common:title')}
                  isLoading={isLoadingJournalOptions}
                  placeholder={t('resource_type.search_for_series')}
                  showSearchIcon={!seriesUri}
                />
              )}
            />
          </MuiThemeProvider>
          {seriesUri && (
            <DangerButton variant="contained" onClick={() => setFieldValue(field.name, null)}>
              Fjern serie
            </DangerButton>
          )}
          {seriesUri &&
            (isLoadingJournal ? (
              <CircularProgress />
            ) : (
              journal?.[0] && (
                <div>
                  <Typography color="primary">
                    {[
                      journal[0].printIssn ? `Print ISSN: ${journal[0].printIssn}` : '',
                      journal[0].onlineIssn ? `Online ISSN: ${journal[0].onlineIssn}` : '',
                    ]
                      .filter((issn) => issn)
                      .join(', ')}
                  </Typography>
                  <Typography color="primary">
                    {t('resource_type.level')}: {journal[0].level}
                  </Typography>
                </div>
              )
            ))}
        </StyledSeriesRow>
      )}
    </Field>
  );
};
