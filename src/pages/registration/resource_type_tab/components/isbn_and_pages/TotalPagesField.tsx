import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationFormContext } from '../../../../../context/RegistrationFormContext';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../../utils/dataTestIds';

export const TotalPagesField = () => {
  const { t } = useTranslation();
  const { disableChannelClaimsFields } = useContext(RegistrationFormContext);

  return (
    <Field name={ResourceFieldNames.PagesPages}>
      {({ field, meta: { touched, error } }: FieldProps) => (
        <TextField
          data-testid={dataTestId.registrationWizard.resourceType.pagesField}
          disabled={disableChannelClaimsFields}
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
