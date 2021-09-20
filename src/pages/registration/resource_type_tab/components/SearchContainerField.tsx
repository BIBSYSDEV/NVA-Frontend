import { Field, FieldProps, getIn, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { Chip, MuiThemeProvider, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import styled from 'styled-components';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { lightTheme, autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { RegistrationSubtype } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { SearchFieldName } from '../../../../types/search.types';
import { API_URL } from '../../../../utils/constants';
import { displayDate } from '../../../../utils/date-helpers';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useSearchRegistrations } from '../../../../utils/hooks/useSearchRegistrations';
import { getRegistrationPath } from '../../../../utils/urlPaths';
import { dataTestId } from '../../../../utils/dataTestIds';

const StyledChip = styled(Chip)`
  padding: 2rem 0 2rem 0;
`;

interface SearchContainerFieldProps {
  fieldName: string;
  searchSubtypes: RegistrationSubtype[];
  label: string;
  removeButtonLabel: string;
  placeholder: string;
  dataTestId: string;
}

export const SearchContainerField = (props: SearchContainerFieldProps) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);

  const [searchContainerOptions, isLoadingSearchContainerOptions] = useSearchRegistrations({
    searchTerm: debouncedQuery,
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

  return (
    <>
      <MuiThemeProvider theme={lightTheme}>
        <Field name={props.fieldName}>
          {({ field, meta }: FieldProps<string>) => (
            <>
              <Autocomplete
                {...autocompleteTranslationProps}
                multiple
                id={props.dataTestId}
                data-testid={props.dataTestId}
                aria-labelledby={`${props.dataTestId}-label`}
                popupIcon={null}
                options={
                  debouncedQuery && query === debouncedQuery && !isLoadingSearchContainerOptions
                    ? searchContainerOptions?.hits ?? []
                    : []
                }
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
                value={field.value && selectedContainer ? [selectedContainer] : []}
                onChange={(_, inputValue, reason) => {
                  if (reason === 'select-option') {
                    setFieldValue(field.name, `${API_URL}${getRegistrationPath(inputValue.pop()?.id)}`);
                  } else if (reason === 'remove-option') {
                    setFieldValue(field.name, '');
                  }
                  setQuery('');
                }}
                loading={isLoadingSearchContainerOptions || isLoadingSelectedContainer}
                getOptionLabel={(option) => option.title}
                renderOption={(option, state) => (
                  <StyledFlexColumn>
                    <Typography variant="subtitle1">
                      <EmphasizeSubstring text={option.title} emphasized={state.inputValue} />
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {displayDate(option.publicationDate)} -{' '}
                      {option.contributors
                        .slice(0, 5)
                        .map((contributor) => contributor.name)
                        .join('; ')}
                    </Typography>
                  </StyledFlexColumn>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <StyledChip
                      {...getTagProps({ index })}
                      data-testid={dataTestId.registrationWizard.resourceType.journalChip}
                      label={
                        <>
                          <Typography variant="subtitle1">{option.title}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {displayDate(option.publicationDate)} -{' '}
                            {option.contributors
                              .slice(0, 5)
                              .map((contributor) => contributor.name)
                              .join('; ')}
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
                    label={props.label}
                    isLoading={isLoadingSearchContainerOptions || isLoadingSelectedContainer}
                    placeholder={!field.value ? props.placeholder : ''}
                    showSearchIcon={!field.value}
                    errorMessage={meta.touched && !!meta.error ? meta.error : ''}
                  />
                )}
              />
            </>
          )}
        </Field>
      </MuiThemeProvider>
    </>
  );
};
