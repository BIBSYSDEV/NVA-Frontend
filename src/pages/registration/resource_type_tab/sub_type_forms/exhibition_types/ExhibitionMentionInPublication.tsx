import { Box, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../translations/i18n';
import { emptyInstant } from '../../../../../types/common.types';
import { ExhibitionMentionInPublication } from '../../../../../types/publication_types/exhibitionContent.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { OutputModalActions } from '../artistic_types/OutputModalActions';

interface ExhibitionMentionInPublicationModalProps {
  exhibitionMentionInPublication?: ExhibitionMentionInPublication;
  onSubmit: (exhibitionMentionInPublication: ExhibitionMentionInPublication) => void;
  open: boolean;
  closeModal: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.journal_book_medium'),
    })
  ),
});

const emptyExhibitionMentionInPublication: ExhibitionMentionInPublication = {
  type: 'ExhibitionMentionInPublication',
  title: '',
  issue: '',
  date: emptyInstant,
  otherInformation: '',
};

export const ExhibitionMentionInPublicationModal = ({
  exhibitionMentionInPublication,
  onSubmit,
  open,
  closeModal,
}: ExhibitionMentionInPublicationModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {exhibitionMentionInPublication
          ? t('registration.resource_type.exhibition_production.edit_mention_in_publication')
          : t('registration.resource_type.exhibition_production.add_mention_in_publication')}
      </DialogTitle>
      <Formik
        initialValues={exhibitionMentionInPublication ?? emptyExhibitionMentionInPublication}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const formattedValues: ExhibitionMentionInPublication = {
            ...values,
            date: values.date?.value
              ? {
                  type: 'Instant',
                  value: values.date.value,
                }
              : undefined,
          };
          onSubmit(formattedValues);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<ExhibitionMentionInPublication>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="title">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    data-testid={dataTestId.registrationWizard.resourceType.outputJournalBookMediumField}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.journal_book_medium')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>

              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                <Field name="issue">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      data-testid={dataTestId.registrationWizard.resourceType.outputIssueField}
                      variant="filled"
                      fullWidth
                      label={t('registration.resource_type.issue')}
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
                      label={t('common.date')}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        if (!touched) {
                          setFieldTouched(field.name, true, false);
                        }
                        setFieldValue(field.name, date);
                      }}
                      slotProps={{
                        textField: {
                          inputProps: {
                            'data-testid': dataTestId.registrationWizard.resourceType.outputInstantDateField,
                          },
                          variant: 'filled',
                          fullWidth: true,
                          error: touched && !!error,
                          helperText: <ErrorMessage name={field.name} />,
                          required: true,
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
                    multiline
                    rows={2}
                    data-testid={dataTestId.registrationWizard.resourceType.outputDescriptionField}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.other_publisher_isbn_etc')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
            </DialogContent>
            <OutputModalActions
              isSubmitting={isSubmitting}
              closeModal={closeModal}
              isAddAction={!exhibitionMentionInPublication}
            />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
