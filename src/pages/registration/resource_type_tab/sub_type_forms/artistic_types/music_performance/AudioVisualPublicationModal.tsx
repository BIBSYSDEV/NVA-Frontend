import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  Typography,
  FormHelperText,
  Box,
} from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FieldArray, FieldArrayRenderProps, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import {
  AudioVisualPublication,
  MusicMediaType,
  MusicTrack,
} from '../../../../../../types/publication_types/artisticRegistration.types';

interface AudioVisualPublicationModalProps {
  audioVisualPublication?: AudioVisualPublication;
  onSubmit: (audioVisualPublication: AudioVisualPublication) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyAudioVisualPublication: AudioVisualPublication = {
  type: 'AudioVisualPublication',
  mediaType: '',
  publisher: '',
  catalogueNumber: '',
  trackList: [],
};

const emptyMusicTrack: MusicTrack = {
  type: 'MusicTrack',
  title: '',
  composer: '',
  extent: '',
};

const validationSchema = Yup.object().shape({
  mediaType: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.artistic.media_type'),
    })
  ),
  publisher: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('common:publisher'),
    })
  ),
  catalogueNumber: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.artistic.catalogue_number'),
    })
  ),
  trackList: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required(
          i18n.t('feedback:validation.is_required', {
            field: i18n.t('common:title'),
          })
        ),
        composer: Yup.string().required(
          i18n.t('feedback:validation.is_required', {
            field: i18n.t('registration:resource_type.artistic.composer'),
          })
        ),
        extent: Yup.number()
          .typeError(
            i18n.t('feedback:validation.has_invalid_format', {
              field: i18n.t('registration:resource_type.artistic.extent_in_minutes'),
            })
          )
          .required(
            i18n.t('feedback:validation.is_required', {
              field: i18n.t('registration:resource_type.artistic.extent_in_minutes'),
            })
          ),
      })
    )
    .min(
      1,
      i18n.t('feedback:validation.must_have_minimum', {
        min: 1,
        field: i18n.t('registration:resource_type.artistic.content_track').toLocaleLowerCase(),
      })
    ),
});

export const AudioVisualPublicationModal = ({
  audioVisualPublication,
  onSubmit,
  open,
  closeModal,
}: AudioVisualPublicationModalProps) => {
  const { t } = useTranslation('registration');

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
      <DialogTitle>
        {audioVisualPublication
          ? t('resource_type.artistic.edit_audio_visual_publication')
          : t('resource_type.artistic.add_audio_visual_publication')}
      </DialogTitle>
      <Formik
        initialValues={audioVisualPublication ?? emptyAudioVisualPublication}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ values, errors, touched }: FormikProps<AudioVisualPublication>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="mediaType">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    variant="filled"
                    select
                    required
                    label={t('resource_type.artistic.media_type')}
                    fullWidth
                    {...field}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}>
                    {Object.values(MusicMediaType).map((mediaType) => (
                      <MenuItem key={mediaType} value={mediaType}>
                        {t(`resource_type.artistic.music_media_type.${mediaType}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>
              <Field name="publisher">
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
              <Field name="catalogueNumber">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('resource_type.artistic.catalogue_number')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <FieldArray name="trackList">
                {({ name, push }: FieldArrayRenderProps) => (
                  <>
                    <Typography variant="h3">{t('resource_type.artistic.content_track')}</Typography>

                    {values.trackList.map((_, index) => {
                      const baseFieldName = `${name}[${index}]`;
                      return (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>
                          <Field name={`${baseFieldName}.title`}>
                            {({ field, meta: { touched, error } }: FieldProps<string>) => (
                              <TextField
                                {...field}
                                variant="filled"
                                fullWidth
                                label={t('common:title')}
                                required
                                error={touched && !!error}
                                helperText={<ErrorMessage name={field.name} />}
                              />
                            )}
                          </Field>
                          <Field name={`${baseFieldName}.composer`}>
                            {({ field, meta: { touched, error } }: FieldProps<string>) => (
                              <TextField
                                {...field}
                                variant="filled"
                                fullWidth
                                label={t('resource_type.artistic.composer')}
                                required
                                error={touched && !!error}
                                helperText={<ErrorMessage name={field.name} />}
                              />
                            )}
                          </Field>
                          <Field name={`${baseFieldName}.extent`}>
                            {({ field, meta: { touched, error } }: FieldProps<string>) => (
                              <TextField
                                {...field}
                                variant="filled"
                                fullWidth
                                label={t('resource_type.artistic.extent_in_minutes')}
                                required
                                error={touched && !!error}
                                helperText={<ErrorMessage name={field.name} />}
                              />
                            )}
                          </Field>
                        </Box>
                      );
                    })}

                    <Button variant="outlined" sx={{ width: 'fit-content' }} onClick={() => push(emptyMusicTrack)}>
                      {t('common:add')} {t('resource_type.artistic.content_track').toLocaleLowerCase()}
                    </Button>
                    {!!touched.trackList && typeof errors.trackList === 'string' && (
                      <FormHelperText error>
                        <ErrorMessage name={name} />
                      </FormHelperText>
                    )}
                  </>
                )}
              </FieldArray>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={closeModal}>
                {t('common:cancel')}
              </Button>
              <Button variant="contained" type="submit">
                {audioVisualPublication ? t('common:update') : t('common:add')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
