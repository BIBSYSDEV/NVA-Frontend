import { Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import { MusicScore } from '../../../../../../types/publication_types/artisticRegistration.types';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';
import { dataTestId } from '../../../../../../utils/dataTestIds';

interface MusicScoreModalProps {
  musicScore?: MusicScore;
  onSubmit: (musicScore: MusicScore) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyMusicScore: MusicScore = {
  type: 'MusicScore',
  ensemble: '',
  movements: '',
  extent: '',
  publisher: {
    type: 'UnconfirmedPublisher',
    name: '',
  },
  ismn: {
    type: 'Ismn',
    value: '',
  },
};

const validationSchema = Yup.object<YupShape<MusicScore>>({
  ensemble: Yup.string().required(
    i18n.t('translation:feedback.validation.is_required', {
      field: i18n.t('translation:registration.resource_type.artistic.music_score_ensemble'),
    })
  ),
  movements: Yup.string().required(
    i18n.t('translation:feedback.validation.is_required', {
      field: i18n.t('translation:registration.resource_type.artistic.music_score_movements'),
    })
  ),
  extent: Yup.string().required(
    i18n.t('translation:feedback.validation.is_required', {
      field: i18n.t('translation:registration.resource_type.artistic.extent'),
    })
  ),
  publisher: Yup.object().shape({
    name: Yup.string()
      .nullable()
      .required(
        i18n.t('translation:feedback.validation.is_required', {
          field: i18n.t('translation:common.publisher'),
        })
      ),
  }),
  ismn: Yup.object().shape({
    value: Yup.string()
      .nullable()
      .matches(
        /^9790\d{9}$/,
        i18n.t('translation:feedback.validation.has_invalid_format', {
          field: i18n.t('translation:registration.resource_type.artistic.music_score_ismn'),
        })
      )
      .required(
        i18n.t('translation:feedback.validation.is_required', {
          field: i18n.t('translation:registration.resource_type.artistic.music_score_ismn'),
        })
      ),
  }),
});

export const MusicScoreModal = ({ musicScore, onSubmit, open, closeModal }: MusicScoreModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
      <DialogTitle>
        {musicScore
          ? t('registration.resource_type.artistic.edit_music_score')
          : t('registration.resource_type.artistic.add_music_score')}
      </DialogTitle>
      <Formik
        initialValues={musicScore ?? emptyMusicScore}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<MusicScore>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="ensemble">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    multiline
                    rows={3}
                    label={t('registration.resource_type.artistic.music_score_ensemble')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.scoreEnsemble}
                  />
                )}
              </Field>
              <Field name="movements">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    multiline
                    rows={3}
                    label={t('registration.resource_type.artistic.music_score_movements')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.scoreMovements}
                  />
                )}
              </Field>
              <Field name="extent">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.extent')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.artisticOutputDuration}
                  />
                )}
              </Field>
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
                    data-testid={dataTestId.registrationWizard.resourceType.scorePublisher}
                  />
                )}
              </Field>
              <Field name="ismn.value">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.music_score_ismn')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.scoreIsmn}
                  />
                )}
              </Field>
            </DialogContent>
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!musicScore} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
