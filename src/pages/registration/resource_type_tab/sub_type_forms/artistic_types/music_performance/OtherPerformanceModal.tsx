import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogContent, DialogTitle, FormHelperText, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { ConfirmDialog } from '../../../../../../components/ConfirmDialog';
import i18n from '../../../../../../translations/i18n';
import { emptyPlace } from '../../../../../../types/common.types';
import {
  MusicalWork,
  OtherMusicPerformance,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { DeleteIconButton } from '../../../../../messages/components/DeleteIconButton';
import { ExtentField } from '../../../components/ExtentField';
import { MusicalWorkMoveButtons } from '../../../components/MusicalWorkMoveButtons';
import { OutputModalActions } from '../OutputModalActions';
import { StyledMusicalWorkListDiv } from './MusicScoreModal';

interface OtherPerformanceModalProps {
  otherPerformance?: OtherMusicPerformance;
  onSubmit: (otherPerformance: OtherMusicPerformance) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyOtherPerformance: OtherMusicPerformance = {
  type: 'OtherPerformance',
  place: emptyPlace,
  performanceType: '',
  extent: '',
  musicalWorks: [],
};

const emptyMusicalWork: MusicalWork = {
  type: 'MusicalWork',
  title: '',
  composer: '',
};

const validationSchema = Yup.object<YupShape<OtherMusicPerformance>>({
  performanceType: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.performance_type'),
    })
  ),
  extent: Yup.string().matches(
    /^([0-5][0-9]):([0-5][0-9])$/,
    i18n.t('feedback.validation.invalid_format', {
      field: i18n.t('registration.resource_type.artistic.extent_in_minutes'),
      format: i18n.t('time_format.minutes'),
    })
  ),
  musicalWorks: Yup.array()
    .of(
      Yup.object<YupShape<MusicalWork>>({
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
      })
    )
    .min(
      1,
      i18n.t('feedback.validation.must_have_minimum', {
        min: 1,
        field: i18n.t('registration.resource_type.artistic.musical_work_item').toLocaleLowerCase(),
      })
    ),
});

export const OtherPerformanceModal = ({ otherPerformance, onSubmit, open, closeModal }: OtherPerformanceModalProps) => {
  const { t } = useTranslation();

  const [removeWorkItemIndex, setRemoveWorkItemIndex] = useState(-1);
  const closeConfirmDialog = () => setRemoveWorkItemIndex(-1);

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
      <DialogTitle>
        {otherPerformance
          ? t('registration.resource_type.artistic.edit_other_performance')
          : t('registration.resource_type.artistic.add_other_performance')}
      </DialogTitle>
      <Formik
        initialValues={otherPerformance ?? emptyOtherPerformance}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (!values.place?.type) {
            values.place = {
              ...emptyPlace,
              ...values.place,
            };
          }
          onSubmit(values);
          closeModal();
        }}>
        {({ values, errors, touched, isSubmitting }: FormikProps<OtherMusicPerformance>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="performanceType">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.performance_type')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.otherPerformanceType}
                  />
                )}
              </Field>
              <Field name="place.name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('common.place')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.placeField}
                  />
                )}
              </Field>

              <ExtentField
                fieldName="extent"
                mask="00:00"
                dataTestId={dataTestId.registrationWizard.resourceType.artisticOutputDuration}
              />
              <FieldArray name="musicalWorks">
                {({ name, push, remove, move }: FieldArrayRenderProps) => (
                  <>
                    <Typography variant="h2">{t('registration.resource_type.artistic.musical_works')}</Typography>
                    <Button
                      variant="outlined"
                      sx={{ width: 'fit-content', textTransform: 'none' }}
                      onClick={() => push(emptyMusicalWork)}
                      data-testid={dataTestId.registrationWizard.resourceType.otherPerfomanceAddWork}
                      startIcon={<AddIcon />}>
                      {t('common.add_custom', {
                        name: t('registration.resource_type.artistic.musical_work_item').toLocaleLowerCase(),
                      })}
                    </Button>

                    {values.musicalWorks.map((_, index) => {
                      const baseFieldName = `${name}[${index}]`;
                      return (
                        <StyledMusicalWorkListDiv key={index}>
                          {values.musicalWorks.length > 1 && (
                            <MusicalWorkMoveButtons
                              index={index}
                              listLength={values.musicalWorks.length}
                              moveItem={(newIndex) => move(index, newIndex)}
                            />
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
                                data-testid={dataTestId.registrationWizard.resourceType.otherPerformanceWorkTitle}
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
                                data-testid={dataTestId.registrationWizard.resourceType.otherPerformanceWorkComposer}
                              />
                            )}
                          </Field>
                          <DeleteIconButton
                            sx={{ alignSelf: 'center' }}
                            data-testid={dataTestId.registrationWizard.resourceType.otherPerformanceWorkRemove}
                            onClick={() => setRemoveWorkItemIndex(index)}
                            tooltip={t('registration.resource_type.artistic.remove_music_work')}
                          />
                        </StyledMusicalWorkListDiv>
                      );
                    })}
                    <ConfirmDialog
                      title={t('registration.resource_type.artistic.remove_music_work')}
                      open={removeWorkItemIndex > -1}
                      onCancel={closeConfirmDialog}
                      onAccept={() => {
                        remove(removeWorkItemIndex);
                        closeConfirmDialog();
                      }}>
                      <Typography>{t('registration.resource_type.artistic.remove_music_work_description')}</Typography>
                    </ConfirmDialog>

                    {!!touched.musicalWorks && typeof errors.musicalWorks === 'string' && (
                      <FormHelperText error>
                        <ErrorMessage name={name} />
                      </FormHelperText>
                    )}
                  </>
                )}
              </FieldArray>
            </DialogContent>
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!otherPerformance} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
