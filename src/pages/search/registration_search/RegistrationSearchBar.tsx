import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterAltIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchFundingSource, fetchOrganization, fetchPerson } from '../../../api/cristinApi';
import { fetchRegistrationsExport } from '../../../api/searchApi';
import { SortSelector } from '../../../components/SortSelector';
import { setNotification } from '../../../redux/notificationSlice';
import { RegistrationFieldName } from '../../../types/publicationFieldNames';
import { PublicationInstanceType, RegistrationAggregations } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  ExpressionStatement,
  PropertySearch,
  SearchConfig,
  removeSearchParamValue,
} from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { getFullCristinName } from '../../../utils/user-helpers';
import { SearchTextField } from '../SearchTextField';
import { AdvancedSearchRow, registrationFilters } from '../registration_search/filters/AdvancedSearchRow';

interface RegistrationSearchBarProps {
  aggregations?: RegistrationAggregations;
}

export const RegistrationSearchBar = ({ aggregations }: RegistrationSearchBarProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const searchParamsArray = Array.from(searchParams.entries());

  const { values, submitForm } = useFormikContext<SearchConfig>();
  const properties = values.properties ?? [];

  const [isLoadingExport, setIsLoadingExport] = useState(false);

  const showAdvancedSearch = properties.some(
    (property) =>
      !property.fieldName ||
      registrationFilters.some((filter) => filter.field === property.fieldName && filter.manuallyAddable)
  );

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
      <Field name="searchTerm">
        {({ field }: FieldProps<string>) => (
          <SearchTextField
            {...field}
            sx={{ gridArea: 'searchbar' }}
            placeholder={t('search.search_placeholder')}
            clearValue={() => {
              field.onChange({ target: { value: '', id: field.name } });
              submitForm();
            }}
          />
        )}
      </Field>

      <SortSelector
        sx={{ minWidth: '15rem', gridArea: 'sorting' }}
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
            const fetchExportData = await fetchRegistrationsExport(window.location.search);
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

      <FieldArray name="properties">
        {({ push, remove }: FieldArrayRenderProps) => (
          <>
            <Box gridArea="advanced" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {properties.map((property, index) => {
                const thisFilter = registrationFilters.find((filter) => filter.field === property.fieldName);
                if (property.fieldName && !thisFilter?.manuallyAddable) {
                  return null;
                }
                return (
                  <AdvancedSearchRow
                    key={index}
                    propertySearchItem={property}
                    removeFilter={() => {
                      remove(index);
                      submitForm();
                    }}
                    baseFieldName={`properties[${index}]`}
                  />
                );
              })}
              <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Button
                  data-testid={dataTestId.startPage.advancedSearch.addFilterButton}
                  variant="outlined"
                  onClick={() => {
                    const newPropertyFilter: PropertySearch = {
                      fieldName: '',
                      value: '',
                      operator: ExpressionStatement.Contains,
                    };
                    push(newPropertyFilter);
                  }}
                  startIcon={<FilterAltIcon />}>
                  {t('search.add_filter')}
                </Button>
                {showAdvancedSearch && (
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
            {searchParamsArray.length > 0 && (
              <Box sx={{ gridArea: 'facets', display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
                {searchParamsArray.map(([param, value]) => {
                  let fieldName = '';
                  let fieldValueText: ReactNode = '';

                  switch (param) {
                    case 'category':
                      fieldName = t('common.category');
                      fieldValueText = t(`registration.publication_types.${value as PublicationInstanceType}`);
                      break;
                    case 'contributorId': {
                      fieldName = t('registration.contributors.contributor');
                      const personName = aggregations?.contributorId?.find((bucket) => bucket.key === value)?.labels;
                      if (personName) {
                        fieldValueText = getLanguageString(personName);
                      } else {
                        fieldValueText = (
                          <SelectedContributorFacetButton personId={typeof value === 'string' ? value : value[0]} />
                        );
                      }
                      break;
                    }
                    case 'topLevelOrganization': {
                      fieldName = t('common.institution');
                      const institutionLabels = aggregations?.topLevelOrganization?.find(
                        (bucket) => bucket.key === value
                      )?.labels;

                      const institutionName = institutionLabels ? getLanguageString(institutionLabels) : '';
                      if (institutionName) {
                        fieldValueText = institutionName;
                      } else {
                        fieldValueText = (
                          <SelectedInstitutionFacetButton
                            institutionId={typeof value === 'string' ? value : value[0]}
                          />
                        );
                      }
                      break;
                    }
                    case 'fundingSource': {
                      fieldName = t('common.funding');
                      const fundingLabels = aggregations?.fundingSource?.find((bucket) => bucket.key === value)?.labels;
                      const fundingName = fundingLabels ? getLanguageString(fundingLabels) : '';
                      if (fundingName) {
                        fieldValueText = fundingName;
                      } else {
                        fieldValueText = (
                          <SelectedFundingFacetButton
                            fundingIdentifier={typeof value === 'string' ? value : value[0]}
                          />
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
                        history.push({ search: newParams.toString() });
                      }}>
                      {fieldName}: {fieldValueText}
                    </Button>
                  );
                })}
              </Box>
            )}
          </>
        )}
      </FieldArray>
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
  });

  const fundingName = getLanguageString(fundingSourcesQuery.data?.name) || t('common.unknown');

  return <>{fundingSourcesQuery.isLoading ? <Skeleton sx={{ width: '7rem', ml: '0.25rem' }} /> : fundingName}</>;
};
