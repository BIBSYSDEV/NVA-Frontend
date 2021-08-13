import { ErrorMessage, Field, FieldProps } from 'formik';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { IMaskInput } from 'react-imask';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../utils/dataTestIds';

const isbnFormat = '000-0-00-000000-0';

interface MaskIsbnTextProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

// MUI Mask demo: https://material-ui.com/components/text-fields/#integration-with-3rd-party-input-libraries
const MaskIsbnText = forwardRef<HTMLElement, MaskIsbnTextProps>((props, ref) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={isbnFormat}
      onAccept={(value) => onChange({ target: { name: other.name, value: value.replaceAll('-', '') } })}
      overwrite
    />
  );
});

export const IsbnField = () => {
  const { t } = useTranslation('registration');

  return (
    <Field name={ResourceFieldNames.Isbn}>
      {/* Support just a single ISBN entry for now */}
      {({ field, meta }: FieldProps<string>) => (
        <TextField
          data-testid={dataTestId.registrationWizard.resourceType.isbnField}
          {...field}
          label={t('resource_type.isbn')}
          placeholder={isbnFormat}
          variant="filled"
          InputProps={{
            inputComponent: MaskIsbnText as any,
          }}
          error={!!meta.error && meta.touched}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
  );
};
