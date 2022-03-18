import { DatePicker } from '@mui/lab';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { datePickerTranslationProps } from '../../../../../../themes/mainTheme';
import { Award } from '../../../../../../types/publication_types/artisticRegistration.types';
import { getNewDateValue } from '../../../../../../utils/registration-helpers';
import i18n from '../../../../../../translations/i18n';

interface AwardModalProps {
  award?: Award;
  onSubmit: (award: Award) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyAward: Award = {
  type: 'Award',
  name: '',
  organizer: '',
  date: { type: 'Instant', value: '' },
  otherInformation: '',
  ranking: 0,
  sequence: 0,
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.artistic.award_name'),
    })
  ),
  organizer: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.artistic.award_organizer'),
    })
  ),
  date: Yup.object().shape({
    value: Yup.date().required(
      i18n.t('feedback:validation.is_required', {
        field: i18n.t('common:year'),
      })
    ),
  }),
});

export const AwardModal = ({ award, onSubmit, open, closeModal }: AwardModalProps) => {
  const { t } = useTranslation('registration');

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {award ? t('resource_type.artistic.edit_award') : t('resource_type.artistic.add_award')}
      </DialogTitle>
      <Formik
        initialValues={award ?? emptyAward}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        <Form noValidate>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field name="name">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('resource_type.artistic.award_name')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>

            <Field name="organizer">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('resource_type.artistic.award_organizer')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>

            <Field name="date.value">
              {({ field, form: { setFieldTouched, setFieldValue }, meta: { error, touched } }: FieldProps<string>) => (
                <DatePicker
                  {...datePickerTranslationProps}
                  label={t('common:year')}
                  value={field.value ?? null}
                  onChange={(date: Date | null, keyboardInput) => {
                    !touched && setFieldTouched(field.name, true, false);
                    const newValue = getNewDateValue(date, keyboardInput);
                    if (newValue !== null) {
                      setFieldValue(field.name, newValue);
                    }
                  }}
                  inputFormat="yyyy"
                  views={['year']}
                  mask="____"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      required
                      onBlur={() => !touched && setFieldTouched(field.name)}
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                />
              )}
            </Field>

            <Field name="ranking">
              {({ field, meta: { touched, error } }: FieldProps<number>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  type="number"
                  label={t('resource_type.artistic.award_ranking')}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>

            <Field name="otherInformation">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('resource_type.artistic.award_other')}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={closeModal}>
              {t('common:cancel')}
            </Button>
            <Button variant="contained" type="submit">
              {award ? t('common:save') : t('common:add')}
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
