import { ListItemButton } from '@mui/material';
import { useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../../utils/searchHelpers';
import { BaseFilterItem } from './BaseFilterItem';
import { useEffect, useState } from 'react';
import { Aggregations, SearchResponse } from '../../../types/common.types';
import { Registration } from '../../../types/registration.types';

export const RegistrationTypeFilter = () => {
  const history = useHistory();
  const { setFieldValue, submitForm, values } = useFormikContext<SearchConfig>();

  const [facets, setFacets] = useState<Aggregations>({});
  useEffect(() => {
    const fetchFacets = async () => {
      const response = await fetch(`https://api.sandbox.nva.aws.unit.no/search/resources${history.location.search}`);
      const facetsJson = (await response.json()) as SearchResponse<Registration>;
      setFacets(facetsJson.aggregations ?? {});
    };
    fetchFacets();
  }, [history.location.search]);

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
      {Object.entries(facets).map(([fieldName, facet]) => (
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
