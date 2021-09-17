import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, MuiThemeProvider, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import styled from 'styled-components';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { lightTheme, autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { Journal, Registration } from '../../../../types/registration.types';
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

  const [query, setQuery] = useState(series?.title ?? '');
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
    <MuiThemeProvider theme={lightTheme}>
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
        value={series?.id && journal ? [journal] : []}
        onChange={(_, inputValue, reason) => {
          if (reason === 'select-option') {
            setFieldValue(ResourceFieldNames.SeriesType, 'Series');
            setFieldValue(ResourceFieldNames.SeriesId, inputValue.pop()?.id);
          } else if (reason === 'remove-option') {
            setFieldValue(ResourceFieldNames.SeriesType, 'UnconfirmedSeries');
            setFieldValue(ResourceFieldNames.SeriesId, '');
          }
          setQuery('');
        }}
        loading={isLoadingJournalOptions || isLoadingJournal}
        getOptionLabel={(option) => option.name}
        renderOption={(option, state) => (
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
            placeholder={!series?.id ? t('resource_type.search_for_series') : ''}
            showSearchIcon={!series?.id}
          />
        )}
      />
    </MuiThemeProvider>
  );
};
