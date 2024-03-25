import { TextField, TextFieldProps } from '@mui/material';
import { ErrorMessage, Field, FieldInputProps, FieldProps } from 'formik';

interface CustomerInstitutionTextFieldProps
  extends Pick<FieldInputProps<string>, 'name'>,
    Pick<TextFieldProps, 'label' | 'required' | 'disabled'> {
  dataTestId?: string;
}

export const CustomerInstitutionTextField = ({
  name,
  label,
  dataTestId,
  required,
  disabled,
}: CustomerInstitutionTextFieldProps) => (
  <Field name={name}>
    {({ field, meta: { touched, error } }: FieldProps) => (
      <TextField
        {...field}
        data-testid={dataTestId}
        id={dataTestId}
        label={label}
        fullWidth
        required={required}
        disabled={disabled}
        value={field.value ?? ''}
        variant="filled"
        error={touched && !!error}
        helperText={<ErrorMessage name={field.name} />}
      />
    )}
  </Field>
);
