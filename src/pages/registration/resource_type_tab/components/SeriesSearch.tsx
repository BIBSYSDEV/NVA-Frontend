import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, MuiThemeProvider, TextField, Typography, Link } from '@material-ui/core';
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
import { BookEntityDescription } from '../../../../types/publication_types/bookRegistration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { DangerButton } from '../../../../components/DangerButton';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';

const seriesFieldTestId = dataTestId.registrationWizard.resourceType.seriesField;

const StyledSelectedSeriesContainer = styled.div`
  display: grid;
  grid-template-areas: 'field button' 'info info';
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'field' 'button' 'info';
  }
`;

const StyledTextField = styled(TextField)`
  grid-area: field;
`;

const StyledDangerButton = styled(DangerButton)`
  max-width: 10rem;
  grid-area: button;
`;

const StyledSeriesInfo = styled.div`
  grid-area: info;
`;

export const SeriesSearch = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue, values } = useFormikContext<Registration>();
  const {
    reference: {
      publicationContext: { seriesUri, seriesTitle },
    },
    date: { year },
  } = values.entityDescription as BookEntityDescription;

  const [query, setQuery] = useState(seriesTitle ?? '');
  const debouncedQuery = useDebounce(query);
  const queryYear = year ? year : new Date().getFullYear();
  const [journalOptions, isLoadingJournalOptions] = useFetch<Journal[]>({
    url:
      !seriesUri && debouncedQuery
        ? `${PublicationChannelApiPath.JournalSearch}?year=${queryYear}&query=${debouncedQuery}`
        : '',
  });

  const [journal, isLoadingJournal] = useFetch<Journal[]>({
    url: seriesUri ?? '',
  });

  const selectedJournal = seriesUri && journal?.[0] ? journal[0] : null;

  const options = query && query === debouncedQuery && !isLoadingJournalOptions ? journalOptions ?? [] : [];

  return !seriesUri ? (
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
          setFieldValue(ResourceFieldNames.SeriesUri, inputValue?.id);
          setFieldValue(ResourceFieldNames.SeriesTitle, inputValue?.name);
        }}
        loading={isLoadingJournalOptions}
        getOptionSelected={(option) => option.id === seriesUri}
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
          />
        )}
      />
    </MuiThemeProvider>
  ) : (
    <StyledSelectedSeriesContainer>
      <StyledTextField
        data-testid={seriesFieldTestId}
        variant="filled"
        value={isLoadingJournal ? seriesTitle : selectedJournal?.name ?? seriesTitle}
        label={t('common:title')}
        disabled
        multiline
      />
      <StyledDangerButton
        data-testid={dataTestId.registrationWizard.resourceType.removeSeriesButton}
        variant="contained"
        onClick={() => {
          setFieldValue(ResourceFieldNames.SeriesUri, undefined);
          setFieldValue(ResourceFieldNames.SeriesTitle, '');
          setQuery('');
        }}
        endIcon={<DeleteIcon />}>
        {t('resource_type.remove_series')}
      </StyledDangerButton>
      {isLoadingJournal ? <CircularProgress /> : selectedJournal && <ExternalSeriesInfo journal={selectedJournal} />}
    </StyledSelectedSeriesContainer>
  );
};

interface SeriesInfoProps {
  journal: Journal;
}

const ExternalSeriesInfo = ({ journal }: SeriesInfoProps) => {
  const { t } = useTranslation('registration');

  return (
    <StyledSeriesInfo>
      <Typography>
        {[
          journal.printIssn ? `${t('resource_type.print_issn')}: ${journal.printIssn}` : '',
          journal.onlineIssn ? `${t('resource_type.online_issn')}: ${journal.onlineIssn}` : '',
        ]
          .filter((issn) => issn)
          .join(', ')}
      </Typography>
      <Typography>
        {t('resource_type.level')}: {journal.level}
      </Typography>
      <Typography
        component={Link}
        href={`https://dbh.nsd.uib.no/publiseringskanaler/KanalTidsskriftInfo.action?id=${journal.identifier}`}
        target="_blank">
        {t('public_page.find_in_channel_registry')}
      </Typography>
    </StyledSeriesInfo>
  );
};
