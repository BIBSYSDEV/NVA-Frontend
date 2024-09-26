import { Box, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import { emptyInstant } from '../../../../../../types/common.types';
import { MentionInPublication } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';

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
  date: emptyInstant,
  otherInformation: '',
  sequence: 0,
};

const validationSchema = Yup.object<YupShape<MentionInPublication>>({
  title: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.journal_book_medium'),
    })
  ),
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

export const PublicationMentionModal = ({
  mentionInPublication,
  onSubmit,
  open,
  closeModal,
}: PublicationMentionModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {mentionInPublication
          ? t('registration.resource_type.artistic.edit_publication_mention')
          : t('registration.resource_type.artistic.add_publication_mention')}
      </DialogTitle>
      <Formik
        initialValues={mentionInPublication ?? emptyMentionInPublication}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<MentionInPublication>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="title">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.journal_book_medium')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.outputJournalBookMediumField}
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
                      label={t('registration.resource_type.issue')}
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                      data-testid={dataTestId.registrationWizard.resourceType.outputIssueField}
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
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        if (!touched) {
                          setFieldTouched(field.name, true, false);
                        }
                        setFieldValue(field.name, date ?? '');
                      }}
                      views={['year', 'month', 'day']}
                      slotProps={{
                        textField: {
                          inputProps: {
                            'data-testid': dataTestId.registrationWizard.resourceType.outputInstantDateField,
                          },
                          variant: 'filled',
                          required: true,
                          onBlur: () => !touched && setFieldTouched(field.name),
                          error: touched && !!error,
                          helperText: <ErrorMessage name={field.name} />,
                        },
                      }}
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
                    label={t('registration.resource_type.other_publisher_isbn_etc')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.outputDescriptionField}
                  />
                )}
              </Field>
            </DialogContent>
            <OutputModalActions
              isSubmitting={isSubmitting}
              closeModal={closeModal}
              isAddAction={!mentionInPublication}
            />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
