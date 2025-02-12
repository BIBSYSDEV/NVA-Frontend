import { Autocomplete } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useFetchFundingSources } from '../api/hooks/useFetchFundingSources';
import { dataTestId } from '../utils/dataTestIds';
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
          filterOptions={(options, state) => {
            const filter = state.inputValue.toLocaleLowerCase();
            return options.filter((option) => {
              const names = Object.values(option.name).map((name) => name.toLocaleLowerCase());
              const identifier = option.identifier.toLocaleLowerCase();
              return identifier.includes(filter) || names.some((name) => name.includes(filter));
            });
          }}
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
              data-testid={dataTestId.registrationWizard.description.fundingSourceSearchField}
              name={field.name}
              onBlur={field.onBlur}
              {...params}
              label={t('registration.description.funding.funder')}
              isLoading={fundingSourcesQuery.isPending}
              placeholder={t('common.search')}
              showSearchIcon={!field.value}
              multiline
              required
              errorMessage={touched && !!error ? error : undefined}
            />
          )}
        />
      )}
    </Field>
  );
};
