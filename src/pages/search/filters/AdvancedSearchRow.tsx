import { Box, MenuItem, Button, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  DescriptionFieldNames,
  ResourceFieldNames,
  ContributorFieldNames,
  SpecificContributorFieldNames,
} from '../../../types/publicationFieldNames';
import { ExpressionStatement } from '../../../utils/searchHelpers';

const StyledTextField = styled(TextField)`
  margin-top: 0;
`;

interface AdvancedSearchRowProps {
  baseFieldName: string;
  removeFilter: () => void;
}

export const AdvancedSearchRow = ({ removeFilter, baseFieldName }: AdvancedSearchRowProps) => {
  const { t } = useTranslation('search');

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 3fr 6fr 2fr', gap: '1rem' }}>
      <Field name={`${baseFieldName}.fieldName`}>
        {({ field }: FieldProps<string>) => (
          <StyledTextField {...field} select variant="outlined" label={t('field_label')}>
            <MenuItem value={DescriptionFieldNames.Title}>{t('common:title')}</MenuItem>
            <MenuItem value={DescriptionFieldNames.Abstract}>{t('registration:description.abstract')}</MenuItem>
            <MenuItem value={ResourceFieldNames.SubType}>{t('registration_type')}</MenuItem>
            <MenuItem value={DescriptionFieldNames.Tags}>{t('registration:description.keywords')}</MenuItem>
            <MenuItem value={`${ContributorFieldNames.Contributors}.${SpecificContributorFieldNames.Name}`}>
              {t('registration:contributors.contributor')}
            </MenuItem>
            <MenuItem value={`${DescriptionFieldNames.Date}.year`}>{t('year_published')}</MenuItem>
          </StyledTextField>
        )}
      </Field>
      <Field name={`${baseFieldName}.operator`}>
        {({ field }: FieldProps<string>) => (
          <StyledTextField {...field} select variant="outlined" label={t('operator')}>
            <MenuItem value={ExpressionStatement.Contains}>{t('contains')}</MenuItem>
            <MenuItem value={ExpressionStatement.NotContaining}>{t('not_containing')}</MenuItem>
          </StyledTextField>
        )}
      </Field>
      <Field name={`${baseFieldName}.value`}>
        {({ field }: FieldProps<string>) => (
          <StyledTextField {...field} variant="outlined" label={t('search_term_label')} />
        )}
      </Field>
      <Button onClick={removeFilter} color="error">
        {t('remove_filter')}
      </Button>
    </Box>
  );
};
