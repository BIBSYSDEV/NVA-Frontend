import { Dialog, DialogTitle, DialogContent, TextField, MenuItem } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import {
  emptyUnconfirmedPublisher,
  LiteraryArtsAudioVisual,
  LiteraryArtsAudioVisualSubtype,
  UnconfirmedPublisher,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { emptyRegistrationDate, RegistrationDate } from '../../../../../../types/registration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';
import { isbnField } from '../../../../../../utils/validation/registration/referenceValidation';

interface LiteraryArtsAudioVisualModalProps {
  audioVisual?: LiteraryArtsAudioVisual;
  onSubmit: (audioVisual: LiteraryArtsAudioVisual) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyLiteraryArtsAudioVisual: LiteraryArtsAudioVisual = {
  type: 'LiteraryArtsAudioVisual',
  subtype: '',
  publisher: emptyUnconfirmedPublisher,
  publicationDate: emptyRegistrationDate,
  isbn: '',
  extent: '',
};

const validationSchema = Yup.object<YupShape<LiteraryArtsAudioVisual>>({
  subtype: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.type_work'),
    })
  ),
  publisher: Yup.object<YupShape<UnconfirmedPublisher>>({
    name: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('registration.resource_type.artistic.publisher'),
      })
    ),
  }),
  publicationDate: Yup.object<YupShape<RegistrationDate>>({
    year: Yup.number()
      .min(
        1950,
        i18n.t('feedback.validation.must_be_bigger_than', {
          field: i18n.t('common.year'),
          limit: 1950,
        })
      )
      .max(
        2100,
        i18n.t('feedback.validation.must_be_smaller_than', {
          field: i18n.t('common.year'),
          limit: 2100,
        })
      )
      .typeError(
        i18n.t('feedback.validation.has_invalid_format', {
          field: i18n.t('common.year'),
        })
      )
      .required(
        i18n.t('feedback.validation.is_required', {
          field: i18n.t('common.year'),
        })
      ),
  }),
  isbn: isbnField,
});

export const LiteraryArtsAudioVisualModal = ({
  audioVisual,
  onSubmit,
  open,
  closeModal,
}: LiteraryArtsAudioVisualModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {audioVisual
          ? t('registration.resource_type.artistic.edit_audio_visual_publication')
          : t('registration.resource_type.artistic.add_audio_visual_publication')}
      </DialogTitle>
      <Formik
        initialValues={audioVisual ?? emptyLiteraryArtsAudioVisual}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<LiteraryArtsAudioVisual>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="subtype">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    select
                    required
                    label={t('registration.resource_type.type_work')}
                    fullWidth
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.artisticSubtype}>
                    {Object.values(LiteraryArtsAudioVisualSubtype).map((audioVideoType) => (
                      <MenuItem key={audioVideoType} value={audioVideoType}>
                        {t(`registration.resource_type.artistic.audio_video_type.${audioVideoType}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>

              <Field name="publisher.name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.publisher')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.publisherNameField}
                  />
                )}
              </Field>

              <Field name="publicationDate.year">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    label={t('common.year')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.artisticOutputDate}
                  />
                )}
              </Field>

              <Field name="isbn">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.isbn')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.isbnField}
                  />
                )}
              </Field>

              <Field name="extent">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.extent_in_minutes')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.audioVideoContentDuration}
                  />
                )}
              </Field>
            </DialogContent>
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!audioVisual} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
