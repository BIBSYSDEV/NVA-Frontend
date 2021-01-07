import React, { useState } from 'react';
import { Field, FieldProps, getIn, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
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
import { RegistrationSubtype } from '../../../../types/publicationFieldNames';

interface SearchForContainerFieldProps {
  fieldName: string;
  targetedSubtypes: RegistrationSubtype[];
}

const SearchForContainerField = (props: SearchForContainerFieldProps) => {
  const { t } = useTranslation('registration');
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [containerSearch, isLoadingContainerSearch] = useSearchRegistrations(
    createSearchQuery(debouncedSearchTerm, props.targetedSubtypes)
  );

  const currentIdentifier = getIn(values, props.fieldName) ?? '';
  const [selectedContainer, isLoadingSelectedContainer] = useSearchRegistrations(`identifier="${currentIdentifier}"`);

  // Show only selected value as option unless user are performing a new search
  const options =
    (currentIdentifier &&
    selectedContainer &&
    selectedContainer.hits.length > 0 &&
    selectedContainer.hits[0].title === searchTerm
      ? selectedContainer.hits
      : containerSearch?.hits) ?? [];

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
          loading={isLoadingContainerSearch || isLoadingSelectedContainer}
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
              label={t('references.original_article')}
              required
              isLoading={isLoadingContainerSearch || isLoadingSelectedContainer}
              placeholder={t('references.search_for_original_article')}
              dataTestId="original-article-input"
              showSearchIcon
              errorMessage={meta.touched && !!meta.error ? meta.error : undefined}
            />
          )}
        />
      )}
    </Field>
  );
};

export default SearchForContainerField;
