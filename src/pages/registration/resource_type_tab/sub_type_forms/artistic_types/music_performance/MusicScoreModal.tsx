import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';
import * as Yup from 'yup';
import SaveIcon from '@mui/icons-material/Save';
import i18n from '../../../../../../translations/i18n';
import { MusicScore } from '../../../../../../types/publication_types/artisticRegistration.types';
import { MaskInputProps } from '../../../components/isbn_and_pages/IsbnField';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';

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
  isrc: {
    type: 'Isrc',
    value: '',
  },
};

const validationSchema = Yup.object<YupShape<MusicScore>>({
  ensemble: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.artistic.music_score_ensemble'),
    })
  ),
  movements: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.artistic.music_score_movements'),
    })
  ),
  extent: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.artistic.extent'),
    })
  ),
  publisher: Yup.object().shape({
    name: Yup.string()
      .nullable()
      .required(
        i18n.t('feedback:validation.is_required', {
          field: i18n.t('common:publisher'),
        })
      ),
  }),
  ismn: Yup.object().shape({
    value: Yup.string()
      .nullable()
      .matches(
        /^9790\d{9}$/,
        i18n.t('feedback:validation.has_invalid_format', {
          field: i18n.t('registration:resource_type.artistic.music_score_ismn'),
        })
      )
      .required(
        i18n.t('feedback:validation.is_required', {
          field: i18n.t('registration:resource_type.artistic.music_score_ismn'),
        })
      ),
  }),
  isrc: Yup.object().shape({
    value: Yup.string()
      .nullable()
      .matches(
        /^[A-Z]{2}[A-Z\d]{3}\d{7}$/,
        i18n.t('feedback:validation.has_invalid_format', {
          field: i18n.t('registration:resource_type.artistic.music_score_isrc'),
        })
      )
      .required(
        i18n.t('feedback:validation.is_required', {
          field: i18n.t('registration:resource_type.artistic.music_score_isrc'),
        })
      ),
  }),
});

export const MusicScoreModal = ({ musicScore, onSubmit, open, closeModal }: MusicScoreModalProps) => {
  const { t } = useTranslation('registration');

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
      <DialogTitle>
        {musicScore ? t('resource_type.artistic.edit_music_score') : t('resource_type.artistic.add_music_score')}
      </DialogTitle>
      <Formik
        initialValues={musicScore ?? emptyMusicScore}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
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
                  label={t('resource_type.artistic.music_score_ensemble')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
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
                  label={t('resource_type.artistic.music_score_movements')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <Field name="extent">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('resource_type.artistic.extent')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
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
            <Field name="ismn.value">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('resource_type.artistic.music_score_ismn')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <Field name="isrc.value">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('resource_type.artistic.music_score_isrc')}
                  required
                  InputProps={{
                    inputComponent: MaskIsrcInput as any,
                  }}
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
            <Button variant="contained" type="submit" startIcon={<SaveIcon />}>
              {musicScore ? t('common:update') : t('common:add')}
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};

const MaskIsrcInput = forwardRef<HTMLElement, MaskInputProps>(({ onChange, ...props }, ref) => (
  <IMaskInput
    {...props}
    mask="aa-***-00-00000"
    inputRef={ref}
    onAccept={(value) => onChange({ target: { name: props.name, value: value.replaceAll('-', '') } })}
  />
));
