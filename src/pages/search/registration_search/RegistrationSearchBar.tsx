import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltIcon from '@mui/icons-material/FilterAltOutlined';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../../utils/searchHelpers';
import { AdvancedSearchRow, registrationFilters } from '../registration_search/filters/AdvancedSearchRow';
import { SearchTextField } from '../SearchTextField';
import { RegistrationSortSelector } from './RegistrationSortSelector';
import { dataTestId } from '../../../utils/dataTestIds';
import { PublicationInstanceType, RegistrationSearchAggregations } from '../../../types/registration.types';
import { ResourceFieldNames, SearchFieldName } from '../../../types/publicationFieldNames';
import { getLabelFromBucket } from '../../../utils/translation-helpers';

interface RegistrationSearchBarProps {
  aggregations?: RegistrationSearchAggregations;
}

export const RegistrationSearchBar = ({ aggregations }: RegistrationSearchBarProps) => {
  const { t } = useTranslation();
  const { values, submitForm } = useFormikContext<SearchConfig>();
  const properties = values.properties ?? [];

  const showAdvancedSearch = properties.some(
    (property) =>
      !property.fieldName ||
      registrationFilters.some((filter) => filter.field === property.fieldName && filter.manuallyAddable)
  );

  return (
    <Box
      sx={{
        mx: {
          xs: '1rem',
          md: 0,
        },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '5fr 2fr' },
        gridTemplateAreas: {
          xs: "'searchbar' 'sorting' 'advanced' 'facets'",
          sm: "'searchbar sorting' 'advanced advanced' 'facets facets'",
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
      <RegistrationSortSelector />

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

            {aggregations && (
              <Box sx={{ gridArea: 'facets', display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
                {properties.map((property, index) => {
                  const thisFilter = registrationFilters.find((filter) => filter.field === property.fieldName);

                  if (!thisFilter || thisFilter.manuallyAddable) {
                    return null;
                  }

                  const fieldName = t(thisFilter.i18nKey) as string;
                  let fieldValueText = '';
                  switch (thisFilter.field) {
                    case ResourceFieldNames.RegistrationType:
                      fieldValueText = t(`registration.publication_types.${property.value as PublicationInstanceType}`);
                      break;
                    case SearchFieldName.ContributorId:
                      fieldValueText =
                        aggregations.entityDescription.contributors.identity.id.buckets.find(
                          (bucket) => bucket.key === property.value
                        )?.name.buckets[0].key ?? t('common.unknown');
                      break;
                    case SearchFieldName.TopLevelOrganizationId: {
                      const institutionLabels = aggregations.topLevelOrganization.id.buckets.find(
                        (bucket) => bucket.key === property.value
                      );
                      fieldValueText = institutionLabels
                        ? getLabelFromBucket(institutionLabels) ?? t('common.unknown')
                        : t('common.unknown');
                      break;
                    }
                    case SearchFieldName.FundingSource: {
                      const fundingLabels = aggregations.fundings.identifier.buckets.find(
                        (bucket) => bucket.key === property.value
                      );
                      fieldValueText = fundingLabels
                        ? getLabelFromBucket(fundingLabels) ?? t('common.unknown')
                        : t('common.unknown');
                      break;
                    }
                    default:
                      fieldValueText = typeof property.value === 'string' ? property.value : t('common.unknown');
                  }

                  return (
                    <Button
                      key={property.fieldName + index}
                      data-testid={dataTestId.startPage.advancedSearch.removeFacetButton}
                      variant="outlined"
                      size="small"
                      title={t('search.remove_filter')}
                      sx={{ textTransform: 'none' }}
                      endIcon={<ClearIcon />}
                      onClick={() => {
                        remove(index);
                        submitForm();
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
