import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterAltIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Skeleton } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import { useQuery } from '@tanstack/react-query';
import { FieldArray, FieldArrayRenderProps, Form, Formik } from 'formik';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchFundingSource, fetchOrganization, fetchPerson } from '../../../api/cristinApi';
import { ResultParam, fetchRegistrationsExport } from '../../../api/searchApi';
import { SearchForm } from '../../../components/SearchForm';
import { SortSelector } from '../../../components/SortSelector';
import { setNotification } from '../../../redux/notificationSlice';
import { RegistrationFieldName } from '../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  PropertySearch,
  createSearchConfigFromSearchParams,
  removeSearchParamValue,
} from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { getFullCristinName } from '../../../utils/user-helpers';
import { SearchPageProps } from '../SearchPage';
import { AdvancedSearchRow } from '../registration_search/filters/AdvancedSearchRow';

const facetParams: string[] = [
  ResultParam.Category,
  ResultParam.Contributor,
  ResultParam.TopLevelOrganization,
  ResultParam.FundingSource,
];

interface SelectedFacet {
  param: string;
  value: string;
}

export const RegistrationSearchBar = ({ registrationQuery }: Pick<SearchPageProps, 'registrationQuery'>) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
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

  const [isLoadingExport, setIsLoadingExport] = useState(false);

  const initialSearchParams = createSearchConfigFromSearchParams(searchParams);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '5fr auto auto' },
        gridTemplateAreas: {
          xs: "'searchbar' 'sorting' 'export' 'advanced' 'facets'",
          sm: "'searchbar sorting export' 'advanced advanced advanced' 'facets facets facets'",
        },
        gap: '0.75rem 1rem',
      }}>
      <SearchForm placeholder={t('search.search_placeholder')} />

      <SortSelector
        sx={{ minWidth: '15rem', gridArea: 'sorting' }}
        sortKey="sort"
        orderKey="order"
        options={[
          {
            orderBy: RegistrationFieldName.ModifiedDate,
            sortOrder: 'desc',
            label: t('search.sort_by_modified_date'),
          },
          {
            orderBy: RegistrationFieldName.PublishedDate,
            sortOrder: 'desc',
            label: t('search.sort_by_published_date_desc'),
          },
          {
            orderBy: RegistrationFieldName.PublishedDate,
            sortOrder: 'asc',
            label: t('search.sort_by_published_date_asc'),
          },
        ]}
      />

      <LoadingButton
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        loadingPosition="start"
        sx={{ gridArea: 'export' }}
        loading={isLoadingExport}
        onClick={async () => {
          setIsLoadingExport(true);
          try {
            const fetchExportData = await fetchRegistrationsExport(searchParams);
            // Force UTF-8 for excel with '\uFEFF': https://stackoverflow.com/a/42466254
            const blob = new Blob(['\uFEFF', fetchExportData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'result-export.csv';
            link.href = url;
            link.click();
          } catch {
            dispatch(setNotification({ message: t('feedback.error.get_registrations_export'), variant: 'error' }));
          } finally {
            setIsLoadingExport(false);
          }
        }}>
        {t('search.export')}
      </LoadingButton>

      <Formik
        initialValues={initialSearchParams}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values) => {
          searchParams.set(ResultParam.From, '0');

          const contributorNames =
            values.properties
              ?.filter((property) => property.fieldName === ResultParam.ContributorName && property.value)
              .map((property) => property.value) ?? [];
          if (contributorNames.length > 0) {
            searchParams.set(ResultParam.ContributorName, contributorNames.join(','));
          } else {
            searchParams.delete(ResultParam.ContributorName);
          }

          const title =
            values.properties
              ?.filter((property) => property.fieldName === ResultParam.Title && property.value)
              .map((property) => property.value) ?? [];
          if (title.length > 0) {
            searchParams.set(ResultParam.Title, title.join(','));
          } else {
            searchParams.delete(ResultParam.Title);
          }

          history.push({ search: searchParams.toString() });
        }}>
        {({ values }) => (
          <FieldArray name="properties">
            {({ push, remove }: FieldArrayRenderProps) => (
              <Box component={Form} gridArea="advanced" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        )}
      </Formik>

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
                const personName = registrationQuery.data?.aggregations?.contributorId?.find(
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
