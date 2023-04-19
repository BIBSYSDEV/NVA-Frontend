import { Autocomplete } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { dataTestId } from '../utils/dataTestIds';
import { getLanguageString } from '../utils/translation-helpers';
import { AutocompleteTextField } from './AutocompleteTextField';
import { fetchFundingSources } from '../api/cristinApi';
import { setNotification } from '../redux/notificationSlice';

interface FundingSourceFieldProps {
  fieldName: string;
}

export const FundingSourceField = ({ fieldName }: FundingSourceFieldProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const fundingSourcesQuery = useQuery({
    queryKey: ['fundingSources'],
    queryFn: fetchFundingSources,
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_funding_sources'), variant: 'error' })),
  });
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
          renderOption={(props, option) => (
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
              isLoading={fundingSourcesQuery.isLoading}
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
