import React, { useState } from 'react';
import { Field, FieldProps, getIn, useFormikContext } from 'formik';
import { Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Truncate from 'react-truncate';
import { Registration } from '../../../../types/registration.types';
import { autocompleteTranslationProps } from '../../../../themes/mainTheme';
import useSearchRegistrations from '../../../../utils/hooks/useSearchRegistrations';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import EmphasizeSubstring from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { displayDate } from '../../../../utils/date-helpers';
import useDebounce from '../../../../utils/hooks/useDebounce';
import { API_URL } from '../../../../utils/constants';
import { getRegistrationPath } from '../../../../utils/urlPaths';
import { createSearchQuery } from '../../../../utils/searchHelpers';
import { ReferenceFieldNames, RegistrationSubtype } from '../../../../types/publicationFieldNames';

interface SearchContainerFieldProps {
  fieldName: string;
  searchSubtypes: RegistrationSubtype[];
  label: string;
  placeholder: string;
}

const SearchContainerField = (props: SearchContainerFieldProps) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const optionsSearchQuery = createSearchQuery({
    searchTerm: debouncedSearchTerm,
    properties: [{ fieldName: ReferenceFieldNames.SUB_TYPE, value: props.searchSubtypes }],
  });
  const [searchContainerOptions, isLoadingSearchContainerOptions] = useSearchRegistrations(optionsSearchQuery);

  const currentIriValue = getIn(values, props.fieldName);
  const currentIdentifier = currentIriValue ? (currentIriValue.split('/').pop() as string) : '';
  const selectedContainerSearchQuery = createSearchQuery({
    properties: [{ fieldName: 'identifier', value: currentIdentifier }],
  });
  const [selectedContainer, isLoadingSelectedContainer] = useSearchRegistrations(selectedContainerSearchQuery);

  // Show only selected value as option unless user are performing a new search
  const options =
    (currentIdentifier &&
    selectedContainer &&
    selectedContainer.hits.length > 0 &&
    selectedContainer.hits[0].title === searchTerm
      ? selectedContainer.hits
      : searchContainerOptions?.hits) ?? [];

  return (
    <Field name={props.fieldName}>
      {({ field, meta }: FieldProps<string>) => (
        <Autocomplete
          {...autocompleteTranslationProps}
          popupIcon={null}
          options={options}
          onBlur={() => setFieldTouched(field.name)}
          onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
          getOptionSelected={(option, value) => option.id === value.id}
          value={selectedContainer?.hits[0] ?? null}
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
          renderOption={(option, state) => (
            <StyledFlexColumn>
              <Typography variant="subtitle1">
                <EmphasizeSubstring text={option.title} emphasized={state.inputValue} />
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <Truncate lines={1}>
                  {option.publicationDate.year && displayDate(option.publicationDate)}
                  {option.publicationDate.year && option.contributors.length > 0 && ' - '}
                  {option.contributors.map((contributor) => contributor.name).join('; ')}
                </Truncate>
              </Typography>
            </StyledFlexColumn>
          )}
          renderInput={(params) => (
            <AutocompleteTextField
              {...params}
              label={props.label}
              required
              isLoading={isLoadingSearchContainerOptions || isLoadingSelectedContainer}
              placeholder={props.placeholder}
              dataTestId="container-search-field"
              showSearchIcon
              errorMessage={meta.touched && !!meta.error ? meta.error : undefined}
            />
          )}
        />
      )}
    </Field>
  );
};

export default SearchContainerField;
