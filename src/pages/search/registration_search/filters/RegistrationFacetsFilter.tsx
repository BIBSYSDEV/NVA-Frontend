import { Box, ListItemButton } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../../../utils/searchHelpers';
import { FacetItem } from './FacetItem';
import { Aggregations } from '../../../../types/common.types';
import { ResourceFieldNames, SearchFieldName } from '../../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../../types/registration.types';
import { getTranslatedAggregatedInstitutionLabel } from '../../../../utils/translation-helpers';

interface RegistrationFacetsFilterProps {
  aggregations: Aggregations;
  isLoadingSearch: boolean;
}

export const RegistrationFacetsFilter = ({ aggregations, isLoadingSearch }: RegistrationFacetsFilterProps) => {
  const { t } = useTranslation();
  const { setFieldValue, submitForm, values } = useFormikContext<SearchConfig>();

  const properties = values.properties ?? [];

  const updateFilter = (fieldName: string, value: string) => {
    const shouldRemoveThisSearchParam = properties.some((searchProperty) => searchProperty.value === value);

    if (shouldRemoveThisSearchParam) {
      const updatedFilter = properties.filter((filter) => filter.fieldName !== fieldName || filter.value !== value);
      setFieldValue('properties', updatedFilter);
    } else {
      const newFilter: PropertySearch = {
        fieldName,
        value,
        operator: ExpressionStatement.Contains,
      };
      const updatedFilter = [...properties, newFilter];
      setFieldValue('properties', updatedFilter);
    }
    submitForm();
  };

  const aggregationEntries = Object.entries(aggregations);
  const registrationTypeFacet = aggregationEntries.find(
    ([fieldName]) => fieldName === ResourceFieldNames.RegistrationType
  )?.[1];

  const registrationInstitutionFacet = aggregationEntries.find(
    ([fieldName]) => fieldName === SearchFieldName.InstitutionId
  )?.[1];

  return (
    <>
      {registrationTypeFacet && (
        <FacetItem title={t('registration.resource_type.resource_type')}>
          {registrationTypeFacet.buckets.map((bucket) => (
            <Box key={bucket.key} component="li">
              <ListItemButton
                disabled={isLoadingSearch}
                sx={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'space-between',
                  '&.Mui-selected': {
                    bgcolor: 'info.light',
                  },
                }}
                onClick={() => updateFilter(ResourceFieldNames.RegistrationType, bucket.key)}
                selected={properties.some((searchProperty) => searchProperty.value === bucket.key)}>
                <span>{t(`registration.publication_types.${bucket.key as PublicationInstanceType}`)}</span>
                {bucket.docCount && <span>({bucket.docCount.toLocaleString()})</span>}
              </ListItemButton>
            </Box>
          ))}
        </FacetItem>
      )}

      {registrationInstitutionFacet && (
        <FacetItem title={t('common.institution')}>
          {registrationInstitutionFacet.buckets.map((bucket) => (
            <Box key={bucket.key} component="li">
              <ListItemButton
                disabled={isLoadingSearch}
                sx={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'space-between',
                  '&.Mui-selected': {
                    bgcolor: 'info.light',
                  },
                }}
                onClick={() => updateFilter(SearchFieldName.InstitutionId, bucket.key)}
                selected={properties.some(
                  (searchProperty) => typeof searchProperty.value === 'string' && searchProperty.value === bucket.key
                )}>
                <span>{getTranslatedAggregatedInstitutionLabel(bucket)}</span>
                {bucket.docCount && <span>({bucket.docCount.toLocaleString()})</span>}
              </ListItemButton>
            </Box>
          ))}
        </FacetItem>
      )}
    </>
  );
};
