import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Box, Button, IconButton, MenuItem, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltIcon from '@mui/icons-material/FilterAltOutlined';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { dataTestId } from '../utils/dataTestIds';
import { SearchConfig } from '../utils/searchHelpers';
import { DescriptionFieldNames, ResourceFieldNames } from '../types/publicationFieldNames';

const StyledTextField = styled(TextField)`
  margin-top: 0;
`;

const StyledSearchBar = styled(StyledTextField)`
  grid-area: searchbar;
`;

export const SearchBar = () => {
  const { t } = useTranslation('search');
  const { values } = useFormikContext<SearchConfig>();

  const properties = values.properties ?? [];

  return (
    <>
      <Field name="searchTerm">
        {({ field, form: { submitForm } }: FieldProps<string>) => (
          <StyledSearchBar
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
        {({ push, remove, form: { submitForm } }: FieldArrayRenderProps) => (
          <Box gridArea="advanced" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {properties.map((_, index) => (
              <AdvancedSearchRow key={index} index={index} remove={remove} />
            ))}
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Button
                variant="outlined"
                onClick={() => push({ fieldName: '', value: '' })}
                startIcon={<FilterAltIcon />}>
                Legg til filter
              </Button>
              {properties.length > 0 && (
                <Button variant="contained" type="submit">
                  SØK
                </Button>
              )}
            </Box>
          </Box>
        )}
      </FieldArray>
    </>
  );
};

const StyledAdvancedSearchRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 3fr 1fr;
  gap: 1rem;
`;

const AdvancedSearchRow = ({ index, remove }: any) => {
  const { t } = useTranslation('registration');

  return (
    <StyledAdvancedSearchRow>
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
          <StyledTextField
            {...field}
            select
            SelectProps={{ displayEmpty: true }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            label="Operator">
            <MenuItem>Inneholder</MenuItem>
            {/* <MenuItem>Inneholder ikke</MenuItem> */}
            {/* <MenuItem>Er lik</MenuItem> */}
            {/* <MenuItem>Er ikke lik</MenuItem> */}
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
    </StyledAdvancedSearchRow>
  );
};
