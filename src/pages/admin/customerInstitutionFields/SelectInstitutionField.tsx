import React from 'react';
import { Field, FieldProps, ErrorMessage } from 'formik';
import useFetchInstitutions from '../../../utils/hooks/useFetchInstitutions';
import { CustomerInstitutionFieldNames } from '../../../types/customerInstitution.types';
import InstitutionAutocomplete from '../../../components/institution/InstitutionAutocomplete';

interface SelectInstitutionFieldProps {
  disabled?: boolean;
}

export const SelectInstitutionField = ({ disabled = false }: SelectInstitutionFieldProps) => {
  const [institutions, isLoadingInstitutions] = useFetchInstitutions();

  return (
    <Field name={CustomerInstitutionFieldNames.NAME}>
      {({ field: { name }, form: { values, setValues }, meta: { touched, error } }: FieldProps<string>) => (
        <InstitutionAutocomplete
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
              [CustomerInstitutionFieldNames.DISPLAY_NAME]: selectedInstitution?.name ?? '',
              [CustomerInstitutionFieldNames.SHORT_NAME]: selectedInstitution?.acronym ?? '',
              [CustomerInstitutionFieldNames.CRISTIN_ID]: selectedInstitution?.id ?? '',
            });
          }}
          value={institutions.find((i) => i.id === values.cristinId) ?? null}
        />
      )}
    </Field>
  );
};
