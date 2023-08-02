import { Autocomplete, Box, Button, Chip, Typography } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PublicationChannelApiPath } from '../../../../api/apiPaths';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { NpiLevelTypography } from '../../../../components/NpiLevelTypography';
import { SearchResponse } from '../../../../types/common.types';
import { ResourceFieldNames, contextTypeBaseFieldName } from '../../../../types/publicationFieldNames';
import {
  JournalEntityDescription,
  JournalRegistration,
} from '../../../../types/publication_types/journalRegistration.types';
import { Journal, PublicationChannelType } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';
import { getPublicationChannelString, getYearQuery } from '../../../../utils/registration-helpers';
import { JournalFormDialog } from './JournalFormDialog';
import { PublicationChannelOption } from './PublicationChannelOption';

const journalFieldTestId = dataTestId.registrationWizard.resourceType.journalField;

interface JournalFieldProps {
  confirmedContextType: PublicationChannelType;
  unconfirmedContextType: PublicationChannelType;
}

export const JournalField = ({ confirmedContextType, unconfirmedContextType }: JournalFieldProps) => {
  const { t } = useTranslation();
  const { setFieldValue, setFieldTouched, values } = useFormikContext<JournalRegistration>();
  const { reference, publicationDate } = values.entityDescription as JournalEntityDescription;
  const year = publicationDate?.year ?? '';

  const [showJournalForm, setShowJournalForm] = useState(false);
  const toggleJournalForm = () => setShowJournalForm(!showJournalForm);

  const [query, setQuery] = useState(
    !reference?.publicationContext.id ? reference?.publicationContext.title ?? '' : ''
  );
  const debouncedQuery = useDebounce(query);
  const [journalOptions, isLoadingJournalOptions] = useFetch<SearchResponse<Journal>>({
    url:
      debouncedQuery && debouncedQuery === query
        ? `${PublicationChannelApiPath.Journal}?year=${getYearQuery(year)}&query=${encodeURIComponent(debouncedQuery)}`
        : '',
    errorMessage: t('feedback.error.get_journals'),
  });

  // Fetch Journals with matching ISSN
  const [journalsByIssn] = useFetch<Journal[]>({
    url:
      !reference?.publicationContext.id &&
      (reference?.publicationContext.printIssn || reference?.publicationContext.onlineIssn)
        ? `${PublicationChannelApiPath.Journal}?year=${getYearQuery(year)}&query=${
            reference.publicationContext.printIssn ?? reference.publicationContext.onlineIssn
          }`
        : '',
    errorMessage: t('feedback.error.get_journals'),
  });

  useEffect(() => {
    // Set Journal with matching ISSN
    if (journalsByIssn?.length === 1) {
      setFieldValue(ResourceFieldNames.PublicationContextType, confirmedContextType, false);
      setFieldValue(ResourceFieldNames.PublicationContextId, journalsByIssn[0].id);
      setQuery('');
    }
  }, [setFieldValue, journalsByIssn, confirmedContextType]);

  // Fetch selected journal
  const [journal, isLoadingJournal] = useFetchResource<Journal>(
    reference?.publicationContext.id ?? '',
    t('feedback.error.get_journal')
  );

  return (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <Field name={ResourceFieldNames.PublicationContextId}>
        {({ field, meta }: FieldProps<string>) => (
          <Autocomplete
            fullWidth
            multiple
            id={journalFieldTestId}
            data-testid={journalFieldTestId}
            aria-labelledby={`${journalFieldTestId}-label`}
            popupIcon={null}
            options={
              debouncedQuery && query === debouncedQuery && !isLoadingJournalOptions ? journalOptions?.hits ?? [] : []
            }
            filterOptions={(options) => options}
            inputValue={query}
            onInputChange={(_, newInputValue, reason) => {
              if (reason !== 'reset') {
                setQuery(newInputValue);
              }
              if (reason === 'input' && !newInputValue && reference?.publicationContext.title) {
                setFieldValue(contextTypeBaseFieldName, { type: unconfirmedContextType });
              }
            }}
            onBlur={() => setFieldTouched(field.name, true, false)}
            blurOnSelect
            disableClearable={!query}
            value={reference?.publicationContext.id && journal ? [journal] : []}
            onChange={(_, inputValue, reason) => {
              if (reason === 'selectOption') {
                setFieldValue(contextTypeBaseFieldName, {
                  type: confirmedContextType,
                  id: inputValue.pop()?.id,
                });
              } else if (reason === 'removeOption') {
                setFieldValue(contextTypeBaseFieldName, { type: unconfirmedContextType });
              }
              setQuery('');
            }}
            loading={isLoadingJournalOptions || isLoadingJournal}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, state) => (
              <PublicationChannelOption props={props} option={option} state={state} />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  data-testid={dataTestId.registrationWizard.resourceType.journalChip}
                  label={
                    <>
                      <Typography variant="subtitle1" component="h2">
                        {getPublicationChannelString(option)}
                      </Typography>
                      <NpiLevelTypography
                        variant="body2"
                        color="textSecondary"
                        scientificValue={option.scientificValue}
                      />
                    </>
                  }
                />
              ))
            }
            renderInput={(params) => (
              <AutocompleteTextField
                {...params}
                required
                label={t('registration.resource_type.journal')}
                isLoading={isLoadingJournalOptions || isLoadingJournal}
                placeholder={
                  !reference?.publicationContext.id ? t('registration.resource_type.search_for_journal') : ''
                }
                showSearchIcon={!reference?.publicationContext.id}
                errorMessage={meta.touched && !!meta.error ? meta.error : ''}
              />
            )}
          />
        )}
      </Field>
      {!reference?.publicationContext.id && (
        <>
          <Button
            variant="outlined"
            sx={{ height: 'fit-content', whiteSpace: 'nowrap', mt: '0.5rem' }}
            onClick={toggleJournalForm}>
            {t('registration.resource_type.create_journal')}
          </Button>
          <JournalFormDialog open={showJournalForm} closeDialog={toggleJournalForm} />
        </>
      )}
    </Box>
  );
};
