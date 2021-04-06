import React from 'react';
import { Field, FieldProps, ErrorMessage, FieldInputProps } from 'formik';
import { TextField, TextFieldProps } from '@material-ui/core';

interface CustomerInstitutionTextFieldProps
  extends Pick<FieldInputProps<string>, 'name'>,
    Pick<TextFieldProps, 'label' | 'required'> {
  dataTestId?: string;
}

export const CustomerInstitutionTextField = ({
  name,
  label,
  dataTestId,
  required,
}: CustomerInstitutionTextFieldProps) => (
  <Field name={name}>
    {({ field, meta: { touched, error } }: FieldProps) => (
      <TextField
        {...field}
        data-testid={dataTestId}
        label={label}
        required={required}
        fullWidth
        variant="filled"
        error={touched && !!error}
        helperText={<ErrorMessage name={field.name} />}
      />
    )}
  </Field>
);
