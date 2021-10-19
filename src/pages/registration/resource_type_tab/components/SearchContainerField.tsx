import { Field, FieldProps, getIn, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { Chip, ThemeProvider, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';
import styled from 'styled-components';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { lightTheme, autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { RegistrationSubtype, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { Publisher, Registration, RegistrationDate } from '../../../../types/registration.types';
import { displayDate } from '../../../../utils/date-helpers';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useSearchRegistrations } from '../../../../utils/hooks/useSearchRegistrations';
import { dataTestId as dataTestIds } from '../../../../utils/dataTestIds';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';
import { Contributor } from '../../../../types/contributor.types';

const StyledChip = styled(Chip)`
  padding: 2rem 0 2rem 0;
`;

interface SearchContainerFieldProps {
  fieldName: string;
  searchSubtypes: RegistrationSubtype[];
  label: string;
  placeholder: string;
  dataTestId: string;
  fetchErrorMessage: string;
  description?: 'year-and-contributors' | 'publisher-and-level';
}

export const SearchContainerField = ({
  fieldName,
  searchSubtypes,
  label,
  placeholder,
  dataTestId,
  fetchErrorMessage,
  description = 'year-and-contributors',
}: SearchContainerFieldProps) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);

  const [searchContainerOptions, isLoadingSearchContainerOptions] = useSearchRegistrations({
    searchTerm: debouncedQuery,
    properties: [{ fieldName: ResourceFieldNames.SubType, value: searchSubtypes }],
  });

  const [selectedContainer, isLoadingSelectedContainer] = useFetchResource<Registration>(
    getIn(values, fieldName),
    fetchErrorMessage
  );

  return (
    <ThemeProvider theme={lightTheme}>
      <Field name={fieldName}>
        {({ field, meta }: FieldProps<string>) => (
          <>
            <Autocomplete
              {...autocompleteTranslationProps}
              multiple
              id={dataTestId}
              data-testid={dataTestId}
              aria-labelledby={`${dataTestId}-label`}
              popupIcon={null}
              options={
                query === debouncedQuery && !isLoadingSearchContainerOptions ? searchContainerOptions?.hits ?? [] : []
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
                if (reason === 'selectOption') {
                  setFieldValue(field.name, inputValue.pop()?.id);
                } else if (reason === 'removeOption') {
                  setFieldValue(field.name, undefined);
                }
                setQuery('');
              }}
              loading={isLoadingSearchContainerOptions || isLoadingSelectedContainer}
              getOptionLabel={(option) => option.entityDescription?.mainTitle ?? ''}
              renderOption={(props, option, state) => (
                <li {...props}>
                  <StyledFlexColumn>
                    <Typography variant="subtitle1">
                      <EmphasizeSubstring
                        text={option.entityDescription?.mainTitle ?? ''}
                        emphasized={state.inputValue}
                      />
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {description === 'year-and-contributors' ? (
                        <YearAndContributorsText
                          date={option.entityDescription?.date}
                          contributors={option.entityDescription?.contributors ?? []}
                        />
                      ) : (
                        <PublisherAndLevelText option={option} />
                      )}
                    </Typography>
                  </StyledFlexColumn>
                </li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <StyledChip
                    {...getTagProps({ index })}
                    data-testid={dataTestIds.registrationWizard.resourceType.journalChip}
                    label={
                      <>
                        <Typography variant="subtitle1">{option.entityDescription?.mainTitle ?? ''}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {description === 'year-and-contributors' ? (
                            <YearAndContributorsText
                              date={option.entityDescription?.date}
                              contributors={option.entityDescription?.contributors ?? []}
                            />
                          ) : (
                            <PublisherAndLevelText option={option} />
                          )}
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
                  label={label}
                  isLoading={isLoadingSearchContainerOptions || isLoadingSelectedContainer}
                  placeholder={!field.value ? placeholder : ''}
                  showSearchIcon={!field.value}
                  errorMessage={meta.touched && !!meta.error ? meta.error : ''}
                />
              )}
            />
          </>
        )}
      </Field>
    </ThemeProvider>
  );
};

interface YearAndContributorsTextProps {
  date?: RegistrationDate;
  contributors: Contributor[];
}

const YearAndContributorsText = ({ date, contributors }: YearAndContributorsTextProps) => {
  const dateText = displayDate(date);
  const contributorsText = Array.isArray(contributors) // TODO: remove
    ? contributors
        .slice(0, 5)
        .map((contributor) => contributor.identity.name)
        .join('; ')
    : '';

  return <span>{[dateText, contributorsText].filter((text) => text).join(' - ')}</span>;
};

interface PublisherAndLevelTextProps {
  option: Registration;
}

const PublisherAndLevelText = ({ option }: PublisherAndLevelTextProps) => {
  const publicationContext = option.entityDescription?.reference?.publicationContext;

  const publisherId = publicationContext && 'id' in publicationContext ? publicationContext.id ?? '' : '';

  const [publisher] = useFetchResource<Publisher>(publisherId, 'sdf'); // todo:update useFetch type
  console.log(option, publisherId, publisher);

  return <span>Utgiver: {publisher?.name}</span>;
};
