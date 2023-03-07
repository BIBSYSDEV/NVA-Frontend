import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  FormHelperText,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FieldArray, FieldArrayRenderProps, FormikProps } from 'formik';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import { ConfirmDialog } from '../../../../../../components/ConfirmDialog';
import i18n from '../../../../../../translations/i18n';
import { Concert, MusicalWorkPerformance } from '../../../../../../types/publication_types/artisticRegistration.types';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { emptyInstant, emptyPeriod } from '../../../../../../types/common.types';
import { PeriodFields } from '../../../components/PeriodFields';
import { periodField } from '../../../../../../utils/validation/registration/referenceValidation';

interface ConcertModalProps {
  concert?: Concert;
  onSubmit: (concert: Concert) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyConcert: Concert = {
  type: 'Concert',
  place: {
    type: 'UnconfirmedPlace',
    label: '',
    country: '',
  },
  time: emptyInstant,
  extent: '',
  description: '',
  concertProgramme: [],
  partOfSeries: false,
};

const emptyMusicalWorkPerformance: MusicalWorkPerformance = {
  type: 'MusicalWorkPerformance',
  title: '',
  composer: '',
  premiere: false,
};

const validationSchema = Yup.object<YupShape<Concert>>({
  partOfSeries: Yup.boolean(),
  place: Yup.object().shape({
    label: Yup.string().required(
      i18n.t('translation:feedback.validation.is_required', {
        field: i18n.t('translation:common.place'),
      })
    ),
  }),
  time: Yup.object().when('partOfSeries', (partOfSeries, schema) =>
    partOfSeries
      ? periodField
      : schema.shape({
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
        })
  ),

  extent: Yup.string().required(
    i18n.t('translation:feedback.validation.is_required', {
      field: i18n.t('translation:registration.resource_type.artistic.extent_in_minutes'),
    })
  ),
  concertProgramme: Yup.array()
    .of(
      Yup.object<YupShape<MusicalWorkPerformance>>({
        title: Yup.string().required(
          i18n.t('translation:feedback.validation.is_required', {
            field: i18n.t('translation:common.title'),
          })
        ),
        composer: Yup.string().required(
          i18n.t('translation:feedback.validation.is_required', {
            field: i18n.t('translation:registration.resource_type.artistic.composer'),
          })
        ),
        premiere: Yup.boolean(),
      })
    )
    .min(
      1,
      i18n.t('translation:feedback.validation.must_have_minimum', {
        min: 1,
        field: i18n.t('translation:registration.resource_type.artistic.musical_work_item').toLocaleLowerCase(),
      })
    ),
});

export const ConcertModal = ({ concert, onSubmit, open, closeModal }: ConcertModalProps) => {
  const { t } = useTranslation();

  const [removeWorkItemIndex, setRemoveWorkItemIndex] = useState(-1);
  const closeConfirmDialog = () => setRemoveWorkItemIndex(-1);

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
      <DialogTitle>
        {concert
          ? t('registration.resource_type.artistic.edit_concert')
          : t('registration.resource_type.artistic.add_concert')}
      </DialogTitle>
      <Formik
        initialValues={concert ?? emptyConcert}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }: FormikProps<Concert>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="partOfSeries">
                {({ field }: FieldProps<boolean>) => (
                  <FormControlLabel
                    data-testid={dataTestId.registrationWizard.resourceType.concertPartOfSeries}
                    label={t('registration.resource_type.artistic.concert_part_of_series')}
                    control={
                      <Checkbox
                        checked={field.value}
                        {...field}
                        onChange={(event) => {
                          if (!field.value) {
                            setFieldValue('time', emptyPeriod);
                          } else {
                            setFieldValue('time', emptyInstant);
                          }
                          field.onChange(event);
                        }}
                      />
                    }
                  />
                )}
              </Field>
              <Field name="place.label">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('common.place')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.concertPlace}
                  />
                )}
              </Field>

              {values.partOfSeries ? (
                <Box sx={{ display: 'flex', gap: '1rem' }}>
                  <PeriodFields fromFieldName="time.from" toFieldName="time.to" />
                </Box>
              ) : (
                <Field name="time.value">
                  {({ field, meta: { error, touched } }: FieldProps<string>) => (
                    <DatePicker
                      label={t('common.date')}
                      value={field.value ?? null}
                      onChange={(date) => {
                        !touched && setFieldTouched(field.name, true, false);
                        setFieldValue(field.name, date ?? '');
                      }}
                      format="dd.MM.yyyy"
                      /* mask="__.__.____" */
                      slotProps={{
                        popper: {
                          'aria-label': t('common.date'),
                        },
                        textField: {
                          inputProps: {
                            dataTestId: dataTestId.registrationWizard.resourceType.artisticOutputDate,
                            sx: { maxWidth: '15rem' },
                            variant: 'filled',
                            required: true,
                            error: touched && !!error,
                            helperText: <ErrorMessage name={field.name} />,
                          },
                        },
                      }}
                    />
                  )}
                </Field>
              )}

              <Field name="extent">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    sx={{ maxWidth: '15rem' }}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.extent_in_minutes')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.artisticOutputDuration}
                  />
                )}
              </Field>

              <FieldArray name="concertProgramme">
                {({ name, push, remove }: FieldArrayRenderProps) => (
                  <>
                    <Typography variant="h3">{t('registration.resource_type.artistic.concert_program')}</Typography>
                    {values.concertProgramme.map((_, index) => {
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
                                {...field}
                                control={
                                  <Checkbox
                                    checked={field.value}
                                    data-testid={`${dataTestId.registrationWizard.resourceType.concertProgramIsPremiere}-${index}`}
                                  />
                                }
                                label={t('registration.resource_type.artistic.premiere')}
                              />
                            )}
                          </Field>
                          <Button
                            variant="outlined"
                            color="error"
                            title={t('registration.resource_type.artistic.remove_music_work')}
                            onClick={() => setRemoveWorkItemIndex(index)}
                            sx={{ px: '2rem' }}
                            startIcon={<CancelIcon />}
                            data-testid={`${dataTestId.registrationWizard.resourceType.concertProgramRemove}-${index}`}>
                            {t('common.remove')}
                          </Button>
                        </Box>
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

                    <Button
                      variant="outlined"
                      sx={{ width: 'fit-content' }}
                      onClick={() => push(emptyMusicalWorkPerformance)}
                      startIcon={<AddIcon />}
                      data-testid={dataTestId.registrationWizard.resourceType.concertAddWork}>
                      {t('common.add')} {t('registration.resource_type.artistic.musical_work_item').toLocaleLowerCase()}
                    </Button>
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
