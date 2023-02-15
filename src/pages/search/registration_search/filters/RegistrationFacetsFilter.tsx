import { Box, ListItemButton } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../../../utils/searchHelpers';
import { FacetItem } from './FacetItem';
import { Aggregations } from '../../../../types/common.types';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../../types/registration.types';

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
  const registrationTypeFacet = aggregationEntries.find(([fieldName]) => fieldName === ResourceFieldNames.SubType)?.[1];

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
                onClick={() => updateFilter(ResourceFieldNames.SubType, bucket.key)}
                selected={properties.some((searchProperty) => searchProperty.value === bucket.key)}>
                <Box component="span">
                  {t(`registration.publication_types.${bucket.key as PublicationInstanceType}`)}
                </Box>
                {(bucket.docCount || bucket.doc_count) && <span>({bucket.docCount ?? bucket.doc_count})</span>}
              </ListItemButton>
            </Box>
          ))}
        </FacetItem>
      )}
    </>
  );
};
