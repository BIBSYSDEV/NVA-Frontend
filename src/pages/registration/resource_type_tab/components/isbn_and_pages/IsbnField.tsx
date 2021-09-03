import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps } from 'formik';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { IMaskInput } from 'react-imask';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../../utils/dataTestIds';

const isbnFormat = '000-0-00-000000-0';

interface MaskIsbnInputProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

// MUI Mask demo: https://material-ui.com/components/text-fields/#integration-with-3rd-party-input-libraries
const MaskIsbnInput = forwardRef<HTMLElement, MaskIsbnInputProps>((props, ref) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={isbnFormat}
      onAccept={(value) => onChange({ target: { name: other.name, value: value.replaceAll('-', '') } })}
    />
  );
});

export const IsbnField = () => {
  const { t } = useTranslation('registration');

  return (
    <FieldArray name={ResourceFieldNames.IsbnList}>
      {({ remove }: FieldArrayRenderProps) => (
        <Field name={ResourceFieldNames.Isbn}>
          {/* Support just a single ISBN entry for now */}
          {({ field, meta }: FieldProps<string>) => (
            <TextField
              {...field}
              data-testid={dataTestId.registrationWizard.resourceType.isbnField}
              onChange={(event) => {
                if (event.target.value) {
                  field.onChange(event);
                } else {
                  remove(0);
                }
              }}
              label={t('resource_type.isbn')}
              placeholder={isbnFormat}
              variant="filled"
              InputProps={{
                inputComponent: MaskIsbnInput as any,
              }}
              error={!!meta.error && meta.touched}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      )}
    </FieldArray>
  );
};
