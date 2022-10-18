import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Typography,
  FormHelperText,
  Box,
} from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FieldArray, FieldArrayRenderProps, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDialog } from '../../../../../../components/ConfirmDialog';
import i18n from '../../../../../../translations/i18n';
import {
  AudioVisualPublication,
  MusicMediaType,
  MusicTrack,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';
import { dataTestId } from '../../../../../../utils/dataTestIds';

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

const validationSchema = Yup.object<YupShape<AudioVisualPublication>>({
  mediaType: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.media_type'),
    })
  ),
  publisher: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('common.publisher'),
    })
  ),
  catalogueNumber: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.catalogue_number'),
    })
  ),
  trackList: Yup.array()
    .of(
      Yup.object<YupShape<MusicTrack>>({
        title: Yup.string().required(
          i18n.t('feedback.validation.is_required', {
            field: i18n.t('common.title'),
          })
        ),
        composer: Yup.string().required(
          i18n.t('feedback.validation.is_required', {
            field: i18n.t('registration.resource_type.artistic.composer'),
          })
        ),
        extent: Yup.number()
          .typeError(
            i18n.t('feedback.validation.has_invalid_format', {
              field: i18n.t('registration.resource_type.artistic.extent_in_minutes'),
            })
          )
          .required(
            i18n.t('feedback.validation.is_required', {
              field: i18n.t('registration.resource_type.artistic.extent_in_minutes'),
            })
          ),
      })
    )
    .min(
      1,
      i18n.t('feedback.validation.must_have_minimum', {
        min: 1,
        field: i18n.t('registration.resource_type.artistic.content_track').toLocaleLowerCase(),
      })
    ),
});

export const AudioVisualPublicationModal = ({
  audioVisualPublication,
  onSubmit,
  open,
  closeModal,
}: AudioVisualPublicationModalProps) => {
  const { t } = useTranslation();

  const [removeTrackIndex, setRemoveTrackIndex] = useState(-1);
  const closeConfirmDialog = () => setRemoveTrackIndex(-1);

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
      <DialogTitle>
        {audioVisualPublication
          ? t('registration.resource_type.artistic.edit_audio_visual_publication')
          : t('registration.resource_type.artistic.add_audio_visual_publication')}
      </DialogTitle>
      <Formik
        initialValues={audioVisualPublication ?? emptyAudioVisualPublication}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ values, errors, touched, isSubmitting }: FormikProps<AudioVisualPublication>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="mediaType">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    variant="filled"
                    select
                    required
                    label={t('registration.resource_type.artistic.media_type')}
                    fullWidth
                    {...field}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.artisticSubtype}>
                    {Object.values(MusicMediaType).map((mediaType) => (
                      <MenuItem key={mediaType} value={mediaType}>
                        {t(`registration.resource_type.artistic.music_media_type.${mediaType}`)}
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
                    label={t('common.publisher')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.audioVideoPublisher}
                  />
                )}
              </Field>
              <Field name="catalogueNumber">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.catalogue_number')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.audioVideoCatalogueNumber}
                  />
                )}
              </Field>
              <FieldArray name="trackList">
                {({ name, push, remove }: FieldArrayRenderProps) => (
                  <>
                    <Typography variant="h3">{t('registration.resource_type.artistic.content_track')}</Typography>

                    {values.trackList.map((_, index) => {
                      const baseFieldName = `${name}[${index}]`;
                      return (
                        <Box key={index} sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <Field name={`${baseFieldName}.title`}>
                            {({ field, meta: { touched, error } }: FieldProps<string>) => (
                              <TextField
                                {...field}
                                variant="filled"
                                fullWidth
                                label={t('common.title')}
                                required
                                error={touched && !!error}
                                helperText={<ErrorMessage name={field.name} />}
                                data-testid={`${dataTestId.registrationWizard.resourceType.audioVideoContentTitle}-${index}`}
                              />
                            )}
                          </Field>
                          <Field name={`${baseFieldName}.composer`}>
                            {({ field, meta: { touched, error } }: FieldProps<string>) => (
                              <TextField
                                {...field}
                                variant="filled"
                                fullWidth
                                label={t('registration.resource_type.artistic.composer')}
                                required
                                error={touched && !!error}
                                helperText={<ErrorMessage name={field.name} />}
                                data-testid={`${dataTestId.registrationWizard.resourceType.audioVideoContentComposer}-${index}`}
                              />
                            )}
                          </Field>
                          <Field name={`${baseFieldName}.extent`}>
                            {({ field, meta: { touched, error } }: FieldProps<string>) => (
                              <TextField
                                {...field}
                                variant="filled"
                                fullWidth
                                label={t('registration.resource_type.artistic.extent_in_minutes')}
                                required
                                error={touched && !!error}
                                helperText={<ErrorMessage name={field.name} />}
                                data-testid={`${dataTestId.registrationWizard.resourceType.artisticOutputDuration}-${index}`}
                              />
                            )}
                          </Field>
                          <Button
                            variant="outlined"
                            color="error"
                            title={t('registration.resource_type.artistic.remove_music_work')}
                            onClick={() => setRemoveTrackIndex(index)}
                            sx={{ px: '2rem' }}
                            startIcon={<DeleteIcon />}
                            data-testid={`${dataTestId.registrationWizard.resourceType.audioVideoContentRemove}-${index}`}>
                            {t('common.remove')}
                          </Button>
                        </Box>
                      );
                    })}
                    <ConfirmDialog
                      title={t('registration.resource_type.artistic.remove_music_work')}
                      open={removeTrackIndex > -1}
                      onCancel={closeConfirmDialog}
                      onAccept={() => {
                        remove(removeTrackIndex);
                        closeConfirmDialog();
                      }}>
                      <Typography>{t('registration.resource_type.artistic.remove_music_work_description')}</Typography>
                    </ConfirmDialog>

                    <Button
                      variant="outlined"
                      sx={{ width: 'fit-content' }}
                      onClick={() => push(emptyMusicTrack)}
                      startIcon={<AddIcon />}
                      data-testid={dataTestId.registrationWizard.resourceType.audioVideoAddTrack}>
                      {t('common.add')} {t('registration.resource_type.artistic.content_track').toLocaleLowerCase()}
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
            <OutputModalActions
              isSubmitting={isSubmitting}
              closeModal={closeModal}
              isAddAction={!audioVisualPublication}
            />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
