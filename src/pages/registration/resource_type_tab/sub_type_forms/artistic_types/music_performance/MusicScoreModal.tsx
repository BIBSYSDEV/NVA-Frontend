import { Box, Dialog, DialogContent, DialogTitle, styled, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import { MusicScore } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';

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
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.music_score_ensemble'),
    })
  ),
  movements: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.music_score_movements'),
    })
  ),
  extent: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.extent'),
    })
  ),
  publisher: Yup.object().shape({
    name: Yup.string()
      .nullable()
      .required(
        i18n.t('feedback.validation.is_required', {
          field: i18n.t('common.publisher'),
        })
      ),
  }),
  ismn: Yup.object().shape({
    value: Yup.string()
      .nullable()
      .matches(
        /^9790\d{9}$/,
        i18n.t('feedback.validation.has_invalid_format_example', {
          field: i18n.t('registration.resource_type.artistic.music_score_ismn'),
          example: '9790260000438',
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
          const { ismn, ...rest } = values;
          const formattedValues: MusicScore = ismn?.value ? { ...rest, ismn: { ...ismn, type: 'Ismn' } } : rest;
          onSubmit(formattedValues);
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
                    error={touched && !!error}
                    helperText={
                      !!error ? (
                        <ErrorMessage name={field.name} />
                      ) : (
                        t('registration.resource_type.artistic.music_score_ismn_helper_text')
                      )
                    }
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

export const StyledMusicalWorkListDiv = styled(Box)({
  display: 'flex',
  gap: '0.5rem',
  border: '1px solid lightgrey',
  padding: '0.5rem',
  backgroundColor: '#FEFBF4',
});
