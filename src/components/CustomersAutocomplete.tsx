import { Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchCustomers } from '../api/hooks/useFetchCustomers';

export const CustomersAutocomplete = () => {
  const { t } = useTranslation();

  const customersQuery = useFetchCustomers();
  const customers = customersQuery.data?.data.customers ?? [];

  return (
    <Autocomplete
      options={customers}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.displayName}
        </li>
      )}
      getOptionLabel={(option) => option.displayName}
      renderInput={(params) => <TextField {...params} variant="filled" required label={t('common.institution')} />}
    />
  );
};
