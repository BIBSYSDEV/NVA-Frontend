import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';
import { MaskInputProps } from './isbn_and_pages/IsbnField';

interface MaskExtentInputProps extends MaskInputProps {
  mask: string;
}

const MaskExtentInput = forwardRef<HTMLElement, MaskExtentInputProps>(({ onChange, ...props }, ref) => {
  return (
    <IMaskInput
      {...props}
      inputRef={ref}
      onAccept={(value) => {
        onChange({ target: { name: props.name, value: value } });
      }}
    />
  );
});
MaskExtentInput.displayName = 'MaskExtentInput';

interface ExtentFieldProps {
  fieldName: string;
  mask: string;
  dataTestId: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const ExtentField = ({
  fieldName,
  mask,
  dataTestId,
  placeholder = 'MM:SS',
  label,
  required = false,
}: ExtentFieldProps) => {
  const { t } = useTranslation();

  return (
    <Field name={fieldName}>
      {({ field, meta: { touched, error } }: FieldProps<string>) => (
        <>
          <TextField
            {...field}
            value={field.value ?? ''}
            sx={{ maxWidth: '15rem' }}
            placeholder={placeholder}
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
        </>
      )}
    </Field>
  );
};
