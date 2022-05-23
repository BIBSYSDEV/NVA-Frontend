import { useTranslation } from 'react-i18next';
import { Box, Button, IconButton, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltIcon from '@mui/icons-material/FilterAltOutlined';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { dataTestId } from '../../utils/dataTestIds';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../utils/searchHelpers';
import { AdvancedSearchRow } from './filters/AdvancedSearchRow';

export const SearchBar = () => {
  const { t } = useTranslation('search');
  const { values, submitForm } = useFormikContext<SearchConfig>();
  const properties = values.properties ?? [];

  return (
    <>
      <Field name="searchTerm">
        {({ field }: FieldProps<string>) => (
          <TextField
            sx={{ gridArea: 'searchbar' }}
            {...field}
            id={field.name}
            data-testid={dataTestId.startPage.searchField}
            fullWidth
            variant="outlined"
            label={t('search')}
            placeholder={t('search_placeholder')}
            InputProps={{
              endAdornment: (
                <>
                  {field.value && (
                    <IconButton
                      onClick={() => {
                        field.onChange({ target: { value: '', id: field.name } });
                        submitForm();
                      }}
                      title={t('common:clear')}
                      size="large">
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton
                    type="submit"
                    data-testid={dataTestId.startPage.searchButton}
                    title={t('search')}
                    size="large">
                    <SearchIcon />
                  </IconButton>
                </>
              ),
            }}
          />
        )}
      </Field>
      <FieldArray name="properties">
        {({ push, remove }: FieldArrayRenderProps) => (
          <Box gridArea="advanced" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {properties.map((_, index) => (
              <AdvancedSearchRow
                key={index}
                removeFilter={() => remove(index)}
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
                {t('add_filter')}
              </Button>
              {properties.length > 0 && (
                <Button variant="contained" type="submit" startIcon={<SearchIcon />}>
                  {t('search')}
                </Button>
              )}
            </Box>
          </Box>
        )}
      </FieldArray>
    </>
  );
};
