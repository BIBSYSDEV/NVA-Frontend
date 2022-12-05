import { Box, ListItemButton } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../../utils/searchHelpers';
import { BaseFilterItem } from './BaseFilterItem';
import { Aggregations } from '../../../types/common.types';
import { ResourceFieldNames } from '../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../types/registration.types';

interface RegistrationFacetsFilterProps {
  aggregations: Aggregations;
}

export const RegistrationFacetsFilter = ({ aggregations }: RegistrationFacetsFilterProps) => {
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
  const registrationTypeFacet = aggregationEntries.find(([fieldName]) => fieldName === ResourceFieldNames.SubType)?.[1];

  return (
    <>
      {registrationTypeFacet && (
        <BaseFilterItem title={t('registration.resource_type.resource_type')}>
          {registrationTypeFacet.buckets.map((bucket) => (
            <Box key={bucket.key} component="li" sx={{ ':last-of-type': { pb: '0.5em' } }}>
              <ListItemButton
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  '&.Mui-selected': {
                    bgcolor: 'info.light',
                  },
                }}
                onClick={() => updateFilter(ResourceFieldNames.SubType, bucket.key)}
                selected={properties.some((searchProperty) => searchProperty.value === bucket.key)}>
                <Box component="span">
                  {t(`registration.publication_types.${bucket.key as PublicationInstanceType}`)}
                </Box>
                <Box component="span">({bucket.doc_count})</Box>
              </ListItemButton>
            </Box>
          ))}
        </BaseFilterItem>
      )}
    </>
  );
};
