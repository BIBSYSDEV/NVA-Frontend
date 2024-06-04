import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
import { Button, DialogActions, DialogContent, IconButton, TextField, Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchDoiAgent } from '../../../api/customerInstitutionsApi';
import { Modal } from '../../../components/Modal';
import { CustomerInstitutionFieldNames, CustomerInstitutionFormData } from '../../../types/customerInstitution.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface CustomerDoiPasswordFieldProps {
  doiAgentId: string;
  disabled: boolean;
}

export const CustomerDoiPasswordField = ({ doiAgentId, disabled }: CustomerDoiPasswordFieldProps) => {
  const { t } = useTranslation();
  const { setFieldValue, values, initialValues } = useFormikContext<CustomerInstitutionFormData>();
  const [showPasswordInputModal, setShowPasswordInputModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const doiAgentQuery = useQuery({
    queryKey: ['doiAgentId', doiAgentId],
    enabled: showPasswordInputModal,
    queryFn: () => fetchDoiAgent(doiAgentId),
    meta: { errorMessage: t('feedback.error.get_doi_agent') },
  });

  const doiAgent = doiAgentQuery.data?.data;

  useEffect(() => {
    // Ensure value is set only one time (when values.doiAgent.password is empty)
    if (values.doiAgent.password === undefined && doiAgent?.password) {
      setFieldValue(CustomerInstitutionFieldNames.DoiPassword, doiAgent.password);
    }
  }, [setFieldValue, values.doiAgent.password, doiAgent?.password]);

  const cancelPasswordChange = () => {
    setFieldValue(CustomerInstitutionFieldNames.DoiPassword, initialValues.doiAgent.password);
    setShowPasswordInputModal(false);
  };

  return (
    <>
      <LoadingButton
        disabled={disabled}
        sx={{ height: 'fit-content', minWidth: '7rem', alignSelf: 'center' }}
        variant="outlined"
        loading={doiAgentQuery.isPending && showPasswordInputModal}
        onClick={() => setShowPasswordInputModal(true)}>
        {t('basic_data.institutions.doi_password')}
      </LoadingButton>

      <Modal
        title={t('basic_data.institutions.doi_password')}
        open={showPasswordInputModal}
        onClose={cancelPasswordChange}>
        <DialogContent>
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
                disabled={disabled}
                required={!disabled}
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
        </DialogContent>
        <DialogActions>
          <Button data-testid={dataTestId.common.cancel} onClick={cancelPasswordChange}>
            {t('common.cancel')}
          </Button>
          <Button
            data-testid={dataTestId.common.save}
            onClick={() => setShowPasswordInputModal(false)}
            variant="outlined">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Modal>
    </>
  );
};
