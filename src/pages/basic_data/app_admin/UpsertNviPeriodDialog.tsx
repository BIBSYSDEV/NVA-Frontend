import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { useMutation } from '@tanstack/react-query';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { createNviPeriod } from '../../../api/scientificIndexApi';
import { setNotification } from '../../../redux/notificationSlice';
import { NviPeriod } from '../../../types/nvi.types';
import { minNviYear } from '../../../utils/nviHelpers';
import { UrlPathTemplate } from '../../../utils/urlPaths';

const minNviDate = new Date(minNviYear, 0, 1);
const maxNviDate = new Date(new Date().getFullYear() + 1, 0, 1);

interface UpsertNviPeriodDialogProps {
  refetchNviPeriods: () => Promise<unknown>;
  yearsWithPeriod: number[];
}

export const UpsertNviPeriodDialog = ({ refetchNviPeriods, yearsWithPeriod }: UpsertNviPeriodDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const nviPeriodMutation = useMutation({
    mutationFn: (data: NviPeriod) => createNviPeriod(data),
    onSuccess: () =>
      dispatch(setNotification({ message: t('feedback.success.create_nvi_period'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.create_nvi_period'), variant: 'error' })),
  });

  return (
    <Dialog
      open={history.location.pathname === UrlPathTemplate.BasicDataNviNew}
      onClose={() => history.push(UrlPathTemplate.BasicDataNvi)}>
      <DialogTitle>{t('basic_data.nvi.add_reporting_period')}</DialogTitle>
      <Formik
        initialValues={{ publishingYear: '', reportingDate: '', startDate: '' }}
        onSubmit={async (values) => {
          await nviPeriodMutation.mutateAsync(values);
          await refetchNviPeriods();
          history.push(UrlPathTemplate.BasicDataNvi);
        }}>
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="publishingYear">
                {({ field }: FieldProps<string>) => (
                  <DatePicker
                    label={t('basic_data.nvi.period_year')}
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
                    shouldDisableYear={(date) => yearsWithPeriod.includes(date.getFullYear())}
                    minDate={minNviDate}
                    maxDate={maxNviDate}
                  />
                )}
              </Field>

              <Field name="startDate">
                {({ field }: FieldProps<string>) => (
                  <DateTimePicker
                    label={t('common.start_date')}
                    disabled={!values.publishingYear}
                    value={field.value ? new Date(field.value) : null}
                    minDate={values.publishingYear ? new Date(+values.publishingYear, 0, 1) : minNviDate}
                    maxDate={values.publishingYear ? new Date(+values.publishingYear, 4, 31) : null}
                    onChange={(newDate) => {
                      const dateString = newDate ? newDate.toISOString() : '';
                      setFieldValue(field.name, dateString);
                    }}
                  />
                )}
              </Field>

              <Field name="reportingDate">
                {({ field }: FieldProps<string>) => (
                  <DateTimePicker
                    label={t('common.end_date')}
                    disabled={!values.publishingYear}
                    value={field.value ? new Date(field.value) : null}
                    minDate={values.publishingYear ? new Date(+values.publishingYear + 1, 0, 1) : minNviDate}
                    maxDate={values.publishingYear ? new Date(+values.publishingYear + 1, 4, 31) : null}
                    onChange={(newDate) => {
                      const dateString = newDate ? newDate.toISOString() : '';
                      setFieldValue(field.name, dateString);
                    }}
                  />
                )}
              </Field>
            </DialogContent>
            <DialogActions sx={{ gap: '0.5rem' }}>
              <Link to={UrlPathTemplate.BasicDataNvi}>
                <Button>{t('common.cancel')}</Button>
              </Link>
              <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                {t('common.save')}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
