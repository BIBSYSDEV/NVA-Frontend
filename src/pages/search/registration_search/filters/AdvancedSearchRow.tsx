import ClearIcon from '@mui/icons-material/Clear';
import { Box, IconButton, MenuItem, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { ParseKeys } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ResultParam } from '../../../../api/searchApi';
import { dataTestId } from '../../../../utils/dataTestIds';

interface FilterItem {
  field: string;
  i18nKey: ParseKeys;
}

const registrationFilters: FilterItem[] = [
  { field: ResultParam.Title, i18nKey: 'common.title' },
  { field: ResultParam.ContributorName, i18nKey: 'registration.contributors.contributor' },
  { field: ResultParam.Abstract, i18nKey: 'registration.description.abstract' },
  { field: ResultParam.Tags, i18nKey: 'registration.description.keywords' },
  { field: ResultParam.Isbn, i18nKey: 'registration.resource_type.isbn' },
  { field: ResultParam.Issn, i18nKey: 'registration.resource_type.issn' },
  { field: ResultParam.Doi, i18nKey: 'common.doi' },
  { field: ResultParam.Handle, i18nKey: 'registration.public_page.handle' },
  { field: ResultParam.FundingIdentifier, i18nKey: 'registration.description.funding.funding_id' },
  { field: ResultParam.Course, i18nKey: 'registration.resource_type.course_code' },
  { field: ResultParam.CristinIdentifier, i18nKey: 'registration.public_page.cristin_id' },
  { field: ResultParam.Identifier, i18nKey: 'registration.registration_id' },
];

interface AdvancedSearchRowProps {
  baseFieldName: string;
  removeFilter: () => void;
}

export const AdvancedSearchRow = ({ removeFilter, baseFieldName }: AdvancedSearchRowProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
      <Field name={`${baseFieldName}.fieldName`}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            sx={{ minWidth: '8rem' }}
            select
            variant="standard"
            size="small"
            label={t('search.field_label')}
            data-testid={dataTestId.startPage.advancedSearch.advancedFieldSelect}>
            {registrationFilters.map((filter) => (
              <MenuItem key={filter.i18nKey} value={filter.field}>
                {t(filter.i18nKey) as string}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Field>

      <Field name={`${baseFieldName}.value`}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            variant="standard"
            size="small"
            label={t('search.search_term_label')}
            data-testid={dataTestId.startPage.advancedSearch.advancedValueField}
            fullWidth
          />
        )}
      </Field>
      <IconButton
        sx={{ borderRadius: '4px', minWidth: '36px', minHeight: '36px' }}
        size="small"
        color="primary"
        onClick={removeFilter}
        title={t('common.remove')}
        data-testid={dataTestId.startPage.advancedSearch.removeFilterButton}>
        <ClearIcon />
      </IconButton>
    </Box>
  );
};
