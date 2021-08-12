import { ErrorMessage, Field, FieldProps } from 'formik';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { IMaskInput } from 'react-imask';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextMaskCustom = forwardRef<HTMLElement, CustomProps>(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="000-0-00-000000-0"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: other.name, value: value.replaceAll('-', '') } })}
      overwrite
    />
  );
});

export const IsbnField = () => {
  const { t } = useTranslation('registration');

  return (
    <Field name={`${ResourceFieldNames.IsbnList}[0]`}>
      {/* Support just a single ISBN entry for now */}
      {({ field, meta: { touched, error } }: FieldProps<string>) => (
        <TextField
          {...field}
          label={t('resource_type.isbn')}
          variant="filled"
          InputProps={{
            inputComponent: TextMaskCustom as any,
          }}
          error={!!error && touched}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
  );
};
