import React, { FC } from 'react';
import { Field, FieldProps, ErrorMessage, FieldInputProps } from 'formik';
import { TextField, TextFieldProps } from '@material-ui/core';

interface CustomerInstitutionTextFieldProps
  extends Pick<FieldInputProps<string>, 'name'>,
    Pick<TextFieldProps, 'label'> {
  dataTestId?: string;
}

const CustomerInstitutionTextField: FC<CustomerInstitutionTextFieldProps> = ({ name, label, dataTestId }) => {
  return (
    <Field name={name}>
      {({ field, meta: { touched, error } }: FieldProps) => (
        <TextField
          {...field}
          label={label}
          fullWidth
          variant="outlined"
          inputProps={{ 'data-testid': dataTestId }}
          error={touched && !!error}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
  );
};

export default CustomerInstitutionTextField;
