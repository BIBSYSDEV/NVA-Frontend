import AddIcon from '@mui/icons-material/Add';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps } from 'formik';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';
import * as Yup from 'yup';
import { ConfirmDialog } from '../../../../../../components/ConfirmDialog';
import i18n from '../../../../../../translations/i18n';
import {
  AudioVisualPublication,
  MusicMediaType,
  MusicTrack,
  emptyUnconfirmedPublisher,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { DeleteIconButton } from '../../../../../messages/components/DeleteIconButton';
import { MaskInputProps } from '../../../components/isbn_and_pages/IsbnField';
import { OutputModalActions } from '../OutputModalActions';
import { ExtentField } from '../../../components/ExtentField';

interface AudioVisualPublicationModalProps {
  audioVisualPublication?: AudioVisualPublication;
  onSubmit: (audioVisualPublication: AudioVisualPublication) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyAudioVisualPublication: AudioVisualPublication = {
  type: 'AudioVisualPublication',
  mediaType: {
    type: '',
    description: '',
  },
  publisher: emptyUnconfirmedPublisher,
  catalogueNumber: '',
  trackList: [],
  isrc: {
    type: 'Isrc',
    value: '',
  },
};

const emptyMusicTrack: MusicTrack = {
  type: 'MusicTrack',
  title: '',
  composer: '',
  extent: '',
};

const validationSchema = Yup.object<YupShape<AudioVisualPublication>>({
  mediaType: Yup.object().shape({
    type: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('registration.resource_type.artistic.media_type'),
      })
    ),
    description: Yup.string().when('type', ([type], schema) =>
      typeof type === 'string' && type.endsWith('Other')
        ? schema.required(
            i18n.t('feedback.validation.is_required', {
              field: i18n.t('common.description'),
            })
          )
        : schema.optional()
    ),
  }),
  publisher: Yup.object().shape({
    name: Yup.string()
      .nullable()
      .required(
        i18n.t('feedback.validation.is_required', {
          field: i18n.t('common.publisher'),
        })
      ),
  }),
  isrc: Yup.object().shape({
    value: Yup.string()
      .nullable()
      .matches(
        /^[A-Z]{2}[A-Z\d]{3}\d{7}$/,
        i18n.t('feedback.validation.has_invalid_format', {
          field: i18n.t('registration.resource_type.artistic.music_score_isrc'),
        })
      ),
  }),
  trackList: Yup.array().of(
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
      extent: Yup.string()
        .required(
          i18n.t('feedback.validation.is_required', {
            field: i18n.t('registration.resource_type.artistic.extent_in_minutes'),
          })
        )
        .matches(
          /^([0-5][0-9]):([0-5][0-9])$/,
          i18n.t('feedback.validation.invalid_format', {
            field: i18n.t('registration.resource_type.artistic.extent_in_minutes'),
            format: 'MM:SS',
          })
        ),
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
          const { isrc, ...rest } = values;
          const formattedValues: AudioVisualPublication = isrc?.value
            ? { ...rest, isrc: { ...isrc, type: 'Isrc' } }
            : rest;
          onSubmit(formattedValues);
          closeModal();
        }}>
        {({ values, errors, touched, isSubmitting, setFieldValue }: FormikProps<AudioVisualPublication>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="mediaType.type">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    variant="filled"
                    select
                    required
                    label={t('registration.resource_type.artistic.media_type')}
                    fullWidth
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      setFieldValue('mediaType.description', '');
                    }}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.subtypeField}>
                    {Object.values(MusicMediaType).map((mediaType) => (
                      <MenuItem key={mediaType} value={mediaType}>
                        {t(`registration.resource_type.artistic.music_media_type.${mediaType}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>
              {values.mediaType.type === 'MusicMediaOther' ? (
                <Field name="mediaType.description">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <TextField
                      variant="filled"
                      required
                      label={t('common.description')}
                      fullWidth
                      {...field}
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                      data-testid={dataTestId.registrationWizard.resourceType.artisticSubtypeDescription}
                    />
                  )}
                </Field>
              ) : null}
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
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.audioVideoCatalogueNumber}
                  />
                )}
              </Field>
              <Field name="isrc.value">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.music_score_isrc')}
                    error={touched && !!error}
                    helperText={
                      !!error ? (
                        <ErrorMessage name={field.name} />
                      ) : (
                        t('registration.resource_type.artistic.music_score_isrc_helper_text')
                      )
                    }
                    data-testid={dataTestId.registrationWizard.resourceType.scoreIsrc}
                    slotProps={{ input: { inputComponent: MaskIsrcInput as any } }}
                  />
                )}
              </Field>
              <FieldArray name="trackList">
                {({ name, push, remove, move }: FieldArrayRenderProps) => (
                  <>
                    <Typography variant="h2" component="h2">
                      {t('registration.resource_type.artistic.content_track')}
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{ width: 'fit-content', textTransform: 'none' }}
                      onClick={() => push(emptyMusicTrack)}
                      startIcon={<AddIcon />}
                      data-testid={dataTestId.registrationWizard.resourceType.audioVideoAddTrack}>
                      {t('common.add_custom', {
                        name: t('registration.resource_type.artistic.content_track').toLocaleLowerCase(),
                      })}
                    </Button>

                    {values.trackList.map((_, index) => {
                      const baseFieldName = `${name}[${index}]`;
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'top',
                            border: '1px solid lightgrey',
                            p: '0.5rem',
                            bgcolor: '#fefbf3',
                          }}>
                          {values.trackList.length > 1 && (
                            <Box sx={{ display: 'flex', alignSelf: 'center' }}>
                              <IconButton
                                title={t('common.move_up')}
                                data-testid={dataTestId.registrationWizard.moveUpButton(index)}
                                sx={{ visibility: index === 0 ? 'hidden' : 'visible' }}
                                onClick={() => {
                                  move(index, index - 1);
                                }}>
                                <ArrowRightAltIcon sx={{ transform: 'rotate(-90deg)' }} />
                              </IconButton>

                              <IconButton
                                title={t('common.move_down')}
                                data-testid={dataTestId.registrationWizard.moveDownButton(index)}
                                sx={{ visibility: index === values.trackList.length - 1 ? 'hidden' : 'visible' }}
                                onClick={() => {
                                  move(index, index + 1);
                                }}>
                                <ArrowRightAltIcon sx={{ transform: 'rotate(90deg)' }} />
                              </IconButton>
                            </Box>
                          )}
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
                          <ExtentField
                            fieldName={`${baseFieldName}.extent`}
                            mask="00:00"
                            dataTestId={`${dataTestId.registrationWizard.resourceType.artisticOutputDuration}-${index}`}
                            required
                          />
                          <DeleteIconButton
                            sx={{ alignSelf: 'center' }}
                            data-testid={`${dataTestId.registrationWizard.resourceType.audioVideoContentRemove}-${index}`}
                            onClick={() => setRemoveTrackIndex(index)}
                            tooltip={t('registration.resource_type.artistic.remove_music_work')}
                          />
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

const MaskIsrcInput = forwardRef<HTMLElement, MaskInputProps>(({ onChange, ...props }, ref) => (
  <IMaskInput
    {...props}
    mask="aa-***-00-00000"
    inputRef={ref}
    onAccept={(value) => onChange({ target: { name: props.name, value: value.replaceAll('-', '') } })}
  />
));
MaskIsrcInput.displayName = 'MaskIsrcInput';
