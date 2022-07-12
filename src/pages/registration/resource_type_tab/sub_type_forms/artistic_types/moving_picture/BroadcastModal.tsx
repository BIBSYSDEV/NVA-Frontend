import { DatePicker } from '@mui/x-date-pickers';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { datePickerTranslationProps } from '../../../../../../themes/mainTheme';
import { Broadcast } from '../../../../../../types/publication_types/artisticRegistration.types';
import { PublicationChannelType } from '../../../../../../types/registration.types';
import { getNewDateValue } from '../../../../../../utils/registration-helpers';
import i18n from '../../../../../../translations/i18n';

interface BroadcastModalProps {
  broadcast?: Broadcast;
  onSubmit: (broadcast: Broadcast) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyBroadcast: Broadcast = {
  type: 'Broadcast',
  publisher: {
    type: PublicationChannelType.UnconfirmedPublisher,
    name: '',
  },
  date: { type: 'Instant', value: '' },
};

const validationSchema = Yup.object().shape({
  publisher: Yup.object().shape({
    name: Yup.string().required(
      i18n.t('feedback:validation.is_required', {
        field: i18n.t('common:publisher'),
      })
    ),
  }),
  date: Yup.object().shape({
    value: Yup.string().required(
      i18n.t('feedback:validation.is_required', {
        field: i18n.t('common:date'),
      })
    ),
  }),
});

export const BroadcastModal = ({ broadcast, onSubmit, open, closeModal }: BroadcastModalProps) => {
  const { t } = useTranslation('registration');

  return (
    <Dialog open={open} onClose={closeModal} maxWidth={'sm'} fullWidth>
      <DialogTitle>
        {broadcast ? t('resource_type.artistic.edit_broadcast') : t('resource_type.artistic.add_broadcast')}
      </DialogTitle>
      <Formik
        initialValues={broadcast ?? emptyBroadcast}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        <Form noValidate>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field name="publisher.name">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('common:publisher')}
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
                  label={t('common:date')}
                  value={field.value ?? null}
                  onChange={(date: Date | null, keyboardInput) => {
                    !touched && setFieldTouched(field.name, true, false);
                    const newValue = getNewDateValue(date, keyboardInput);
                    if (newValue !== null) {
                      setFieldValue(field.name, newValue);
                    }
                  }}
                  inputFormat="dd.MM.yyyy"
                  mask="__.__.____"
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
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={closeModal}>
              {t('common:cancel')}
            </Button>
            <Button variant="contained" type="submit">
              {broadcast ? t('common:update') : t('common:add')}
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
