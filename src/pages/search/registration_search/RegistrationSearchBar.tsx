import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAltOutlined';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../../utils/searchHelpers';
import { AdvancedSearchRow, registrationFilters } from '../registration_search/filters/AdvancedSearchRow';
import { SearchTextField } from '../SearchTextField';
import { RegistrationSortSelector } from './RegistrationSortSelector';

export const RegistrationSearchBar = () => {
  const { t } = useTranslation();
  const { values, submitForm } = useFormikContext<SearchConfig>();
  const properties = values.properties ?? [];

  return (
    <>
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
          <Box gridArea="advanced" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {properties.map(
              (property, index) =>
                !property.fieldName ||
                registrationFilters.find((filter) => filter.field === property.fieldName)?.manuallyAddable ? (
                  <AdvancedSearchRow
                    key={index}
                    propertySearchItem={property}
                    removeFilter={() => {
                      remove(index);
                      submitForm();
                    }}
                    baseFieldName={`properties[${index}]`}
                  />
                ) : null // Hide fields where user cannot set values themself. Typically terms based on aggregations (facets)
            )}
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Button
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
              {properties.length > 0 && (
                <Button variant="contained" type="submit" startIcon={<SearchIcon />}>
                  {t('common.search')}
                </Button>
              )}
            </Box>
          </Box>
        )}
      </FieldArray>
    </>
  );
};
