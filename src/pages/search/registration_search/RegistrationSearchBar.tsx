import FilterAltIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Skeleton } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik } from 'formik';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { fetchFundingSource, fetchOrganization, fetchPerson } from '../../../api/cristinApi';
import { ResultParam } from '../../../api/searchApi';
import { PublicationInstanceType } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  createSearchConfigFromSearchParams,
  PropertySearch,
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
  ResultParam.Course,
  ResultParam.CristinId,
  ResultParam.Doi,
  ResultParam.GrantId,
  ResultParam.Handle,
  ResultParam.Isbn,
  ResultParam.Issn,
  ResultParam.TopLevelOrganization,
  ResultParam.FundingSource,
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
  fieldName: ResultParam;
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
      onSubmit={(values) => {
        searchParams.set(ResultParam.From, '0');

        if (values.searchTerm) {
          searchParams.set(ResultParam.Query, values.searchTerm);
        } else {
          searchParams.delete(ResultParam.Query);
        }

        processSearchParamProperties(values, ResultParam.ContributorName);
        processSearchParamProperties(values, ResultParam.Title);
        processSearchParamProperties(values, ResultParam.Abstract);
        processSearchParamProperties(values, ResultParam.Tags);
        processSearchParamProperties(values, ResultParam.Isbn);
        processSearchParamProperties(values, ResultParam.Issn);
        processSearchParamProperties(values, ResultParam.Doi);
        processSearchParamProperties(values, ResultParam.Handle);
        processSearchParamProperties(values, ResultParam.GrantId);
        processSearchParamProperties(values, ResultParam.Course);
        processSearchParamProperties(values, ResultParam.CristinId);

        history.push({ search: searchParams.toString() });
      }}>
      {({ values, submitForm }) => (
        <Box
          component={Form}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' },
            gridTemplateAreas: {
              xs: "'typeSearch' 'searchbar' 'advanced' 'facets'",
              md: "'typeSearch searchbar' 'advanced advanced' 'facets facets'",
            },
            gap: '0.75rem 0.5rem',
            mx: { xs: '0.5rem', md: 0 },
          }}>
          <SearchTypeField sx={{ gridArea: 'typeSearch' }} />

          <Box sx={{ gridArea: 'searchbar', display: 'flex', gap: '0.75rem 0.5rem', flexWrap: 'wrap' }}>
            <Field name="searchTerm">
              {({ field }: FieldProps<string>) => (
                <SearchTextField
                  {...field}
                  sx={{ flex: '1 0 15rem' }}
                  placeholder={t('search.search_placeholder')}
                  clearValue={() => {
                    field.onChange({ target: { value: '', id: field.name } });
                    submitForm();
                  }}
                />
              )}
            </Field>

            <ExportResultsButton searchParams={searchParams} />
          </Box>

          <FieldArray name="properties">
            {({ push, remove }: FieldArrayRenderProps) => (
              <Box gridArea="advanced" sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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

                <Box sx={{ display: 'flex', gap: '1rem' }}>
                  <Button
                    data-testid={dataTestId.startPage.advancedSearch.addFilterButton}
                    variant="outlined"
                    onClick={() => {
                      const newPropertyFilter: PropertySearch = {
                        fieldName: '',
                        value: '',
                      };
                      push(newPropertyFilter);
                    }}
                    startIcon={<FilterAltIcon />}>
                    {t('search.add_filter')}
                  </Button>
                  {values.properties && values.properties.length > 0 && (
                    <Button
                      variant="contained"
                      type="submit"
                      startIcon={<SearchIcon />}
                      data-testid={dataTestId.startPage.advancedSearch.searchButton}>
                      {t('common.search')}
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </FieldArray>

          {!registrationQuery.isLoading && selectedFacets.length > 0 && (
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
                    fieldName = t('common.funding');
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

  return <>{personQuery.isLoading ? <Skeleton sx={{ width: '7rem', ml: '0.25rem' }} /> : personName}</>;
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
    cacheTime: 1_800_000,
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  const institutionName = getLanguageString(organizationQuery.data?.labels) || t('common.unknown');

  return <>{organizationQuery.isLoading ? <Skeleton sx={{ width: '10rem', ml: '0.25rem' }} /> : institutionName}</>;
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
    cacheTime: 1_800_000,
    meta: { errorMessage: t('feedback.error.get_funding_source') },
  });

  const fundingName = getLanguageString(fundingSourcesQuery.data?.name) || t('common.unknown');

  return <>{fundingSourcesQuery.isLoading ? <Skeleton sx={{ width: '7rem', ml: '0.25rem' }} /> : fundingName}</>;
};
