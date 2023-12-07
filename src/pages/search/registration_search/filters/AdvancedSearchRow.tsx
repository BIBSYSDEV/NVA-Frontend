import { Box, Button, MenuItem, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { TFuncKey } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { ExpressionStatement, PropertySearch } from '../../../../utils/searchHelpers';

interface FilterItem {
  field: string;
  i18nKey: TFuncKey;
  manuallyAddable: boolean;
}

export const registrationFilters: FilterItem[] = [
  { field: 'title', i18nKey: 'common.title', manuallyAddable: true },
  // { field: DescriptionFieldNames.Abstract, i18nKey: 'registration.description.abstract', manuallyAddable: true },
  // {
  //   field: ResourceFieldNames.RegistrationType,
  //   i18nKey: 'registration.resource_type.resource_type',
  //   manuallyAddable: false,
  // },
  // { field: DescriptionFieldNames.Tags, i18nKey: 'registration.description.keywords', manuallyAddable: true },
  {
    field: 'contributorName',
    i18nKey: 'registration.contributors.contributor',
    manuallyAddable: true,
  },
  // {
  //   field: SearchFieldName.ContributorId,
  //   i18nKey: 'registration.contributors.contributor',
  //   manuallyAddable: false,
  // },
  // {
  //   field: `${DescriptionFieldNames.PublicationDate}.year`,
  //   i18nKey: 'registration.year_published',
  //   manuallyAddable: true,
  // },
  // { field: SearchFieldName.TopLevelOrganizationId, i18nKey: 'common.institution', manuallyAddable: false },
  // {
  //   field: SearchFieldName.FundingSource,
  //   i18nKey: 'common.funding',
  //   manuallyAddable: false,
  // },
];

interface AdvancedSearchRowProps {
  baseFieldName: string;
  removeFilter: () => void;
  propertySearchItem: PropertySearch;
}

export const AdvancedSearchRow = ({ removeFilter, baseFieldName, propertySearchItem }: AdvancedSearchRowProps) => {
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
          <TextField
            {...field}
            select
            disabled
            label={t('search.operator')}
            data-testid={dataTestId.startPage.advancedSearch.advancedOperatorSelect}>
            <MenuItem value={ExpressionStatement.Contains}>{t('search.contains')}</MenuItem>
            {/* <MenuItem value={ExpressionStatement.NotContaining}>{t('search.not_containing')}</MenuItem> */}
          </TextField>
        )}
      </Field>
      <Field name={`${baseFieldName}.value`}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            data-testid={dataTestId.startPage.advancedSearch.advancedValueField}
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
      <Button onClick={removeFilter} size="small" data-testid={dataTestId.startPage.advancedSearch.removeFilterButton}>
        {t('search.remove_filter')}
      </Button>
    </Box>
  );
};
