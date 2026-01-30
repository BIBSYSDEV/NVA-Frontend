import LinkIcon from '@mui/icons-material/Link';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import { setCustomer } from '../../redux/customerReducer';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { CustomerInstitution, CustomerRrsType } from '../../types/customerInstitution.types';
import { dataTestId } from '../../utils/dataTestIds';

export const RrsAndFileImportSettings = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);

  const updateCustomer = useMutation({
    mutationFn: (customer: CustomerInstitution) => updateCustomerInstitution(customer),
    onSuccess: (response) => {
      dispatch(setCustomer(response.data));
      dispatch(setNotification({ message: t('feedback.success.update_rrs_and_file_import'), variant: 'success' }));
    },
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.update_rrs_and_file_import'), variant: 'error' })),
  });

  return (
    <>
      <Divider sx={{ my: '2.5rem' }} />

      <Typography variant="h2">{t('editor.retention_strategy.rrs')}</Typography>

      {customer && (
        <Formik
          enableReinitialize
          initialValues={customer}
          onSubmit={async (values) => await updateCustomer.mutateAsync(values)}>
          {({ values, isSubmitting, setFieldValue }: FormikProps<CustomerInstitution>) => {
            const isRrs = values.rightsRetentionStrategy?.type === CustomerRrsType.RightsRetentionStrategy;
            const isOverridableRrs =
              values.rightsRetentionStrategy?.type === CustomerRrsType.OverridableRightsRetentionStrategy;
            const isNullRrs = values.rightsRetentionStrategy?.type === CustomerRrsType.NullRightsRetentionStrategy;

            return (
              <Box component={Form} sx={{ maxWidth: '35rem' }}>
                <Field name={'rightsRetentionStrategy.type'}>
                  {({ field }: FieldProps<CustomerRrsType>) => (
                    <FormControlLabel
                      label={t('editor.retention_strategy.rights_retention_strategy')}
                      control={
                        <Checkbox
                          data-testid={dataTestId.editor.rrs}
                          {...field}
                          disabled={isSubmitting}
                          checked={isRrs || isOverridableRrs}
                          value={values.rightsRetentionStrategy?.type}
                          onChange={() => {
                            setFieldValue(
                              field.name,
                              isRrs || isOverridableRrs
                                ? CustomerRrsType.NullRightsRetentionStrategy
                                : CustomerRrsType.RightsRetentionStrategy
                            );
                            setFieldValue('rightsRetentionStrategy.id', '');
                          }}
                        />
                      }
                    />
                  )}
                </Field>

                <Field name="rightsRetentionStrategy.id">
                  {({ field }: FieldProps<string>) => (
                    <FormLabel component="legend" sx={{ color: 'primary.main', fontWeight: 'bold', marginTop: '1rem' }}>
                      {t('editor.retention_strategy.rrs_info_page')}
                      <TextField
                        type="url"
                        data-testid={dataTestId.editor.rrsLink}
                        {...field}
                        value={field.value ?? ''}
                        label={t('common.url')}
                        required={isRrs || isOverridableRrs}
                        placeholder={t('editor.retention_strategy.rrs_link')}
                        variant="filled"
                        fullWidth
                        disabled={isNullRrs || isSubmitting}
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
                    </FormLabel>
                  )}
                </Field>

                <Typography sx={{ fontStyle: 'italic', marginTop: '0.5rem', marginBottom: '1rem' }}>
                  {t('editor.retention_strategy.rrs_required_link')}
                </Typography>

                <Field name={'rightsRetentionStrategy.type'}>
                  {({ field }: FieldProps<CustomerRrsType>) => (
                    <FormControlLabel
                      label={t('editor.retention_strategy.rrs_override')}
                      control={
                        <Checkbox
                          data-testid={dataTestId.editor.rrsOverride}
                          {...field}
                          disabled={isNullRrs || isSubmitting}
                          checked={isOverridableRrs}
                          value={values.rightsRetentionStrategy?.type}
                          onChange={() => {
                            setFieldValue(
                              field.name,
                              isRrs
                                ? CustomerRrsType.OverridableRightsRetentionStrategy
                                : CustomerRrsType.RightsRetentionStrategy
                            );
                          }}
                        />
                      }
                    />
                  )}
                </Field>

                <Divider sx={{ my: '2.5rem' }} />

                <Box sx={{ mb: '2.5rem' }}>
                  <Typography variant="h2" gutterBottom>
                    {t('file_import')}
                  </Typography>
                  <Typography fontStyle="italic">{t('temporarily_disabled')}</Typography>
                  <Field name={'autoPublishScopusImportFiles'}>
                    {({ field }: FieldProps<boolean>) => (
                      <RadioGroup
                        {...field}
                        row
                        onChange={(event) => setFieldValue(field.name, event.target.value === 'true')}>
                        <FormControlLabel
                          value={false}
                          control={<Radio data-testid={dataTestId.editor.fileImportCreatesTicketRadioButton} />}
                          label={t('file_import_create_ticket')}
                          disabled
                        />
                        <FormControlLabel
                          value={true}
                          control={<Radio data-testid={dataTestId.editor.automaticFileImportRadioButton} />}
                          label={t('file_import_automatic_import')}
                          disabled
                        />
                      </RadioGroup>
                    )}
                  </Field>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: { xs: 'center', lg: 'flex-end' } }}>
                  <Button
                    data-testid={dataTestId.editor.rrsSaveButton}
                    variant="contained"
                    color="secondary"
                    loading={isSubmitting}
                    type="submit">
                    {t('common.save')}
                  </Button>
                </Box>
              </Box>
            );
          }}
        </Formik>
      )}
    </>
  );
};
