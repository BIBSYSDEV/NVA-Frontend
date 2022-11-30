import { ListItemButton } from '@mui/material';
import { useFormikContext } from 'formik';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../../utils/searchHelpers';
import { BaseFilterItem } from './BaseFilterItem';
import { Aggregations } from '../../../types/common.types';

interface RegistrationTypeFilterProps {
  aggregations: Aggregations;
}

export const RegistrationTypeFilter = ({ aggregations }: RegistrationTypeFilterProps) => {
  const { setFieldValue, submitForm, values } = useFormikContext<SearchConfig>();

  const properties = values.properties ?? [];

  const updateFilter = (fieldName: string, value: string) => {
    const existingFilter = [...properties];
    const shouldRemoveThisSearchParam = existingFilter.some((searchProperty) => searchProperty.value === value);

    if (shouldRemoveThisSearchParam) {
      const updatedFilter = existingFilter.filter((filter) => filter.fieldName !== fieldName || filter.value !== value);
      setFieldValue(`properties`, updatedFilter);
    } else {
      const newFilter: PropertySearch = {
        fieldName,
        value,
        operator: ExpressionStatement.Contains,
      };
      const updatedFilter = [...existingFilter, newFilter];

      setFieldValue(`properties`, updatedFilter);
    }
    submitForm();
  };

  return (
    <>
      {Object.entries(aggregations).map(([fieldName, facet]) => (
        <BaseFilterItem title={fieldName}>
          {facet.buckets.map((bucket) => (
            <li key={bucket.key}>
              <ListItemButton
                onClick={() => updateFilter(fieldName, bucket.key)}
                selected={properties.some((searchProperty) => searchProperty.value === bucket.key)}>
                {bucket.key} ({bucket.doc_count})
              </ListItemButton>
            </li>
          ))}
        </BaseFilterItem>
      ))}
    </>
  );
};
