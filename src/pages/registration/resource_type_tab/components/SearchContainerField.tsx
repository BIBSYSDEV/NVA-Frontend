import { Field, FieldProps, getIn, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { Chip, Typography, Autocomplete, Box, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { RegistrationSubtype, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { Journal, Publisher, Registration, RegistrationDate } from '../../../../types/registration.types';
import { displayDate } from '../../../../utils/date-helpers';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useSearchRegistrations } from '../../../../utils/hooks/useSearchRegistrations';
import { dataTestId as dataTestIds } from '../../../../utils/dataTestIds';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';
import { Contributor } from '../../../../types/contributor.types';
import { BookPublicationContext } from '../../../../types/publication_types/bookRegistration.types';
import { ExpressionStatement } from '../../../../utils/searchHelpers';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';
import { getTitleString } from '../../../../utils/registration-helpers';
import { NpiLevelTypography } from '../../../../components/NpiLevelTypography';

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

  const [searchContainerOptions, isLoadingSearchContainerOptions] = useSearchRegistrations(
    {
      searchTerm: debouncedQuery,
      properties: [
        { fieldName: ResourceFieldNames.SubType, value: searchSubtypes, operator: ExpressionStatement.Contains },
      ],
    },
    25
  );

  const [selectedContainer, isLoadingSelectedContainer] = useFetchResource<Registration>(
    getIn(values, fieldName),
    fetchErrorMessage
  );

  useEffect(() => {
    if (stringIncludesMathJax(selectedContainer?.entityDescription?.mainTitle)) {
      typesetMathJax();
    }
  }, [selectedContainer]);

  return (
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
            getOptionLabel={(option) => getTitleString(option.entityDescription?.mainTitle)}
            renderOption={(props, option, state) => (
              <li {...props}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle1">
                    <EmphasizeSubstring
                      text={getTitleString(option.entityDescription?.mainTitle)}
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
                </Box>
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  data-testid={dataTestIds.registrationWizard.resourceType.journalChip}
                  label={
                    <>
                      <Typography variant="subtitle1">{getTitleString(option.entityDescription?.mainTitle)}</Typography>
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
  );
};

interface YearAndContributorsTextProps {
  date?: RegistrationDate;
  contributors: Contributor[];
}

export const YearAndContributorsText = ({ date, contributors }: YearAndContributorsTextProps) => {
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
  const { t } = useTranslation();

  const publicationContext = registration.entityDescription?.reference?.publicationContext as BookPublicationContext;
  const publisherId = publicationContext.publisher?.id ?? '';
  const seriesId = publicationContext.series?.id ?? '';

  const [publisher, isLoadingPublisher] = useFetchResource<Publisher>(publisherId, t('feedback.error.get_publisher'));
  const [series, isLoadingSeries] = useFetchResource<Journal>(seriesId, t('feedback.error.get_series'));

  return seriesId ? (
    <>
      {publisherId && (
        <ContainerDisplayName label={t('common.publisher')} value={publisher?.name} isLoading={isLoadingPublisher} />
      )}
      <ContainerDisplayName
        label={t('registration.resource_type.series')}
        value={series?.name}
        isLoading={isLoadingSeries}
      />
      <NpiLevelTypography variant="body2" color="textSecondary" level={series?.level} />
    </>
  ) : publisherId ? (
    <>
      <ContainerDisplayName label={t('common.publisher')} value={publisher?.name} isLoading={isLoadingPublisher} />
      <NpiLevelTypography variant="body2" color="textSecondary" level={publisher?.level} />
    </>
  ) : null;
};

interface ContainerDisplayNameProps {
  label: string;
  value?: string;
  isLoading: boolean;
}

const ContainerDisplayName = ({ label, value, isLoading }: ContainerDisplayNameProps) => (
  <Box sx={{ display: 'flex', gap: '0.25rem' }}>
    <Typography variant="body2" color="textSecondary">
      {label}:
    </Typography>

    {isLoading ? (
      <Skeleton sx={{ minWidth: '80%' }} />
    ) : (
      <Typography variant="body2" color="textSecondary">
        {value ? value : '?'}
      </Typography>
    )}
  </Box>
);
