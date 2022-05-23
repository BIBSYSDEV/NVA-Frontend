import { Box, MenuItem, Button, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  DescriptionFieldNames,
  ResourceFieldNames,
  ContributorFieldNames,
  SpecificContributorFieldNames,
} from '../../../types/publicationFieldNames';
import { ExpressionStatement } from '../../../utils/searchHelpers';

interface AdvancedSearchRowProps {
  baseFieldName: string;
  removeFilter: () => void;
}

export const registrationFilters = [
  { field: DescriptionFieldNames.Title, i18nKey: 'common:title' },
  { field: DescriptionFieldNames.Abstract, i18nKey: 'registration:description.abstract' },
  { field: ResourceFieldNames.SubType, i18nKey: 'registration_type' },
  { field: DescriptionFieldNames.Tags, i18nKey: 'registration:description.keywords' },
  {
    field: `${ContributorFieldNames.Contributors}.${SpecificContributorFieldNames.Name}`,
    i18nKey: 'registration:contributors.contributor',
  },
  { field: `${DescriptionFieldNames.Date}.year`, i18nKey: 'year_published' },
];

export const AdvancedSearchRow = ({ removeFilter, baseFieldName }: AdvancedSearchRowProps) => {
  const { t } = useTranslation('search');

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '3fr 3fr 5fr 2fr' }, gap: '1rem' }}>
      <Field name={`${baseFieldName}.fieldName`}>
        {({ field }: FieldProps<string>) => (
          <TextField {...field} select variant="outlined" label={t('field_label')}>
            {registrationFilters.map((filter) => (
              <MenuItem key={filter.i18nKey} value={filter.field}>
                {t(filter.i18nKey)}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Field>
      <Field name={`${baseFieldName}.operator`}>
        {({ field }: FieldProps<string>) => (
          <TextField {...field} select variant="outlined" label={t('operator')}>
            <MenuItem value={ExpressionStatement.Contains}>{t('contains')}</MenuItem>
            <MenuItem value={ExpressionStatement.NotContaining}>{t('not_containing')}</MenuItem>
          </TextField>
        )}
      </Field>
      <Field name={`${baseFieldName}.value`}>
        {({ field }: FieldProps<string>) => <TextField {...field} variant="outlined" label={t('search_term_label')} />}
      </Field>
      <Button onClick={removeFilter} color="error">
        {t('remove_filter')}
      </Button>
    </Box>
  );
};
