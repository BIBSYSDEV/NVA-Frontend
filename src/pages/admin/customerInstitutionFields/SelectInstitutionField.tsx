import React, { FC } from 'react';
import { Field, FieldProps, ErrorMessage } from 'formik';
import useFetchInstitutions from '../../../utils/hooks/useFetchInstitutions';
import { CustomerInstitutionFieldNames } from '../../../types/customerInstitution.types';
import InstitutionAutocomplete from '../../../components/institution/InstitutionAutocomplete';

interface SelectInstitutionFieldProps {
  disabled?: boolean;
}

const SelectInstitutionField: FC<SelectInstitutionFieldProps> = ({ disabled = false }) => {
  const [institutions, isLoadingInstitutions] = useFetchInstitutions();

  return (
    <Field name={CustomerInstitutionFieldNames.NAME}>
      {({ field: { name, value }, form: { values, setValues }, meta: { touched, error } }: FieldProps) => (
        <InstitutionAutocomplete
          disabled={disabled}
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
          value={institutions.find((i) => i.name === value) ?? null}
        />
      )}
    </Field>
  );
};

export default SelectInstitutionField;
