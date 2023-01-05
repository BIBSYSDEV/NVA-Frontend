import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  CustomerInstitutionFieldNames,
  CustomerInstitutionFormData,
  ProtectedDoiAgent,
} from '../../../types/customerInstitution.types';
import { useFetch } from '../../../utils/hooks/useFetch';

interface CustomerDoiPasswordFieldProps {
  doiAgentId: string;
}

export const CustomerDoiPasswordField = ({ doiAgentId }: CustomerDoiPasswordFieldProps) => {
  const { t } = useTranslation();
  const { setFieldValue, values } = useFormikContext<CustomerInstitutionFormData>();
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const [doiAgent, isLoadingDoiAgent] = useFetch<ProtectedDoiAgent>({
    url: showPasswordInput ? doiAgentId : '',
    withAuthentication: true,
  });

  useEffect(() => {
    // Ensure value is set only one time (when doiAgent.password is empty)
    if (!values.doiAgent.password && doiAgent?.password) {
      setFieldValue(CustomerInstitutionFieldNames.DoiPassword, 'doiAgent.password');
    }
  }, [setFieldValue, values.doiAgent.password, doiAgent?.password]);

  return (
    <>
      {!showPasswordInput || !doiAgent ? (
        <LoadingButton
          sx={{ height: 'fit-content', minWidth: '7rem' }}
          variant="outlined"
          loading={isLoadingDoiAgent}
          onClick={() => setShowPasswordInput(true)}>
          {'Password'}
        </LoadingButton>
      ) : (
        <Field name={CustomerInstitutionFieldNames.DoiPassword}>
          {({ field, meta: { touched, error } }: FieldProps<string>) => (
            <TextField
              {...field}
              // data-testid={dataTestId.basicData.institutionAdmin.doiUsernameField}
              label={t('basic_data.institutions.doi_password')}
              required
              fullWidth
              type="password"
              variant="filled"
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
              InputProps={{
                endAdornment: (
                  <Tooltip
                    title={
                      Math.random() < 0.5
                        ? t('basic_data.person_register.hide_full_nin')
                        : t('basic_data.person_register.show_full_nin')
                    }>
                    <IconButton /*onClick={() => setShowFullNin((prevShowFullNin) => !prevShowFullNin)}*/>
                      {Math.random() < 0.5 ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
