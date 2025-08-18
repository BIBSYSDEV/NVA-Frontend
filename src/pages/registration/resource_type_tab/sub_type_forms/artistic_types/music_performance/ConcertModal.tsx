import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  ErrorMessage,
  Field,
  FieldArray,
  FieldArrayRenderProps,
  FieldProps,
  Form,
  Formik,
  FormikErrors,
  FormikProps,
  validateYupSchema,
  yupToFormErrors,
} from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { ConfirmDialog } from '../../../../../../components/ConfirmDialog';
import i18n from '../../../../../../translations/i18n';
import { emptyInstant, emptyPeriod, emptyPlace } from '../../../../../../types/common.types';
import { Concert, MusicalWorkPerformance } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { periodField } from '../../../../../../utils/validation/registration/referenceValidation';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { DeleteIconButton } from '../../../../../messages/components/DeleteIconButton';
import { AnnouncementTableMoveButtons } from '../../../components/AnnouncementTableMoveButtons';
import { ExtentField } from '../../../components/ExtentField';
import { PeriodFields } from '../../../components/PeriodFields';
import { OutputModalActions } from '../OutputModalActions';
import { StyledMusicalWorkListDiv } from './MusicScoreModal';

interface ConcertModalProps {
  concert?: Concert;
  onSubmit: (concert: Concert) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyConcert: Concert = {
  type: 'Concert',
  place: emptyPlace,
  time: emptyInstant,
  extent: '',
  concertProgramme: [],
  concertSeries: '',
};

const emptyMusicalWorkPerformance: MusicalWorkPerformance = {
  type: 'MusicalWorkPerformance',
  title: '',
  composer: '',
  premiere: false,
};

const validationSchema = Yup.object<YupShape<Concert>>({
  concertSeries: Yup.string().when('$partOfSeries', ([partOfSeries], schema) =>
    partOfSeries
      ? schema.required(
          i18n.t('feedback.validation.is_required', {
            field: i18n.t('common.description'),
          })
        )
      : schema.optional()
  ),
  place: Yup.object().shape({
    name: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('common.place'),
      })
    ),
  }),
  time: Yup.object().when('$partOfSeries', ([partOfSeries], schema) =>
    partOfSeries
      ? periodField
      : schema.shape({
          value: Yup.date()
            .required(
              i18n.t('feedback.validation.is_required', {
                field: i18n.t('common.date'),
              })
            )
            .typeError(
              i18n.t('feedback.validation.has_invalid_format', {
                field: i18n.t('common.date'),
              })
            ),
        })
  ),

  extent: Yup.string()
    .required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('registration.resource_type.artistic.extent'),
      })
    )
    .matches(
      /^([0-9][0-9]):([0-5][0-9]):([0-5][0-9])$/,
      i18n.t('feedback.validation.invalid_format', {
        field: i18n.t('registration.resource_type.artistic.extent'),
        format: i18n.t('time_format.hours'),
      })
    ),
  concertProgramme: Yup.array()
    .of(
      Yup.object<YupShape<MusicalWorkPerformance>>({
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
        premiere: Yup.boolean(),
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

export const ConcertModal = ({ concert, onSubmit, open, closeModal }: ConcertModalProps) => {
  const { t } = useTranslation();

  const [removeWorkItemIndex, setRemoveWorkItemIndex] = useState(-1);
  const closeConfirmDialog = () => setRemoveWorkItemIndex(-1);

  const [partOfSeries, setPartOfSeries] = useState(!!concert?.concertSeries);

  const validateForm = (values: Concert): FormikErrors<Concert> => {
    try {
      validateYupSchema<Concert>(values, validationSchema, true, {
        partOfSeries: partOfSeries,
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  const initialValues = concert ?? emptyConcert;

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
      <DialogTitle>
        {concert
          ? t('registration.resource_type.artistic.edit_concert')
          : t('registration.resource_type.artistic.add_concert')}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validate={validateForm}
        initialErrors={validateForm(initialValues)}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }: FormikProps<Concert>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="place.name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('common.place')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.placeField}
                  />
                )}
              </Field>
              <FormControlLabel
                data-testid={dataTestId.registrationWizard.resourceType.concertSeriesCheckbox}
                label={t('registration.resource_type.artistic.concert_part_of_series')}
                control={
                  <Checkbox
                    checked={partOfSeries}
                    onChange={() => {
                      if (!partOfSeries) {
                        setFieldValue('time', emptyPeriod);
                      } else {
                        setFieldValue('time', emptyInstant);
                        setFieldValue('concertSeries', '');
                      }
                      setPartOfSeries(!partOfSeries);
                    }}
                  />
                }
              />
              <Box sx={{ display: 'flex', gap: '1rem' }}>
                {partOfSeries ? (
                  <PeriodFields fromFieldName="time.from" toFieldName="time.to" />
                ) : (
                  <Field name="time.value">
                    {({ field, meta: { error, touched } }: FieldProps<string>) => (
                      <DatePicker
                        label={t('common.date')}
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          if (!touched) {
                            setFieldTouched(field.name, true, false);
                          }
                          setFieldValue(field.name, date ?? '');
                        }}
                        slotProps={{
                          textField: {
                            inputProps: {
                              'data-testid': dataTestId.registrationWizard.resourceType.outputInstantDateField,
                            },
                            sx: { maxWidth: '15rem' },
                            onBlur: () => !touched && setFieldTouched(field.name),
                            variant: 'filled',
                            required: true,
                            error: touched && !!error,
                            helperText: <ErrorMessage name={field.name} />,
                          },
                        }}
                      />
                    )}
                  </Field>
                )}

                <ExtentField
                  fieldName="extent"
                  mask="00:00:00"
                  dataTestId={dataTestId.registrationWizard.resourceType.artisticOutputDuration}
                  placeholder={t('time_format.hours')}
                  label={t('registration.resource_type.artistic.extent')}
                  required
                />
              </Box>
              {partOfSeries && (
                <Field name="concertSeries">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <TextField
                      data-testid={dataTestId.registrationWizard.resourceType.concertSeriesDescriptionField}
                      {...field}
                      fullWidth
                      multiline
                      required
                      value={field.value}
                      variant="filled"
                      rows={3}
                      label={t('common.description')}
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
              )}

              <FieldArray name="concertProgramme">
                {({ name, push, remove, move }: FieldArrayRenderProps) => (
                  <>
                    <Typography variant="h2">{t('registration.resource_type.artistic.program')}</Typography>
                    <Button
                      variant="outlined"
                      sx={{ width: 'fit-content' }}
                      onClick={() => push(emptyMusicalWorkPerformance)}
                      startIcon={<AddIcon />}
                      data-testid={dataTestId.registrationWizard.resourceType.concertAddWork}>
                      {t('common.add_custom', {
                        name: t('registration.resource_type.artistic.musical_work_item').toLocaleLowerCase(),
                      })}
                    </Button>

                    {values.concertProgramme.map((_, index) => {
                      const baseFieldName = `${name}[${index}]`;
                      return (
                        <StyledMusicalWorkListDiv key={index}>
                          {values.concertProgramme.length > 1 && (
                            <AnnouncementTableMoveButtons
                              index={index}
                              listLength={values.concertProgramme.length}
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
                                data-testid={`${dataTestId.registrationWizard.resourceType.concertProgramTitle}-${index}`}
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
                                data-testid={`${dataTestId.registrationWizard.resourceType.concertProgramComposer}-${index}`}
                              />
                            )}
                          </Field>

                          <Field name={`${baseFieldName}.premiere`}>
                            {({ field }: FieldProps<boolean>) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    data-testid={`${dataTestId.registrationWizard.resourceType.concertProgramIsPremiere}-${index}`}
                                  />
                                }
                                label={t('registration.resource_type.artistic.premiere')}
                              />
                            )}
                          </Field>

                          <DeleteIconButton
                            sx={{ alignSelf: 'center' }}
                            data-testid={`${dataTestId.registrationWizard.resourceType.concertProgramRemove}-${index}`}
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

                    {!!touched.concertProgramme && typeof errors.concertProgramme === 'string' && (
                      <FormHelperText error>
                        <ErrorMessage name={name} />
                      </FormHelperText>
                    )}
                  </>
                )}
              </FieldArray>
            </DialogContent>
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!concert} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
