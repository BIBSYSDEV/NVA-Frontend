import { Field, FieldProps, getIn, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { Chip, ThemeProvider, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';
import styled from 'styled-components';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { lightTheme } from '../../../../themes/lightTheme';
import { RegistrationSubtype, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { Journal, Publisher, Registration, RegistrationDate } from '../../../../types/registration.types';
import { displayDate } from '../../../../utils/date-helpers';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useSearchRegistrations } from '../../../../utils/hooks/useSearchRegistrations';
import { dataTestId as dataTestIds } from '../../../../utils/dataTestIds';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';
import { Contributor } from '../../../../types/contributor.types';
import { useTranslation } from 'react-i18next';
import { BookPublicationContext } from '../../../../types/publication_types/bookRegistration.types';

const StyledChip = styled(Chip)`
  height: 100%;
`;

interface SearchContainerFieldProps {
  fieldName: string;
  searchSubtypes: RegistrationSubtype[];
  label: string;
  placeholder: string;
  dataTestId: string;
  fetchErrorMessage: string;
  descriptionToShow?: 'year-and-contributors' | 'publisher-and-level';
}

export const SearchContainerField = ({
  fieldName,
  searchSubtypes,
  label,
  placeholder,
  dataTestId,
  fetchErrorMessage,
  descriptionToShow = 'year-and-contributors',
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
                    {descriptionToShow === 'year-and-contributors' ? (
                      <YearAndContributorsText
                        date={option.entityDescription?.date}
                        contributors={option.entityDescription?.contributors ?? []}
                      />
                    ) : (
                      <ContainerAndLevelText registration={option} />
                    )}
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
                        {descriptionToShow === 'year-and-contributors' ? (
                          <YearAndContributorsText
                            date={option.entityDescription?.date}
                            contributors={option.entityDescription?.contributors ?? []}
                          />
                        ) : (
                          <ContainerAndLevelText registration={option} />
                        )}
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
  const contributorsText = contributors
    .slice(0, 5)
    .map((contributor) => contributor.identity.name)
    .join('; ');

  return (
    <Typography variant="body2" color="textSecondary">
      {[dateText, contributorsText].filter((text) => text).join(' - ')}
    </Typography>
  );
};

interface ContainerAndLevelTextProps {
  registration: Registration;
}

const ContainerAndLevelText = ({ registration }: ContainerAndLevelTextProps) => {
  const { t } = useTranslation('feedback');

  const publicationContext = registration.entityDescription?.reference?.publicationContext as BookPublicationContext;

  const [publisher] = useFetchResource<Publisher>(publicationContext.publisher?.id ?? '', t('error.get_publisher'));
  const [series] = useFetchResource<Journal>(publicationContext.series?.id ?? '', t('error.get_series'));

  return series ? (
    <>
      {publisher && (
        <Typography variant="body2" color="textSecondary">
          {t('common:publisher')}: {publisher.name}
        </Typography>
      )}
      <Typography variant="body2" color="textSecondary">
        {t('registration:resource_type.series')}: {series.name}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {t('registration:resource_type.level')}: {series.level}
      </Typography>
    </>
  ) : publisher ? (
    <>
      <Typography variant="body2" color="textSecondary">
        {t('common:publisher')}: {publisher.name}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {t('registration:resource_type.level')}: {publisher.level}
      </Typography>
    </>
  ) : null;
};
