import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchCustomers } from '../api/hooks/useFetchCustomers';
import { SimpleCustomerInstitution } from '../types/customerInstitution.types';
import { sortCustomerInstitutions } from '../utils/institutions-helpers';

export const CustomersAutocomplete = (
  props: Pick<AutocompleteProps<SimpleCustomerInstitution, false, false, false>, 'disabled' | 'onChange'>
) => {
  const { t } = useTranslation();

  const customersQuery = useFetchCustomers();
  const customers = sortCustomerInstitutions(customersQuery.data?.customers ?? []);

  return (
    <Autocomplete
      options={customers}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.displayName}
        </li>
      )}
      loading={customersQuery.isPending}
      getOptionLabel={(option) => option.displayName}
      renderInput={(params) => <TextField {...params} variant="filled" required label={t('common.institution')} />}
      {...props}
    />
  );
};
