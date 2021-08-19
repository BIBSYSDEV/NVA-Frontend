import { Field, FieldProps, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MuiThemeProvider, Typography } from '@material-ui/core';
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

const seriesFieldTestId = dataTestId.registrationWizard.resourceType.seriesField;

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
    <MuiThemeProvider theme={lightTheme}>
      <Field name="entityDescription.reference.publicationContext.seriesUri">
        {({ field }: FieldProps<string>) => (
          <>
            <Autocomplete
              {...autocompleteTranslationProps}
              //   {...field}
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
              loading={isLoadingJournalOptions}
              getOptionSelected={(option, value) => {
                return option.id === field.value;
              }}
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
                  showSearchIcon
                />
              )}
            />
          </>
        )}
      </Field>
    </MuiThemeProvider>
  );
};
