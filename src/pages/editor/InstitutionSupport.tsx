import LinkIcon from '@mui/icons-material/Link';
import { LoadingButton } from '@mui/lab';
import { InputAdornment, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import { PageSpinner } from '../../components/PageSpinner';
import { DocumentHeadTitle } from '../../context/DocumentHeadTitle';
import { setCustomer } from '../../redux/customerReducer';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { dataTestId } from '../../utils/dataTestIds';

export const InstitutionSupport = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customer = useSelector((store: RootState) => store.customer);

  const customerMutation = useMutation({
    mutationFn: (values: CustomerInstitution) => updateCustomerInstitution(values),
    onSuccess: (response) => {
      dispatch(setCustomer(response.data));
      dispatch(setNotification({ message: t('feedback.success.update_customer'), variant: 'success' }));
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_customer'), variant: 'error' })),
  });

  return (
    <>
      <DocumentHeadTitle>{t('editor.institution.institution_support')}</DocumentHeadTitle>

      {!customer ? (
        <PageSpinner />
      ) : (
        <Formik initialValues={customer} onSubmit={async (values) => customerMutation.mutateAsync(values)}>
          {({ isSubmitting }: FormikProps<CustomerInstitution>) => (
            <Form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography gutterBottom variant="h2">
                {t('editor.institution.institution_support')}
              </Typography>
              <Typography sx={{ mb: '1rem' }}>{t('editor.institution.institution_support_description')}</Typography>

              <Field name={'serviceCenter.uri'}>
                {({ field }: FieldProps<string>) => (
                  <TextField
                    data-testid={dataTestId.editor.institutionSupportInputField}
                    sx={{ mb: { xs: '1rem', md: 0 }, maxWidth: '40rem' }}
                    {...field}
                    disabled={isSubmitting}
                    type="url"
                    label={t('common.url')}
                    placeholder={t('editor.retention_strategy.rrs_link')}
                    variant="filled"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </Field>

              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
                sx={{ mt: 'auto', alignSelf: 'center' }}>
                {t('common.save')}
              </LoadingButton>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};
