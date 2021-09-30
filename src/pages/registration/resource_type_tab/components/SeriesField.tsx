import { Field, FieldProps, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, ThemeProvider, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';
import styled from 'styled-components';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { lightTheme, autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { Journal, PublicationChannelType, Registration } from '../../../../types/registration.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { PublicationChannelApiPath } from '../../../../api/apiPaths';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { BookEntityDescription } from '../../../../types/publication_types/bookRegistration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { getPublicationChannelString, getYearQuery } from '../../../../utils/registration-helpers';

const seriesFieldTestId = dataTestId.registrationWizard.resourceType.seriesField;

const StyledChip = styled(Chip)`
  padding: 2rem 0 2rem 0;
`;

export const SeriesField = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue, values } = useFormikContext<Registration>();
  const {
    reference: {
      publicationContext: { series },
    },
    date: { year },
  } = values.entityDescription as BookEntityDescription;

  const [query, setQuery] = useState(!series?.id ? series?.title ?? '' : '');
  const debouncedQuery = useDebounce(query);
  const [journalOptions, isLoadingJournalOptions] = useFetch<Journal[]>({
    url:
      debouncedQuery && debouncedQuery === query
        ? `${PublicationChannelApiPath.JournalSearch}?year=${getYearQuery(year)}&query=${debouncedQuery}`
        : '',
    errorMessage: t('feedback:error.get_series'),
  });

  const [journal, isLoadingJournal] = useFetch<Journal>({
    url: series?.id ?? '',
    errorMessage: t('feedback:error.get_series'),
  });

  return (
    <ThemeProvider theme={lightTheme}>
      <Field name={ResourceFieldNames.SeriesId}>
        {({ field, meta }: FieldProps<string>) => (
          <Autocomplete
            {...autocompleteTranslationProps}
            multiple
            id={seriesFieldTestId}
            data-testid={seriesFieldTestId}
            aria-labelledby={`${seriesFieldTestId}-label`}
            popupIcon={null}
            options={debouncedQuery && query === debouncedQuery && !isLoadingJournalOptions ? journalOptions ?? [] : []}
            filterOptions={(options) => options}
            inputValue={query}
            onInputChange={(_, newInputValue, reason) => {
              if (reason !== 'reset') {
                setQuery(newInputValue);
              }
            }}
            blurOnSelect
            disableClearable={!query}
            value={field.value && journal ? [journal] : []}
            onChange={(_, inputValue, reason) => {
              if (reason === 'selectOption') {
                setFieldValue(ResourceFieldNames.SeriesType, PublicationChannelType.Series);
                setFieldValue(field.name, inputValue.pop()?.id);
              } else if (reason === 'removeOption') {
                setFieldValue(ResourceFieldNames.SeriesType, PublicationChannelType.UnconfirmedSeries);
                setFieldValue(field.name, '');
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
                  data-testid={dataTestId.registrationWizard.resourceType.seriesChip}
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
                label={t('common:title')}
                isLoading={isLoadingJournalOptions || isLoadingJournal}
                placeholder={!field.value ? t('resource_type.search_for_series') : ''}
                showSearchIcon={!field.value}
                errorMessage={meta.touched && !!meta.error ? meta.error : ''}
              />
            )}
          />
        )}
      </Field>
    </ThemeProvider>
  );
};
