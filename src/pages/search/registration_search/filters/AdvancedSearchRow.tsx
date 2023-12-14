import { Box, Button, MenuItem, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { TFuncKey } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ResultParam } from '../../../../api/searchApi';
import { dataTestId } from '../../../../utils/dataTestIds';
import { ExpressionStatement } from '../../../../utils/searchHelpers';

interface FilterItem {
  field: string;
  i18nKey: TFuncKey;
}

const registrationFilters: FilterItem[] = [
  { field: ResultParam.Title, i18nKey: 'common.title' },
  { field: ResultParam.ContributorName, i18nKey: 'registration.contributors.contributor' },
];

interface AdvancedSearchRowProps {
  baseFieldName: string;
  removeFilter: () => void;
}

export const AdvancedSearchRow = ({ removeFilter, baseFieldName }: AdvancedSearchRowProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '3fr 3fr 5fr auto' }, gap: '1rem' }}>
      <Field name={`${baseFieldName}.fieldName`}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            select
            variant="outlined"
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

      <TextField
        select
        disabled
        label={t('search.operator')}
        value={ExpressionStatement.Contains}
        data-testid={dataTestId.startPage.advancedSearch.advancedOperatorSelect}>
        <MenuItem value={ExpressionStatement.Contains}>{t('search.contains')}</MenuItem>
      </TextField>

      <Field name={`${baseFieldName}.value`}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            data-testid={dataTestId.startPage.advancedSearch.advancedValueField}
            variant="outlined"
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
