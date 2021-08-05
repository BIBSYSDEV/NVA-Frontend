import React from 'react';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { useFetchInstitutions } from '../../../utils/hooks/useFetchInstitutions';
import { CustomerInstitutionFieldNames } from '../../../types/customerInstitution.types';
import { InstitutionAutocomplete } from '../../../components/institution/InstitutionAutocomplete';

interface SelectInstitutionFieldProps {
  disabled?: boolean;
}

export const SelectInstitutionField = ({ disabled = false }: SelectInstitutionFieldProps) => {
  const [institutions, isLoadingInstitutions] = useFetchInstitutions();

  return (
    <Field name={CustomerInstitutionFieldNames.Name}>
      {({ field: { name }, form: { values, setValues }, meta: { touched, error } }: FieldProps<string>) => (
        <InstitutionAutocomplete
          id={name}
          disabled={disabled}
          required
          error={touched && !!error}
          helperText={<ErrorMessage name={name} />}
          institutions={institutions}
          isLoading={!disabled && isLoadingInstitutions}
          onChange={(selectedInstitution) => {
            setValues({
              ...values,
              name: selectedInstitution?.name ?? '',
              [CustomerInstitutionFieldNames.DisplayName]: selectedInstitution?.name ?? '',
              [CustomerInstitutionFieldNames.ShortName]: selectedInstitution?.acronym ?? '',
              [CustomerInstitutionFieldNames.CristinId]: selectedInstitution?.id ?? '',
            });
          }}
          value={institutions.find((i) => i.id === values.cristinId) ?? null}
        />
      )}
    </Field>
  );
};
