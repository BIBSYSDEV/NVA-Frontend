import { DatePicker } from '@mui/x-date-pickers';
import { Dialog, DialogTitle, DialogContent, TextField, Box } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { MentionInPublication } from '../../../../../../types/publication_types/artisticRegistration.types';
import i18n from '../../../../../../translations/i18n';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';
import { emptyInstant } from '../../../../../../types/common.types';

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
    i18n.t('translation:feedback.validation.is_required', {
      field: i18n.t('translation:registration.resource_type.artistic.mention_title'),
    })
  ),
  date: Yup.object().shape({
    value: Yup.date()
      .required(
        i18n.t('translation:feedback.validation.is_required', {
          field: i18n.t('translation:common.date'),
        })
      )
      .typeError(
        i18n.t('translation:feedback.validation.has_invalid_format', {
          field: i18n.t('translation:common.date'),
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
                    label={t('registration.resource_type.artistic.mention_title')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.publicationMentionTitle}
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
                      data-testid={dataTestId.registrationWizard.resourceType.publicationMentionIssue}
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
                          data-testid={dataTestId.registrationWizard.resourceType.artisticOutputDate}
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
                    label={t('registration.resource_type.artistic.mention_other_type')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.publicationMentionOther}
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
