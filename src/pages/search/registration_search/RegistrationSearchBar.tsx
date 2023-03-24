import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAltOutlined';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../../utils/searchHelpers';
import { AdvancedSearchRow } from '../registration_search/filters/AdvancedSearchRow';
import { SearchTextField } from '../SearchTextField';
import { RegistrationSortSelector } from './RegistrationSortSelector';

export const RegistrationSearchBar = () => {
  const { t } = useTranslation();
  const { values, submitForm } = useFormikContext<SearchConfig>();
  const properties = values.properties ?? [];

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
          xs: "'searchbar' 'sorting' 'advanced'",
          md: "'searchbar sorting' 'advanced advanced'",
        },
        columnGap: '2rem',
        rowGap: '0.75rem',
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
          <Box gridArea="advanced" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {properties.map((property, index) => (
              <AdvancedSearchRow
                key={index}
                propertySearchItem={property}
                removeFilter={() => {
                  remove(index);
                  submitForm();
                }}
                baseFieldName={`properties[${index}]`}
              />
            ))}
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
    </Box>
  );
};
