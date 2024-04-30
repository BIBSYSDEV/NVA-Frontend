import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAltOutlined';
import { Box, Button, IconButton, Skeleton } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, useFormikContext } from 'formik';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { fetchFundingSource, fetchOrganization, fetchPerson } from '../../../api/cristinApi';
import { fetchJournal, fetchPublisher, fetchSeries } from '../../../api/publicationChannelApi';
import { ResultParam } from '../../../api/searchApi';
import { AggregationFileKeyType, PublicationInstanceType } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  PropertySearch,
  createSearchConfigFromSearchParams,
  getFileFacetText,
  isValidIsbn,
  removeSearchParamValue,
} from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { getFullCristinName } from '../../../utils/user-helpers';
import { ExportResultsButton } from '../ExportResultsButton';
import { SearchPageProps } from '../SearchPage';
import { SearchTextField } from '../SearchTextField';
import { SearchTypeField } from '../SearchTypeField';
import { AdvancedSearchRow } from './filters/AdvancedSearchRow';

const facetParams: string[] = [
  ResultParam.Category,
  ResultParam.Contributor,
  ResultParam.Journal,
  ResultParam.Publisher,
  ResultParam.Files,
  ResultParam.FundingSource,
  ResultParam.ScientificIndex,
  ResultParam.Series,
  ResultParam.TopLevelOrganization,
];

interface SelectedFacet {
  param: string;
  value: string;
}
interface SearchTermProperties {
  searchTerm: string;
  properties: SearchTermProperty[];
}

interface SearchTermProperty {
  fieldName: ResultParam | '';
  value: string;
}

export const RegistrationSearchBar = ({ registrationQuery }: Pick<SearchPageProps, 'registrationQuery'>) => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const selectedFacets: SelectedFacet[] = [];
  searchParams.forEach((value, param) => {
    if (facetParams.includes(param)) {
      const values = value.split(',');
      values.forEach((thisValue) => {
        selectedFacets.push({ param, value: thisValue });
      });
    }
  });

  const initialSearchParams: SearchTermProperties = createSearchConfigFromSearchParams(searchParams);

  function processSearchParamProperties(values: SearchTermProperties, searchParam: ResultParam) {
    const paramValues =
      values.properties
        ?.filter((property) => property.fieldName === searchParam && property.value)
        .map((property) => property.value) ?? [];
    if (paramValues.length > 0) {
      searchParams.set(searchParam, paramValues.join(','));
    } else {
      searchParams.delete(searchParam);
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialSearchParams}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={(values: SearchTermProperties) => {
        searchParams.set(ResultParam.From, '0');

        if (values.searchTerm) {
          if (isValidIsbn(values.searchTerm)) {
            searchParams.delete(ResultParam.Query);
            values.properties.push({ fieldName: ResultParam.Isbn, value: values.searchTerm });
            values.searchTerm = '';
          } else {
            searchParams.set(ResultParam.Query, values.searchTerm);
          }
        } else {
          searchParams.delete(ResultParam.Query);
        }

        processSearchParamProperties(values, ResultParam.ContributorName);
        processSearchParamProperties(values, ResultParam.Title);
        processSearchParamProperties(values, ResultParam.Abstract);
        processSearchParamProperties(values, ResultParam.Tags);
        processSearchParamProperties(values, ResultParam.Identifier);
        processSearchParamProperties(values, ResultParam.Isbn);
        processSearchParamProperties(values, ResultParam.Issn);
        processSearchParamProperties(values, ResultParam.Doi);
        processSearchParamProperties(values, ResultParam.Handle);
        processSearchParamProperties(values, ResultParam.FundingIdentifier);
        processSearchParamProperties(values, ResultParam.FundingSource);
        processSearchParamProperties(values, ResultParam.Course);
        processSearchParamProperties(values, ResultParam.CristinIdentifier);

        history.push({ search: searchParams.toString() });
      }}>
      {({ values, submitForm }) => (
        <Box
          component={Form}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'auto 1fr auto' },
            gridTemplateAreas: {
              xs: "'typeSearch' 'searchbar' 'buttonRowTop' 'filter' 'buttonRowBottom' 'facets'",
              md: "'typeSearch searchbar buttonRowTop' 'filter filter buttonRowBottom' 'facets facets facets'",
            },
            gap: '0.75rem 0.5rem',
            mx: { xs: '0.5rem', md: 0 },
          }}>
          <SearchTypeField sx={{ gridArea: 'typeSearch' }} />
          <Field name="searchTerm" gridArea="searchbar">
            {({ field }: FieldProps<string>) => (
              <SearchTextField
                {...field}
                placeholder={t('search.search_placeholder')}
                clearValue={() => {
                  field.onChange({ target: { value: '', id: field.name } });
                  submitForm();
                }}
              />
            )}
          </Field>

          <Box gridArea="buttonRowTop">
            <FilterButton />
            <ExportResultsButton searchParams={searchParams} />
          </Box>

          <FieldArray name="properties">
            {({ push, remove }: FieldArrayRenderProps) => (
              <>
                <Box gridArea="filter" sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {values.properties.map((property, index) => (
                    <AdvancedSearchRow
                      key={index}
                      removeFilter={() => {
                        remove(index);
                        const valueToRemove = typeof property.value === 'string' ? property.value : property.value[0];
                        const newParams = removeSearchParamValue(searchParams, property.fieldName, valueToRemove);
                        newParams.set(ResultParam.From, '0');
                        history.push({ search: newParams.toString() });
                      }}
                      baseFieldName={`properties[${index}]`}
                    />
                  ))}
                </Box>
                <Box gridArea="buttonRowBottom" sx={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                  {values.properties && values.properties.length > 0 && (
                    <>
                      <IconButton
                        sx={{ borderRadius: '4px', minWidth: '36px', minHeight: '36px' }}
                        size="small"
                        color="primary"
                        title={t('common.add')}
                        data-testid={dataTestId.startPage.advancedSearch.addFilterButton}
                        onClick={() => {
                          const newPropertyFilter: PropertySearch = {
                            fieldName: '',
                            value: '',
                          };
                          push(newPropertyFilter);
                        }}>
                        <AddIcon />
                      </IconButton>

                      <Button
                        variant="contained"
                        type="submit"
                        data-testid={dataTestId.startPage.advancedSearch.searchButton}>
                        {t('common.search')}
                      </Button>
                    </>
                  )}
                </Box>
              </>
            )}
          </FieldArray>

          {!registrationQuery.isPending && selectedFacets.length > 0 && (
            <Box sx={{ gridArea: 'facets', display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
              {selectedFacets.map(({ param, value }) => {
                let fieldName = '';
                let fieldValueText: ReactNode = '';

                switch (param) {
                  case ResultParam.Category:
                    fieldName = t('common.category');
                    fieldValueText = t(`registration.publication_types.${value as PublicationInstanceType}`);
                    break;
                  case ResultParam.Contributor: {
                    fieldName = t('registration.contributors.contributor');
                    const personName = registrationQuery.data?.aggregations?.contributor?.find(
                      (bucket) => bucket.key === value
                    )?.labels;
                    if (personName) {
                      fieldValueText = getLanguageString(personName);
                    } else {
                      fieldValueText = (
                        <SelectedContributorFacetButton personId={typeof value === 'string' ? value : value[0]} />
                      );
                    }
                    break;
                  }
                  case ResultParam.TopLevelOrganization: {
                    fieldName = t('common.institution');
                    const institutionLabels = registrationQuery.data?.aggregations?.topLevelOrganization?.find(
                      (bucket) => bucket.key === value
                    )?.labels;

                    const institutionName = institutionLabels ? getLanguageString(institutionLabels) : '';
                    if (institutionName) {
                      fieldValueText = institutionName;
                    } else {
                      fieldValueText = (
                        <SelectedInstitutionFacetButton institutionId={typeof value === 'string' ? value : value[0]} />
                      );
                    }
                    break;
                  }
                  case ResultParam.FundingSource: {
                    fieldName = t('common.financier');
                    const fundingLabels = registrationQuery.data?.aggregations?.fundingSource?.find(
                      (bucket) => bucket.key === value
                    )?.labels;
                    const fundingName = fundingLabels ? getLanguageString(fundingLabels) : '';
                    if (fundingName) {
                      fieldValueText = fundingName;
                    } else {
                      fieldValueText = (
                        <SelectedFundingFacetButton fundingIdentifier={typeof value === 'string' ? value : value[0]} />
                      );
                    }
                    break;
                  }
                  case ResultParam.Publisher: {
                    fieldName = t('common.publisher');
                    const publisherLabels = registrationQuery.data?.aggregations?.publisher?.find(
                      (bucket) => bucket.key === value
                    )?.labels;
                    const publisherName = publisherLabels ? getLanguageString(publisherLabels) : '';
                    if (publisherName) {
                      fieldValueText = publisherName;
                    } else {
                      fieldValueText = (
                        <SelectedPublisherFacetButton
                          publisherIdentifier={typeof value === 'string' ? value : value[0]}
                        />
                      );
                    }
                    break;
                  }
                  case ResultParam.Series: {
                    fieldName = t('registration.resource_type.series');
                    const seriesLabels = registrationQuery.data?.aggregations?.series?.find(
                      (bucket) => bucket.key === value
                    )?.labels;
                    const seriesName = seriesLabels ? getLanguageString(seriesLabels) : '';
                    if (seriesName) {
                      fieldValueText = seriesName;
                    } else {
                      fieldValueText = (
                        <SelectedSeriesFacetButton seriesIdentifier={typeof value === 'string' ? value : value[0]} />
                      );
                    }
                    break;
                  }
                  case ResultParam.Journal: {
                    fieldName = t('registration.resource_type.journal');
                    const journalLabels = registrationQuery.data?.aggregations?.journal?.find(
                      (bucket) => bucket.key === value
                    )?.labels;
                    const journalName = journalLabels ? getLanguageString(journalLabels) : '';
                    if (journalName) {
                      fieldValueText = journalName;
                    } else {
                      fieldValueText = (
                        <SelectedJournalFacetButton journalIdentifier={typeof value === 'string' ? value : value[0]} />
                      );
                    }
                    break;
                  }
                  case ResultParam.ScientificIndex: {
                    fieldName = t('basic_data.nvi.nvi_publication_year');
                    fieldValueText = value;
                    break;
                  }
                  case ResultParam.Files: {
                    fieldName = t('registration.files_and_license.files');
                    fieldValueText = getFileFacetText(value as AggregationFileKeyType, t);
                    break;
                  }
                  default:
                    fieldValueText = typeof value === 'string' ? value : t('common.unknown');
                }

                if (!fieldName || !fieldValueText) {
                  return null;
                }

                return (
                  <Button
                    key={`${param}-${value}`}
                    data-testid={dataTestId.startPage.advancedSearch.removeFacetButton}
                    variant="outlined"
                    size="small"
                    title={t('search.remove_filter')}
                    sx={{ textTransform: 'none' }}
                    endIcon={<ClearIcon />}
                    onClick={() => {
                      const newParams = removeSearchParamValue(searchParams, param, value);
                      newParams.set(ResultParam.From, '0');
                      history.push({ search: newParams.toString() });
                    }}>
                    {fieldName}: {fieldValueText}
                  </Button>
                );
              })}
            </Box>
          )}
        </Box>
      )}
    </Formik>
  );
};

interface SelectedContributorFacetButtonProps {
  personId: string;
}

const SelectedContributorFacetButton = ({ personId }: SelectedContributorFacetButtonProps) => {
  const { t } = useTranslation();

  const personQuery = useQuery({
    queryKey: [personId],
    queryFn: () => (personId ? fetchPerson(personId) : undefined),
    meta: { errorMessage: t('feedback.error.get_person') },
  });

  const personName = getFullCristinName(personQuery.data?.names) || t('common.unknown');

  return <>{personQuery.isPending ? <Skeleton sx={{ width: '7rem', ml: '0.25rem' }} /> : personName}</>;
};

interface SelectedInstitutionFacetButtonProps {
  institutionId: string;
}

const SelectedInstitutionFacetButton = ({ institutionId }: SelectedInstitutionFacetButtonProps) => {
  const { t } = useTranslation();

  const organizationQuery = useQuery({
    queryKey: [institutionId],
    queryFn: () => (institutionId ? fetchOrganization(institutionId) : undefined),
    staleTime: Infinity,
    gcTime: 1_800_000,
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  const institutionName = getLanguageString(organizationQuery.data?.labels) || t('common.unknown');

  return <>{organizationQuery.isPending ? <Skeleton sx={{ width: '10rem', ml: '0.25rem' }} /> : institutionName}</>;
};

interface SelectedFundingFacetButtonProps {
  fundingIdentifier: string;
}

const SelectedFundingFacetButton = ({ fundingIdentifier }: SelectedFundingFacetButtonProps) => {
  const { t } = useTranslation();

  const fundingSourcesQuery = useQuery({
    queryKey: ['fundingSources', fundingIdentifier],
    queryFn: () => (fundingIdentifier ? fetchFundingSource(fundingIdentifier) : undefined),
    staleTime: Infinity,
    gcTime: 1_800_000,
    meta: { errorMessage: t('feedback.error.get_funding_source') },
  });

  const fundingName = getLanguageString(fundingSourcesQuery.data?.name) || t('common.unknown');

  return <>{fundingSourcesQuery.isPending ? <Skeleton sx={{ width: '7rem', ml: '0.25rem' }} /> : fundingName}</>;
};

interface SelectedPublisherFacetButtonProps {
  publisherIdentifier: string;
}

const SelectedPublisherFacetButton = ({ publisherIdentifier }: SelectedPublisherFacetButtonProps) => {
  const { t } = useTranslation();

  const publisherQuery = useQuery({
    queryKey: [publisherIdentifier],
    queryFn: () => (publisherIdentifier ? fetchPublisher(publisherIdentifier) : undefined),
    staleTime: Infinity,
    gcTime: 1_800_000,
    meta: { errorMessage: t('feedback.error.get_publisher') },
  });

  const publisherName = publisherQuery.data?.name || t('common.unknown');

  return <>{publisherQuery.isPending ? <Skeleton sx={{ width: '10rem', ml: '0.25rem' }} /> : publisherName}</>;
};

interface SelectedSeriesFacetButtonProps {
  seriesIdentifier: string;
}

const SelectedSeriesFacetButton = ({ seriesIdentifier }: SelectedSeriesFacetButtonProps) => {
  const { t } = useTranslation();

  const seriesQuery = useQuery({
    queryKey: [seriesIdentifier],
    queryFn: () => (seriesIdentifier ? fetchSeries(seriesIdentifier) : undefined),
    staleTime: Infinity,
    gcTime: 1_800_000,
    meta: { errorMessage: t('feedback.error.get_series') },
  });

  const seriesName = seriesQuery.data?.name || t('common.unknown');

  return <>{seriesQuery.isPending ? <Skeleton sx={{ width: '10rem', ml: '0.25rem' }} /> : seriesName}</>;
};

interface SelectedJournalFacetButtonProps {
  journalIdentifier: string;
}

const SelectedJournalFacetButton = ({ journalIdentifier }: SelectedJournalFacetButtonProps) => {
  const { t } = useTranslation();

  const journalQuery = useQuery({
    queryKey: [journalIdentifier],
    queryFn: () => (journalIdentifier ? fetchJournal(journalIdentifier) : undefined),
    staleTime: Infinity,
    gcTime: 1_800_000,
    meta: { errorMessage: t('feedback.error.get_journal') },
  });

  const journalName = journalQuery.data?.name || t('common.unknown');

  return <>{journalQuery.isPending ? <Skeleton sx={{ width: '10rem', ml: '0.25rem' }} /> : journalName}</>;
};

const FilterButton = () => {
  const { t } = useTranslation();
  const { values, setFieldValue, submitForm } = useFormikContext<SearchTermProperties>();

  return (
    <Button
      sx={{ mr: '0.5rem' }}
      data-testid={dataTestId.startPage.advancedSearch.activateFilterButton}
      startIcon={<FilterAltIcon />}
      onClick={() => {
        const newProp: SearchTermProperty = { fieldName: '', value: '' };
        if (values.properties.length === 0) {
          setFieldValue('properties', [newProp]);
        } else {
          setFieldValue('properties', []);
          submitForm();
        }
      }}
      variant={values.properties.length ? 'contained' : 'outlined'}>
      {t('common.filter')}
    </Button>
  );
};
