import { Box, Button, MenuItem, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { TFuncKey } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ResultParam } from '../../../../api/searchApi';
import { dataTestId } from '../../../../utils/dataTestIds';

interface FilterItem {
  field: string;
  i18nKey: TFuncKey;
}

const registrationFilters: FilterItem[] = [
  { field: ResultParam.Title, i18nKey: 'common.title' },
  { field: ResultParam.ContributorName, i18nKey: 'registration.contributors.contributor' },
  { field: ResultParam.Abstract, i18nKey: 'registration.description.abstract' },
  { field: ResultParam.Tags, i18nKey: 'registration.description.keywords' },
];

interface AdvancedSearchRowProps {
  baseFieldName: string;
  removeFilter: () => void;
}

export const AdvancedSearchRow = ({ removeFilter, baseFieldName }: AdvancedSearchRowProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem' }}>
      <Field name={`${baseFieldName}.fieldName`}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            select
            variant="outlined"
            sx={{ minWidth: '8rem' }}
            inputProps={{ sx: { py: '0.75rem' } }}
            label={t('search.field_label')}
            data-testid={dataTestId.startPage.advancedSearch.advancedFieldSelect}>
            {registrationFilters.map((filter) => (
              <MenuItem key={filter.i18nKey} value={filter.field}>
                {t<any>(filter.i18nKey)}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Field>

      <Field name={`${baseFieldName}.value`}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            fullWidth
            sx={{ maxWidth: '30rem' }}
            variant="outlined"
            inputProps={{ sx: { py: '0.75rem' } }}
            data-testid={dataTestId.startPage.advancedSearch.advancedValueField}
            label={t('search.search_term_label')}
          />
        )}
      </Field>
      <Button onClick={removeFilter} size="small" data-testid={dataTestId.startPage.advancedSearch.removeFilterButton}>
        {t('search.remove_filter')}
      </Button>
    </Box>
  );
};
