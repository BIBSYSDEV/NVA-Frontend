import { DatePicker, LocalizationProvider } from '@mui/lab';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { datePickerTranslationProps } from '../../../../../../themes/mainTheme';
import { MentionInPublication } from '../../../../../../types/publication_types/artisticRegistration.types';
import { getNewDateValue } from '../../../../../../utils/registration-helpers';
import { getDateFnsLocale } from '../../../../../../utils/date-helpers';

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

export const PublicationMentionModal = ({
  mentionInPublication,
  onSubmit,
  open,
  closeModal,
}: PublicationMentionModalProps) => {
  const { t, i18n } = useTranslation('registration');

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {mentionInPublication
          ? t('resource_type.artistic.edit_publication_mention')
          : t('resource_type.artistic.add_publication_mention')}
      </DialogTitle>
      <Formik
        initialValues={mentionInPublication ?? emptyMentionInPublication}
        validationSchema={null} // TODO
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
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={getDateFnsLocale(i18n.language)}>
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
                  </LocalizationProvider>
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
