import { TextField, MenuItem } from '@material-ui/core';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { StyledSelectWrapper } from '../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../utils/dataTestIds';

interface ContentTypeFieldProps {
  options: string[];
  extendedOnChange?: (value: string) => void;
}

export const ContentTypeField = ({ options, extendedOnChange }: ContentTypeFieldProps) => {
  const { t } = useTranslation('registration');

  return (
    <Field name={ResourceFieldNames.CONTENT}>
      {({ field, meta: { error, touched } }: FieldProps) => (
        <StyledSelectWrapper>
          <TextField
            {...field}
            id={field.name}
            data-testid={dataTestId.registrationWizard.resourceType.contentField}
            select
            variant="filled"
            onChange={(event) => {
              field.onChange(event);
              extendedOnChange?.(event.target.value);
            }}
            label={t('resource_type.content')}
            fullWidth
            required
            error={!!error && touched}
            helperText={<ErrorMessage name={field.name} />}>
            {options.map((option) => (
              <MenuItem value={option} key={option}>
                {t(`resource_type.content_types.${option}`)}
              </MenuItem>
            ))}
          </TextField>
        </StyledSelectWrapper>
      )}
    </Field>
  );
};
