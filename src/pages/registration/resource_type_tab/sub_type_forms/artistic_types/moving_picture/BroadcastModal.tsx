import { DatePicker } from '@mui/x-date-pickers';
import { Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Broadcast } from '../../../../../../types/publication_types/artisticRegistration.types';
import { PublicationChannelType } from '../../../../../../types/registration.types';
import i18n from '../../../../../../translations/i18n';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { emptyInstant } from '../../../../../../types/common.types';

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
  date: emptyInstant,
};

const validationSchema = Yup.object<YupShape<Broadcast>>({
  publisher: Yup.object().shape({
    name: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('common.publisher'),
      })
    ),
  }),
  date: Yup.object().shape({
    value: Yup.date()
      .required(
        i18n.t('feedback.validation.is_required', {
          field: i18n.t('common.date'),
        })
      )
      .typeError(
        i18n.t('feedback.validation.has_invalid_format', {
          field: i18n.t('common.date'),
        })
      ),
  }),
});

export const BroadcastModal = ({ broadcast, onSubmit, open, closeModal }: BroadcastModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} maxWidth={'sm'} fullWidth>
      <DialogTitle>
        {broadcast
          ? t('registration.resource_type.artistic.edit_broadcast')
          : t('registration.resource_type.artistic.add_broadcast')}
      </DialogTitle>
      <Formik
        initialValues={broadcast ?? emptyBroadcast}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<Broadcast>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="publisher.name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('common.publisher')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.broadcastPublisher}
                  />
                )}
              </Field>
              <Field name="date.value">
                {({
                  field,
                  form: { setFieldTouched, setFieldValue },
                  meta: { error, touched },
                }: FieldProps<string>) => (
                  <DatePicker
                    label={t('common.date')}
                    PopperProps={{
                      'aria-label': t('common.date'),
                    }}
                    value={field.value ?? null}
                    onChange={(date) => {
                      !touched && setFieldTouched(field.name, true, false);
                      setFieldValue(field.name, date ?? '');
                    }}
                    inputFormat="dd.MM.yyyy"
                    mask="__.__.____"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ maxWidth: '13rem' }}
                        variant="filled"
                        required
                        error={touched && !!error}
                        helperText={<ErrorMessage name={field.name} />}
                        data-testid={dataTestId.registrationWizard.resourceType.broadcastDate}
                      />
                    )}
                  />
                )}
              </Field>
            </DialogContent>
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!broadcast} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
