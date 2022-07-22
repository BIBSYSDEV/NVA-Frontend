import { ErrorMessage, Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../../utils/dataTestIds';

export const TotalPagesField = () => {
  const { t } = useTranslation();

  return (
    <Field name={ResourceFieldNames.PagesPages}>
      {({ field, meta: { touched, error } }: FieldProps) => (
        <TextField
          id={field.name}
          data-testid={dataTestId.registrationWizard.resourceType.pagesField}
          variant="filled"
          label={t('registration.resource_type.number_of_pages')}
          {...field}
          value={field.value ?? ''}
          error={touched && !!error}
          helperText={<ErrorMessage name={field.name} />}
          sx={{ width: 'fit-content' }}
        />
      )}
    </Field>
  );
};
