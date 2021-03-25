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
        label={label}
        required={required}
        fullWidth
        variant="filled"
        inputProps={{ 'data-testid': dataTestId }}
        error={touched && !!error}
        helperText={<ErrorMessage name={field.name} />}
      />
    )}
  </Field>
);
