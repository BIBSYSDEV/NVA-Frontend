import { Field, FieldProps, getIn, useFormikContext } from 'formik';
import React, { useState } from 'react';
import Truncate from 'react-truncate';
import { Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import EmphasizeSubstring from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { RegistrationSubtype } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { API_URL } from '../../../../utils/constants';
import { displayDate } from '../../../../utils/date-helpers';
import useDebounce from '../../../../utils/hooks/useDebounce';
import useSearchRegistrations from '../../../../utils/hooks/useSearchRegistrations';
import { getRegistrationPath } from '../../../../utils/urlPaths';
import { SearchFieldName } from '../../../../types/search.types';

interface SearchContainerFieldProps {
  fieldName: string;
  searchSubtypes: RegistrationSubtype[];
  label: string;
  placeholder: string;
}

const SearchContainerField = (props: SearchContainerFieldProps) => {
  const { t } = useTranslation('registration');
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
    currentIdentifier && selectedContainerSearch && selectedContainerSearch.hits.length === 1
      ? selectedContainerSearch.hits[0]
      : null;

  // Show only selected value as option unless user are performing a new search
  const options =
    selectedContainer && selectedContainer.title === searchTerm
      ? [selectedContainer]
      : searchContainerOptions?.hits ?? [];

  return (
    <>
      <Field name={props.fieldName}>
        {({ field, meta }: FieldProps<string>) => (
          <Autocomplete
            {...autocompleteTranslationProps}
            popupIcon={null}
            options={options}
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
      {selectedContainer?.reference?.publicationContext && (
        <>
          <Typography color="primary" variant="h2">
            Informasjon om valgt artikkel:
          </Typography>
          <Typography color="primary">Tidsskrift: {selectedContainer?.reference?.publicationContext.title}</Typography>
          <Typography color="primary">
            Utgiver: {selectedContainer?.reference?.publicationContext.publisher} (
            {selectedContainer?.reference?.publicationContext.onlineIssn}){' '}
            <a href={selectedContainer?.reference?.publicationContext.url}>Link</a>
          </Typography>
        </>
      )}
    </>
  );
};

export default SearchContainerField;
