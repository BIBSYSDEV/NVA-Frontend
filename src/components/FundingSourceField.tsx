import { Autocomplete } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useFetchFundingSources } from '../api/hooks/useFetchFundingSources';
import { dataTestId } from '../utils/dataTestIds';
import { fundingSourceAutocompleteFilterOptions } from '../utils/searchHelpers';
import { getLanguageString } from '../utils/translation-helpers';
import { AutocompleteTextField } from './AutocompleteTextField';

interface FundingSourceFieldProps {
  fieldName: string;
}

export const FundingSourceField = ({ fieldName }: FundingSourceFieldProps) => {
  const { t } = useTranslation();

  const fundingSourcesQuery = useFetchFundingSources();
  const fundingSourcesList = fundingSourcesQuery.data?.sources ?? [];

  return (
    <Field name={fieldName}>
      {({ field, form: { setFieldValue }, meta: { touched, error } }: FieldProps<string>) => (
        <Autocomplete
          value={fundingSourcesList.find((source) => source.id === field.value) ?? null}
          options={fundingSourcesList}
          filterOptions={fundingSourceAutocompleteFilterOptions}
          renderOption={({ key, ...props }, option) => (
            <li {...props} key={option.identifier}>
              {getLanguageString(option.name)}
            </li>
          )}
          disabled={!fundingSourcesQuery.data || !!field.value}
          getOptionLabel={(option) => getLanguageString(option.name)}
          onChange={(_, value) => setFieldValue(field.name, value?.id)}
          renderInput={(params) => (
            <AutocompleteTextField
              {...params}
              data-testid={dataTestId.registrationWizard.description.fundingSourceSearchField}
              name={field.name}
              onBlur={field.onBlur}
              label={t('registration.description.funding.funder')}
              isLoading={fundingSourcesQuery.isPending}
              placeholder={t('select_funder')}
              multiline
              slotProps={{ inputLabel: { shrink: true } }}
              required
              errorMessage={touched && !!error ? error : undefined}
            />
          )}
        />
      )}
    </Field>
  );
};
