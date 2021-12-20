import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { Autocomplete, TextField } from '@mui/material';
import {
  CustomerInstitution,
  CustomerInstitutionFieldNames,
  emptyCustomerInstitution,
} from '../../../types/customerInstitution.types';
import { InstitutionApiPath } from '../../../api/apiPaths';
import { OrganizationsResponse } from '../../../types/institution.types';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useFetch } from '../../../utils/hooks/useFetch';
import { getLanguageString } from '../../../utils/translation-helpers';
import { dataTestId } from '../../../utils/dataTestIds';

interface SelectInstitutionFieldProps {
  disabled?: boolean;
}

export const SelectInstitutionField = ({ disabled = false }: SelectInstitutionFieldProps) => {
  const { t } = useTranslation('feedback');
  const { values, setValues } = useFormikContext<CustomerInstitution>();
  const [searchTerm, setSearchTerm] = useState(values.name);
  const debouncedQuery = useDebounce(searchTerm);
  const [institutions, isLoadingInstitutions] = useFetch<OrganizationsResponse>({
    url: debouncedQuery ? `${InstitutionApiPath.Organization}?query=${debouncedQuery}&results=20` : '',
    errorMessage: t('error.get_institutions'),
  });

  const options = isLoadingInstitutions ? [] : institutions?.hits.filter((institution) => !institution.partOf) ?? [];

  return (
    <Field name={CustomerInstitutionFieldNames.Name}>
      {({ field, meta: { touched, error } }: FieldProps<string>) => (
        <Autocomplete
          options={options}
          disabled={disabled}
          inputValue={values.name ? values.name : searchTerm}
          getOptionLabel={(option) => getLanguageString(option.name)}
          filterOptions={(options) => options}
          onInputChange={(_, value, reason) => {
            if (reason !== 'reset') {
              setSearchTerm(value);
            }
          }}
          onChange={(_, selectedInstitution) => {
            const name = selectedInstitution?.name ? getLanguageString(selectedInstitution.name) : '';
            setValues({
              ...emptyCustomerInstitution,
              name,
              [CustomerInstitutionFieldNames.DisplayName]: name,
              [CustomerInstitutionFieldNames.CristinId]: selectedInstitution?.id ?? '',
            });
            setSearchTerm('');
          }}
          loading={isLoadingInstitutions}
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              data-testid={dataTestId.institutionAdmin.nameField}
              label={t('common:institution')}
              required
              variant="outlined"
              fullWidth
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        />
      )}
    </Field>
  );
};
