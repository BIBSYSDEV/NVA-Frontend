import { DatePicker } from '@mui/lab';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { datePickerTranslationProps } from '../../../../../../themes/mainTheme';
import { MentionInPublication } from '../../../../../../types/publication_types/artisticRegistration.types';
import { getNewDateValue } from '../../../../../../utils/registration-helpers';
import i18n from '../../../../../../translations/i18n';

interface PublicationMentionModalProps {
  mentionInPublication?: MentionInPublication;
  onSubmit: (mentionInPublication: MentionInPublication) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyMentionInPublication: MentionInPublication = {
  type: 'MentionInPublication',
  title: '',
  issue: '',
  date: { type: 'Instant', value: '' },
  otherInformation: '',
  sequence: 0,
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.artistic.mention_title'),
    })
  ),
  issue: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.issue'),
    })
  ),
  date: Yup.object().shape({
    value: Yup.date().required(
      i18n.t('feedback:validation.is_required', {
        field: i18n.t('common:date'),
      })
    ),
  }),
});

export const PublicationMentionModal = ({
  mentionInPublication,
  onSubmit,
  open,
  closeModal,
}: PublicationMentionModalProps) => {
  const { t } = useTranslation('registration');

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {mentionInPublication
          ? t('resource_type.artistic.edit_publication_mention')
          : t('resource_type.artistic.add_publication_mention')}
      </DialogTitle>
      <Formik
        initialValues={mentionInPublication ?? emptyMentionInPublication}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        <Form noValidate>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field name="title">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('resource_type.artistic.mention_title')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>

            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Field name="issue">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('resource_type.issue')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
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
                    views={['year', 'month', 'day']}
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
            </Box>

            <Field name="otherInformation">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('resource_type.artistic.mention_other')}
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
              {mentionInPublication ? t('common:save') : t('common:add')}
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
