import { Autocomplete, Box, Chip, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldProps, getIn, useFormikContext } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResource } from '../../../../api/commonApi';
import { fetchResults } from '../../../../api/searchApi';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { NpiLevelTypography } from '../../../../components/NpiLevelTypography';
import { StyledInfoBanner } from '../../../../components/styled/Wrappers';
import { RegistrationFormContext } from '../../../../context/RegistrationFormContext';
import { PreviewContributor } from '../../../../types/contributor.types';
import {
  PublicationInstanceType,
  Publisher,
  Registration,
  RegistrationDate,
  RegistrationSearchItem,
  SerialPublication,
} from '../../../../types/registration.types';
import { dataTestId as dataTestIds } from '../../../../utils/dataTestIds';
import { displayDate } from '../../../../utils/date-helpers';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';
import { convertToRegistrationSearchItem, getTitleString } from '../../../../utils/registration-helpers';
import { isValidIsbn } from '../../../../utils/searchHelpers';
import { LockedNviFieldDescription } from '../../LockedNviFieldDescription';

interface SearchContainerFieldProps {
  fieldName: string;
  searchSubtypes: PublicationInstanceType[];
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
  const { t } = useTranslation();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);

  const formattedDebouncedQuery = isValidIsbn(debouncedQuery) ? debouncedQuery.replaceAll('-', '') : debouncedQuery;

  const containerOptionsQuery = useQuery({
    enabled: debouncedQuery === query,
    queryKey: ['container', formattedDebouncedQuery, searchSubtypes],
    queryFn: () => fetchResults({ query: formattedDebouncedQuery, categoryShould: searchSubtypes, results: 25 }),
    meta: { errorMessage: t('feedback.error.search') },
  });

  const { disableNviCriticalFields } = useContext(RegistrationFormContext);

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
          {disableNviCriticalFields && (
            <StyledInfoBanner sx={{ mb: '1rem' }}>
              <LockedNviFieldDescription fieldLabel={t('registration.resource_type.journal')} />
            </StyledInfoBanner>
          )}

          <Autocomplete
            disabled={disableNviCriticalFields}
            multiple
            id={dataTestId}
            data-testid={dataTestId}
            aria-labelledby={`${dataTestId}-label`}
            popupIcon={null}
            options={
              query === debouncedQuery && !containerOptionsQuery.isPending
                ? (containerOptionsQuery.data?.hits ?? [])
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
            value={field.value && selectedContainer ? [convertToRegistrationSearchItem(selectedContainer)] : []}
            onChange={(_, inputValue, reason) => {
              if (reason === 'selectOption') {
                setFieldValue(field.name, inputValue.pop()?.id);
              } else if (reason === 'removeOption') {
                setFieldValue(field.name, undefined);
              }
              setQuery('');
            }}
            loading={containerOptionsQuery.isFetching || isLoadingSelectedContainer}
            getOptionLabel={(option) => getTitleString(option.mainTitle)}
            renderOption={({ key, ...props }, option, state) => (
              <li {...props} key={option.identifier}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle1">
                    <EmphasizeSubstring text={getTitleString(option.mainTitle)} emphasized={state.inputValue} />
                  </Typography>
                  {descriptionToShow === 'year-and-contributors' ? (
                    <YearAndContributorsText
                      date={option.publicationDate}
                      contributors={option.contributorsPreview ?? []}
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
                  key={option.identifier}
                  data-testid={dataTestIds.registrationWizard.resourceType.journalChip}
                  label={
                    <>
                      <Typography variant="subtitle1">{getTitleString(option.mainTitle)}</Typography>
                      {descriptionToShow === 'year-and-contributors' ? (
                        <YearAndContributorsText
                          date={option.publicationDate}
                          contributors={option.contributorsPreview ?? []}
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
                isLoading={containerOptionsQuery.isFetching || isLoadingSelectedContainer}
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
  contributors: PreviewContributor[];
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
  registration: RegistrationSearchItem;
}

const ContainerAndLevelText = ({ registration }: ContainerAndLevelTextProps) => {
  const { t } = useTranslation();

  const publishingDetails = registration.publishingDetails;
  const publisherId = publishingDetails?.publisher?.id ?? '';
  const seriesId = publishingDetails?.series?.id ?? '';

  const publisherQuery = useQuery({
    queryKey: ['channel', publisherId],
    enabled: !!publisherId,
    queryFn: () => fetchResource<Publisher>(publisherId),
    meta: { errorMessage: t('feedback.error.get_publisher') },
    staleTime: Infinity,
  });

  const seriesQuery = useQuery({
    queryKey: ['channel', seriesId],
    enabled: !!seriesId,
    queryFn: () => fetchResource<SerialPublication>(seriesId),
    meta: { errorMessage: t('feedback.error.get_series') },
    staleTime: Infinity,
  });

  const publisher = publisherQuery.data;
  const series = seriesQuery.data;

  return seriesId ? (
    <>
      {publisherId && (
        <ContainerDisplayName
          label={t('common.publisher')}
          value={publisher?.name}
          isLoading={publisherQuery.isFetching}
        />
      )}
      <ContainerDisplayName
        label={t('registration.resource_type.series')}
        value={series?.name}
        isLoading={seriesQuery.isFetching}
      />
      <NpiLevelTypography variant="body2" color="textSecondary" scientificValue={series?.scientificValue} />
    </>
  ) : publisherId ? (
    <>
      <ContainerDisplayName
        label={t('common.publisher')}
        value={publisher?.name}
        isLoading={publisherQuery.isFetching}
      />
      <NpiLevelTypography variant="body2" color="textSecondary" scientificValue={publisher?.scientificValue} />
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
