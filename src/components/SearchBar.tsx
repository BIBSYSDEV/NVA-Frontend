import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Box, Button, IconButton, MenuItem, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltIcon from '@mui/icons-material/FilterAltOutlined';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { dataTestId } from '../utils/dataTestIds';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../utils/searchHelpers';
import { DescriptionFieldNames, ResourceFieldNames } from '../types/publicationFieldNames';

const StyledTextField = styled(TextField)`
  margin-top: 0;
`;

export const SearchBar = () => {
  const { t } = useTranslation('search');
  const { values } = useFormikContext<SearchConfig>();
  const properties = values.properties ?? [];

  return (
    <>
      <Field name="searchTerm">
        {({ field, form: { submitForm } }: FieldProps<string>) => (
          <StyledTextField
            sx={{ gridArea: 'searchbar' }}
            {...field}
            id={field.name}
            data-testid={dataTestId.startPage.searchField}
            fullWidth
            variant="outlined"
            label={t('search')}
            helperText={t('search_help')}
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
              <AdvancedSearchRow key={index} index={index} remove={remove} />
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
                Legg til filter
              </Button>
              {properties.length > 0 && (
                <Button variant="contained" type="submit" startIcon={<SearchIcon />}>
                  Søk
                </Button>
              )}
            </Box>
          </Box>
        )}
      </FieldArray>
    </>
  );
};

interface AdvancedSearchRowProps extends Pick<FieldArrayRenderProps, 'remove'> {
  index: number;
}

const AdvancedSearchRow = ({ index, remove }: AdvancedSearchRowProps) => {
  const { t } = useTranslation('registration');

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 3fr 6fr 2fr', gap: '1rem' }}>
      <Field name={`properties[${index}].fieldName`}>
        {({ field }: FieldProps<string>) => (
          <StyledTextField {...field} select variant="outlined" label="Felt">
            <MenuItem value={DescriptionFieldNames.Title}>{t('common:title')}</MenuItem>
            <MenuItem value={DescriptionFieldNames.Abstract}>{t('description.abstract')}</MenuItem>
            <MenuItem value={ResourceFieldNames.SubType}>{t('search:registration_type')}</MenuItem>
          </StyledTextField>
        )}
      </Field>
      <Field name={`properties[${index}].operator`}>
        {({ field }: FieldProps<string>) => (
          <StyledTextField {...field} select SelectProps={{ displayEmpty: true }} variant="outlined" label="Operator">
            <MenuItem value={ExpressionStatement.Contains}>Inneholder</MenuItem>
            <MenuItem value={ExpressionStatement.NotContaining}>Inneholder ikke</MenuItem>
          </StyledTextField>
        )}
      </Field>
      <Field name={`properties[${index}].value`}>
        {({ field }: FieldProps<string>) => (
          <StyledTextField {...field} variant="outlined" label="Verdi" InputLabelProps={{ shrink: true }} />
        )}
      </Field>
      <Button onClick={() => remove(index)} color="error">
        Fjern filter
      </Button>
    </Box>
  );
};
