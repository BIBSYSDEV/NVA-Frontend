import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps } from 'formik';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';
import { dataTestId } from '../../../../../utils/dataTestIds';

const isbnFormat = '000-00-000-0000-0';

export interface MaskInputProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

// MUI Mask demo: https://material-ui.com/components/text-fields/#integration-with-3rd-party-input-libraries
const MaskIsbnInput = forwardRef<HTMLElement, MaskInputProps>((props, ref) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={isbnFormat}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: other.name, value: value.replaceAll('-', '') } })}
    />
  );
});
MaskIsbnInput.displayName = 'MaskIsbnInput';

interface IsbnFieldProps {
  fieldName: string;
}

export const IsbnField = ({ fieldName }: IsbnFieldProps) => {
  const { t } = useTranslation();

  return (
    <FieldArray name={fieldName}>
      {({ remove }: FieldArrayRenderProps) => (
        <Field name={`${fieldName}[0]`}>
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
              value={field.value ?? ''}
              label={t('registration.resource_type.isbn')}
              placeholder={isbnFormat}
              variant="filled"
              error={!!meta.error && meta.touched}
              helperText={<ErrorMessage name={field.name} />}
              slotProps={{ input: { inputComponent: MaskIsbnInput as any } }}
            />
          )}
        </Field>
      )}
    </FieldArray>
  );
};
