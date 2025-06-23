import { BaseTextFieldProps, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';

interface MaskExtentInputProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  mask: string;
}

const MaskExtentInput = forwardRef<HTMLElement, MaskExtentInputProps>(({ onChange, ...props }, ref) => {
  return (
    <IMaskInput
      {...props}
      inputRef={ref}
      onAccept={(value) => {
        onChange({ target: { name: props.name, value } });
      }}
    />
  );
});
MaskExtentInput.displayName = 'MaskExtentInput';

interface ExtentFieldProps extends BaseTextFieldProps {
  fieldName: string;
  mask: string;
  dataTestId: string;
}

export const ExtentField = ({
  fieldName,
  mask,
  dataTestId,
  placeholder,
  label,
  required = false,
}: ExtentFieldProps) => {
  const { t } = useTranslation();

  return (
    <Field name={fieldName}>
      {({ field, meta: { touched, error } }: FieldProps<string>) => (
        <TextField
          {...field}
          value={field.value ?? ''}
          sx={{ maxWidth: '15rem' }}
          placeholder={placeholder ?? t('time_format.minutes')}
          variant="filled"
          required={required}
          fullWidth
          label={label ?? t('registration.resource_type.artistic.extent_in_minutes')}
          error={touched && !!error}
          helperText={<ErrorMessage name={field.name} />}
          data-testid={dataTestId}
          slotProps={{
            input: {
              inputComponent: MaskExtentInput as any,
              inputProps: {
                mask,
              },
            },
          }}
        />
      )}
    </Field>
  );
};
