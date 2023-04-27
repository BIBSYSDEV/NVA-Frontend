import { Box, MenuItem, Button, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { TFuncKey } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  DescriptionFieldNames,
  ResourceFieldNames,
  ContributorFieldNames,
  SpecificContributorFieldNames,
  SearchFieldName,
} from '../../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../../types/registration.types';
import { ExpressionStatement, PropertySearch } from '../../../../utils/searchHelpers';

interface FilterItem {
  field: string;
  i18nKey: TFuncKey;
  manuallyAddable: boolean;
}

export const registrationFilters: FilterItem[] = [
  { field: DescriptionFieldNames.Title, i18nKey: 'common.title', manuallyAddable: true },
  { field: DescriptionFieldNames.Abstract, i18nKey: 'registration.description.abstract', manuallyAddable: true },
  {
    field: ResourceFieldNames.RegistrationType,
    i18nKey: 'registration.resource_type.resource_type',
    manuallyAddable: false,
  },
  { field: DescriptionFieldNames.Tags, i18nKey: 'registration.description.keywords', manuallyAddable: true },
  {
    field: `${ContributorFieldNames.Contributors}.${SpecificContributorFieldNames.Name}`,
    i18nKey: 'registration.contributors.contributor',
    manuallyAddable: true,
  },
  {
    field: `${DescriptionFieldNames.PublicationDate}.year`,
    i18nKey: 'registration.year_published',
    manuallyAddable: true,
  },
  { field: SearchFieldName.TopLevelOrganizationId, i18nKey: 'common.institution', manuallyAddable: false },
];

interface AdvancedSearchRowProps {
  baseFieldName: string;
  removeFilter: () => void;
  propertySearchItem: PropertySearch;
}

export const AdvancedSearchRow = ({ removeFilter, baseFieldName, propertySearchItem }: AdvancedSearchRowProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '3fr 3fr 5fr 2fr' }, gap: '1rem' }}>
      <Field name={`${baseFieldName}.fieldName`}>
        {({ field }: FieldProps<string>) => (
          <TextField {...field} select variant="outlined" label={t('search.field_label')}>
            {registrationFilters
              .filter((filter) => filter.manuallyAddable)
              .map((filter) => (
                <MenuItem key={filter.i18nKey} value={filter.field}>
                  {t<any>(filter.i18nKey)}
                </MenuItem>
              ))}
          </TextField>
        )}
      </Field>
      <Field name={`${baseFieldName}.operator`}>
        {({ field }: FieldProps<string>) => (
          <TextField {...field} select variant="outlined" label={t('search.operator')}>
            <MenuItem value={ExpressionStatement.Contains}>{t('search.contains')}</MenuItem>
            <MenuItem value={ExpressionStatement.NotContaining}>{t('search.not_containing')}</MenuItem>
          </TextField>
        )}
      </Field>
      <Field name={`${baseFieldName}.value`}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            value={
              propertySearchItem.value && propertySearchItem.fieldName === ResourceFieldNames.RegistrationType
                ? t(`registration.publication_types.${propertySearchItem.value as PublicationInstanceType}`)
                : field.value
            }
            variant="outlined"
            label={t('search.search_term_label')}
          />
        )}
      </Field>
      <Button onClick={removeFilter} color="error">
        {t('search.remove_filter')}
      </Button>
    </Box>
  );
};
