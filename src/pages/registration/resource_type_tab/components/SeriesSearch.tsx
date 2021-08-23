import { Field, FieldProps, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, MuiThemeProvider, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from 'styled-components';
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
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';

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

  const { seriesUri, seriesTitle } = values.entityDescription.reference.publicationContext as BookPublicationContext;
  const [query, setQuery] = useState(seriesTitle ?? '');
  const debouncedQuery = useDebounce(query);
  const year = values.entityDescription.date.year ?? new Date().getFullYear();
  const [journalOptions, isLoadingJournalOptions] = useFetch<Journal[]>({
    url:
      !seriesUri && debouncedQuery
        ? `${PublicationChannelApiPath.JournalSearch}?year=${year}&query=${debouncedQuery}`
        : '',
  });

  const [journal, isLoadingJournal] = useFetch<Journal[]>({
    url: seriesUri ?? '',
  });

  const selectedJournal = seriesUri && journal?.[0] ? journal[0] : null;

  const options = query && query === debouncedQuery && !isLoadingJournalOptions ? journalOptions ?? [] : [];

  return (
    <Field name="entityDescription.reference.publicationContext.seriesUri">
      {({ field }: FieldProps<string>) => (
        <StyledSeriesRow>
          {seriesUri ? (
            <TextField
              variant="filled"
              value={selectedJournal?.name ?? seriesTitle}
              label={t('common:title')}
              disabled
            />
          ) : (
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
                onInputChange={(_, newInputValue, reason) => {
                  if (reason !== 'reset') {
                    setQuery(newInputValue);
                  }
                }}
                value={selectedJournal}
                onChange={(_, inputValue) => {
                  setFieldValue(field.name, inputValue?.id);
                  setFieldValue(ResourceFieldNames.SeriesTitle, inputValue?.name);
                }}
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
          )}
          {seriesUri && (
            <DangerButton
              variant="contained"
              onClick={() => {
                setFieldValue(field.name, undefined);
                setFieldValue(ResourceFieldNames.SeriesTitle, '');
                setQuery('');
              }}
              endIcon={<DeleteIcon />}>
              {t('resource_type.remove_series')}
            </DangerButton>
          )}
          {seriesUri &&
            (isLoadingJournal ? (
              <CircularProgress />
            ) : (
              selectedJournal && (
                <div>
                  <Typography color="primary">
                    {[
                      selectedJournal.printIssn ? `${t('resource_type.print_issn')}: ${selectedJournal.printIssn}` : '',
                      selectedJournal.onlineIssn
                        ? `${t('resource_type.online_issn')}: ${selectedJournal.onlineIssn}`
                        : '',
                    ]
                      .filter((issn) => issn)
                      .join(', ')}
                  </Typography>
                  <Typography color="primary">
                    {t('resource_type.level')}: {selectedJournal.level}
                  </Typography>
                </div>
              )
            ))}
        </StyledSeriesRow>
      )}
    </Field>
  );
};
