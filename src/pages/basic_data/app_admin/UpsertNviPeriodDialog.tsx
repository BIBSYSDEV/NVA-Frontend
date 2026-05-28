import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { useMutation } from '@tanstack/react-query';
import { Field, FieldProps, Form, Formik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { createNviPeriod, updateNviPeriod } from '../../../api/scientificIndexApi';
import { HorizontalBox, VerticalBox } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/notificationSlice';
import { NviPeriod } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { UrlPathTemplate } from '../../../utils/urlPaths';

const minNewNviPeriodYear = new Date().getFullYear();
const minNewNviDate = new Date(minNewNviPeriodYear, 0, 1);
const maxNewNviDate = new Date(minNewNviPeriodYear + 1, 0, 1);

interface UpsertNviPeriodDialogProps {
  refetchNviPeriods: () => Promise<unknown>;
  yearsWithPeriod: number[];
  nviPeriod: NviPeriod | null; // NviPeriod to edit
  closeEditDialog: () => void;
}

const emptyNviPeriod: NviPeriod = {
  type: 'NviPeriod',
  publishingYear: '',
  startDate: '',
  reportingDate: '',
};

export const UpsertNviPeriodDialog = ({
  refetchNviPeriods,
  yearsWithPeriod,
  nviPeriod,
  closeEditDialog,
}: UpsertNviPeriodDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const nviPeriodMutation = useMutation({
    mutationFn: (data: NviPeriod) => (nviPeriod ? updateNviPeriod(data) : createNviPeriod(data)),
    onSuccess: () =>
      nviPeriod
        ? dispatch(setNotification({ message: t('feedback.success.update_nvi_period'), variant: 'success' }))
        : dispatch(setNotification({ message: t('feedback.success.create_nvi_period'), variant: 'success' })),
    onError: () =>
      nviPeriod
        ? dispatch(setNotification({ message: t('feedback.error.update_nvi_period'), variant: 'error' }))
        : dispatch(setNotification({ message: t('feedback.error.create_nvi_period'), variant: 'error' })),
  });

  const closeDialog = () => {
    if (nviPeriod) {
      closeEditDialog();
    } else {
      navigate(UrlPathTemplate.BasicDataNvi);
    }
  };

  return (
    <Dialog
      open={location.pathname === UrlPathTemplate.BasicDataNviNew || !!nviPeriod}
      onClose={closeDialog}
      data-testid={dataTestId.basicData.nviPeriod.nviPeriodDialog}>
      <DialogTitle>{nviPeriod ? t('edit_reporting_period') : t('basic_data.nvi.add_reporting_period')}</DialogTitle>
      <Formik
        initialValues={nviPeriod ?? emptyNviPeriod}
        onSubmit={async (values) => {
          await nviPeriodMutation.mutateAsync(values);
          await refetchNviPeriods();
          closeDialog();
        }}>
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Trans t={t} i18nKey="reporting_period_text" components={{ p: <Typography /> }} />
              <VerticalBox sx={{ mt: '1rem', gap: '2rem' }}>
                <Field name="publishingYear">
                  {({ field }: FieldProps<string>) => (
                    <DatePicker
                      label={t('basic_data.nvi.period_year')}
                      slotProps={{
                        textField: {
                          required: true,
                          inputProps: { 'data-testid': dataTestId.basicData.nviPeriod.nviPeriodYear },
                        },
                      }}
                      disabled={!!nviPeriod}
                      views={['year']}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(newDate) => {
                        const year = newDate ? newDate.getFullYear().toString() : '';
                        setFieldValue(field.name, year);
                        if (year) {
                          setFieldValue('startDate', new Date(+year, 3, 1).toISOString());
                          setFieldValue('reportingDate', new Date(+year + 1, 3, 1).toISOString());
                        }
                      }}
                      shouldDisableYear={(date) => {
                        const thisYear = date.getFullYear();
                        return nviPeriod?.publishingYear !== thisYear.toString() && yearsWithPeriod.includes(thisYear);
                      }}
                      minDate={nviPeriod ? undefined : minNewNviDate}
                      maxDate={nviPeriod ? undefined : maxNewNviDate}
                    />
                  )}
                </Field>
                <HorizontalBox sx={{ gap: '1.5rem' }}>
                  <Field name="startDate">
                    {({ field }: FieldProps<string>) => (
                      <DateTimePicker
                        sx={{ flex: 1 }}
                        label={t('common.start_date')}
                        slotProps={{
                          textField: {
                            required: true,
                            inputProps: { 'data-testid': dataTestId.basicData.nviPeriod.nviPeriodStartDate },
                          },
                        }}
                        disabled={!values.publishingYear}
                        value={field.value ? new Date(field.value) : null}
                        minDate={values.publishingYear ? new Date(+values.publishingYear, 0, 1) : undefined}
                        maxDate={values.publishingYear ? new Date(+values.publishingYear + 1, 0, 1) : undefined}
                        onChange={(newDate, context) => {
                          if (context.validationError !== 'invalidDate') {
                            const dateString = newDate ? newDate.toISOString() : '';
                            setFieldValue(field.name, dateString);
                          }
                        }}
                      />
                    )}
                  </Field>

                  <Field name="reportingDate">
                    {({ field }: FieldProps<string>) => (
                      <DateTimePicker
                        sx={{ flex: 1 }}
                        label={t('common.end_date')}
                        slotProps={{
                          textField: {
                            required: true,
                            inputProps: { 'data-testid': dataTestId.basicData.nviPeriod.nviPeriodEndDate },
                          },
                        }}
                        disabled={!values.publishingYear}
                        value={field.value ? new Date(field.value) : null}
                        minDate={values.publishingYear ? new Date(+values.publishingYear + 1, 0, 1) : undefined}
                        maxDate={values.publishingYear ? new Date(+values.publishingYear + 1, 6, 31) : undefined}
                        onChange={(newDate, context) => {
                          if (context.validationError !== 'invalidDate') {
                            const dateString = newDate ? newDate.toISOString() : '';
                            setFieldValue(field.name, dateString);
                          }
                        }}
                      />
                    )}
                  </Field>
                </HorizontalBox>
              </VerticalBox>
            </DialogContent>
            <DialogActions sx={{ gap: '0.5rem' }}>
              <Button onClick={closeDialog}>{t('common.cancel')}</Button>
              <Button variant="contained" color="secondary" type="submit" loading={isSubmitting}>
                {t('common.save')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
