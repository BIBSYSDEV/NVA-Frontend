import { Field, FieldProps, getIn, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextTruncate from 'react-text-truncate';
import { MuiThemeProvider, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import EmphasizeSubstring from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import lightTheme, { autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { RegistrationSubtype } from '../../../../types/publicationFieldNames';
import { levelMap, Registration } from '../../../../types/registration.types';
import { SearchFieldName, SearchPublicationContext } from '../../../../types/search.types';
import { API_URL } from '../../../../utils/constants';
import { displayDate } from '../../../../utils/date-helpers';
import useDebounce from '../../../../utils/hooks/useDebounce';
import { useSearchRegistrations } from '../../../../utils/hooks/useSearchRegistrations';
import { getRegistrationPath } from '../../../../utils/urlPaths';

interface SearchContainerFieldProps {
  fieldName: string;
  searchSubtypes: RegistrationSubtype[];
  label: string;
  placeholder: string;
  dataTestId: string;
}

const SearchContainerField = (props: SearchContainerFieldProps) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [searchContainerOptions, isLoadingSearchContainerOptions] = useSearchRegistrations({
    searchTerm: debouncedSearchTerm,
    properties: [{ fieldName: SearchFieldName.Subtype, value: props.searchSubtypes }],
  });

  const currentIdentifier = getIn(values, props.fieldName)?.split('/').pop() ?? '';
  const [selectedContainerSearch, isLoadingSelectedContainer] = useSearchRegistrations({
    properties: [{ fieldName: SearchFieldName.Id, value: currentIdentifier }],
  });
  const selectedContainer =
    currentIdentifier && selectedContainerSearch?.hits && selectedContainerSearch.hits.length === 1
      ? selectedContainerSearch.hits[0]
      : null;

  // Show only selected value as option unless user are performing a new search
  const options =
    selectedContainer && selectedContainer.title === searchTerm
      ? [selectedContainer]
      : searchContainerOptions?.hits ?? [];

  return (
    <div data-testid={props.dataTestId}>
      <Field name={props.fieldName}>
        {({ field, meta }: FieldProps<string>) => (
          <MuiThemeProvider theme={lightTheme}>
            <Autocomplete
              {...autocompleteTranslationProps}
              id={field.name}
              aria-labelledby={`${field.name}-label`}
              popupIcon={null}
              options={options}
              filterOptions={(options) => options}
              onBlur={() => setFieldTouched(field.name)}
              onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
              getOptionSelected={(option, value) => option.id === value.id}
              value={selectedContainer}
              onChange={(_, inputValue) => {
                if (inputValue) {
                  // Construct IRI manually, until it is part of the object itself
                  setFieldValue(field.name, `${API_URL}${getRegistrationPath(inputValue.id)}`);
                } else {
                  setSearchTerm('');
                  setFieldValue(field.name, '');
                }
              }}
              loading={isLoadingSearchContainerOptions || isLoadingSelectedContainer}
              getOptionLabel={(option) => option.title}
              renderOption={(option, state) => {
                const optionDate = option.publicationDate.year && displayDate(option.publicationDate);
                const optionContributors = option.contributors.map((contributor) => contributor.name).join('; ');
                const optionText = [optionDate, optionContributors].filter((string) => string).join(' - ');
                return (
                  <StyledFlexColumn>
                    <Typography variant="subtitle1">
                      <EmphasizeSubstring text={option.title} emphasized={state.inputValue} />
                    </Typography>
                    <Typography component="span" variant="body2" color="textSecondary">
                      <TextTruncate line={1} truncateText=" [...]" text={optionText} />
                    </Typography>
                  </StyledFlexColumn>
                );
              }}
              renderInput={(params) => (
                <AutocompleteTextField
                  {...params}
                  label={props.label}
                  required
                  isLoading={isLoadingSearchContainerOptions || isLoadingSelectedContainer}
                  placeholder={props.placeholder}
                  showSearchIcon
                  errorMessage={meta.touched && !!meta.error ? meta.error : undefined}
                />
              )}
            />
          </MuiThemeProvider>
        )}
      </Field>
      {selectedContainer?.reference?.publicationContext && (
        <SelectedContainerSummary publicationContext={selectedContainer.reference.publicationContext} />
      )}
    </div>
  );
};

interface SelectedContainerSummaryProps {
  publicationContext: SearchPublicationContext;
}

const SelectedContainerSummary = ({ publicationContext }: SelectedContainerSummaryProps) => {
  const { t } = useTranslation('registration');
  const { publisher, title, url, onlineIssn, printIssn, level } = publicationContext;
  const levelValue = level ? levelMap[level] : null;

  return (
    <>
      {title && (
        <Typography>
          {t('resource_type.journal')}: {title}
        </Typography>
      )}
      {publisher && (
        <Typography>
          {t('common:publisher')}: {publisher}
        </Typography>
      )}
      {url && (
        <Typography component="a" href={url}>
          {url}
        </Typography>
      )}
      {levelValue && (
        <Typography>
          {t('resource_type.level')}: {levelValue}
        </Typography>
      )}
      {(printIssn || onlineIssn) && (
        <Typography>
          {t('resource_type.issn')}: {[printIssn, onlineIssn].filter((issn) => issn).join(', ')}
        </Typography>
      )}
    </>
  );
};

export default SearchContainerField;
