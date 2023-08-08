import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CustomerInstitutionFieldNames,
  CustomerInstitutionFormData,
  ProtectedDoiAgent,
} from '../../../types/customerInstitution.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useFetch } from '../../../utils/hooks/useFetch';

interface CustomerDoiPasswordFieldProps {
  doiAgentId: string;
}

export const CustomerDoiPasswordField = ({ doiAgentId }: CustomerDoiPasswordFieldProps) => {
  const { t } = useTranslation();
  const { setFieldValue, values } = useFormikContext<CustomerInstitutionFormData>();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [doiAgent, isLoadingDoiAgent] = useFetch<ProtectedDoiAgent>({
    url: showPasswordInput ? doiAgentId : '',
    withAuthentication: true,
    errorMessage: t('feedback.error.get_doi_agent'),
  });

  useEffect(() => {
    // Ensure value is set only one time (when values.doiAgent.password is empty)
    if (values.doiAgent.password === undefined && doiAgent?.password) {
      setFieldValue(CustomerInstitutionFieldNames.DoiPassword, doiAgent.password);
    }
  }, [setFieldValue, values.doiAgent.password, doiAgent?.password]);

  return (
    <>
      {!showPasswordInput || !doiAgent ? (
        <LoadingButton
          sx={{ height: 'fit-content', minWidth: '7rem', alignSelf: 'center' }}
          variant="outlined"
          loading={isLoadingDoiAgent}
          onClick={() => setShowPasswordInput(true)}>
          {t('basic_data.institutions.doi_password')}
        </LoadingButton>
      ) : (
        <Field
          name={CustomerInstitutionFieldNames.DoiPassword}
          validate={(value: string) =>
            value
              ? undefined
              : t('feedback.validation.is_required', {
                  field: t('basic_data.institutions.doi_password'),
                })
          }>
          {({ field, meta: { touched, error } }: FieldProps<string>) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              data-testid={dataTestId.basicData.institutionAdmin.doiPasswordField}
              label={t('basic_data.institutions.doi_password')}
              required
              fullWidth
              type={showPassword ? 'text' : 'password'}
              variant="filled"
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
              InputProps={{
                endAdornment: (
                  <Tooltip
                    title={
                      showPassword
                        ? t('basic_data.institutions.password_hide')
                        : t('basic_data.institutions.password_show')
                    }>
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
          )}
        </Field>
      )}
    </>
  );
};
