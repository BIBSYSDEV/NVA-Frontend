import { Field, FieldProps, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, ThemeProvider, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';
import styled from 'styled-components';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { lightTheme } from '../../../../themes/lightTheme';
import { Journal, PublicationChannelType } from '../../../../types/registration.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { PublicationChannelApiPath } from '../../../../api/apiPaths';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { dataTestId } from '../../../../utils/dataTestIds';
import { contextTypeBaseFieldName, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import {
  JournalEntityDescription,
  JournalRegistration,
} from '../../../../types/publication_types/journalRegistration.types';
import { getPublicationChannelString, getYearQuery } from '../../../../utils/registration-helpers';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';

const journalFieldTestId = dataTestId.registrationWizard.resourceType.journalField;

const StyledChip = styled(Chip)`
  height: 100%;
`;

export const JournalField = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue, setFieldTouched, values } = useFormikContext<JournalRegistration>();
  const { reference, date } = values.entityDescription as JournalEntityDescription;
  const year = date?.year ?? '';

  const [query, setQuery] = useState(
    !reference?.publicationContext.id ? reference?.publicationContext.title ?? '' : ''
  );
  const debouncedQuery = useDebounce(query);
  const [journalOptions, isLoadingJournalOptions] = useFetch<Journal[]>({
    url:
      debouncedQuery && debouncedQuery === query
        ? `${PublicationChannelApiPath.JournalSearch}?year=${getYearQuery(year)}&query=${debouncedQuery}`
        : '',
    errorMessage: t('feedback:error.get_journals'),
  });

  // Fetch Journals with matching ISSN
  const [journalsByIssn] = useFetch<Journal[]>({
    url:
      !reference?.publicationContext.id &&
      (reference?.publicationContext.printIssn || reference?.publicationContext.onlineIssn)
        ? `${PublicationChannelApiPath.JournalSearch}?year=${getYearQuery(year)}&query=${
            reference.publicationContext.printIssn ?? reference.publicationContext.onlineIssn
          }`
        : '',
    errorMessage: t('feedback:error.get_journals'),
  });

  useEffect(() => {
    // Set Journal with matching ISSN
    if (journalsByIssn?.length === 1) {
      setFieldValue(ResourceFieldNames.PublicationContextType, PublicationChannelType.Journal, false);
      setFieldValue(ResourceFieldNames.PublicationContextId, journalsByIssn[0].id);
      setQuery('');
    }
  }, [setFieldValue, journalsByIssn]);

  // Fetch selected journal
  const [journal, isLoadingJournal] = useFetchResource<Journal>(
    reference?.publicationContext.id ?? '',
    t('feedback:error.get_journal')
  );

  return (
    <ThemeProvider theme={lightTheme}>
      <Field name={ResourceFieldNames.PublicationContextId}>
        {({ field, meta }: FieldProps<string>) => (
          <Autocomplete
            multiple
            id={journalFieldTestId}
            data-testid={journalFieldTestId}
            aria-labelledby={`${journalFieldTestId}-label`}
            popupIcon={null}
            options={debouncedQuery && query === debouncedQuery && !isLoadingJournalOptions ? journalOptions ?? [] : []}
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
            value={reference?.publicationContext.id && journal ? [journal] : []}
            onChange={(_, inputValue, reason) => {
              if (reason === 'selectOption') {
                setFieldValue(ResourceFieldNames.PublicationContextType, PublicationChannelType.Journal, false);
                setFieldValue(field.name, inputValue.pop()?.id);
              } else if (reason === 'removeOption') {
                setFieldValue(contextTypeBaseFieldName, { type: PublicationChannelType.UnconfirmedJournal }, false);
              }
              setQuery('');
            }}
            loading={isLoadingJournalOptions || isLoadingJournal}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, state) => (
              <li {...props}>
                <StyledFlexColumn>
                  <Typography variant="subtitle1">
                    <EmphasizeSubstring
                      text={getPublicationChannelString(option.name, option.onlineIssn, option.printIssn)}
                      emphasized={state.inputValue}
                    />
                  </Typography>
                  {option.level && (
                    <Typography variant="body2" color="textSecondary">
                      {t('resource_type.level')}: {option.level}
                    </Typography>
                  )}
                </StyledFlexColumn>
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <StyledChip
                  {...getTagProps({ index })}
                  data-testid={dataTestId.registrationWizard.resourceType.journalChip}
                  label={
                    <>
                      <Typography variant="subtitle1">
                        {getPublicationChannelString(option.name, option.onlineIssn, option.printIssn)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {t('resource_type.level')}: {option.level}
                      </Typography>
                    </>
                  }
                />
              ))
            }
            renderInput={(params) => (
              <AutocompleteTextField
                {...params}
                required
                label={t('resource_type.journal')}
                isLoading={isLoadingJournalOptions || isLoadingJournal}
                placeholder={!reference?.publicationContext.id ? t('resource_type.search_for_journal') : ''}
                showSearchIcon={!reference?.publicationContext.id}
                errorMessage={meta.touched && !!meta.error ? meta.error : ''}
              />
            )}
          />
        )}
      </Field>
    </ThemeProvider>
  );
};
