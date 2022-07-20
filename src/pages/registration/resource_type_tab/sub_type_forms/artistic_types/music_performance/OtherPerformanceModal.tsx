import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  FormHelperText,
  Box,
} from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FieldArray, FieldArrayRenderProps, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDialog } from '../../../../../../components/ConfirmDialog';
import i18n from '../../../../../../translations/i18n';
import {
  MusicalWork,
  OtherMusicPerformance,
} from '../../../../../../types/publication_types/artisticRegistration.types';

interface OtherPerformanceModalProps {
  otherPerformance?: OtherMusicPerformance;
  onSubmit: (otherPerformance: OtherMusicPerformance) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyOtherPerformance: OtherMusicPerformance = {
  type: 'OtherPerformance',
  place: {
    type: 'UnconfirmedPlace',
    label: '',
    country: '',
  },
  performanceType: '',
  extent: '',
  musicalWorks: [],
};

const emptyMusicalWork: MusicalWork = {
  type: 'MusicalWork',
  title: '',
  composer: '',
};

const validationSchema = Yup.object().shape({
  place: Yup.object().shape({
    label: Yup.string().required(
      i18n.t('feedback:validation.is_required', {
        field: i18n.t('common:place'),
      })
    ),
  }),
  performanceType: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.artistic.performance_type'),
    })
  ),
  extent: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.artistic.extent_in_minutes'),
    })
  ),
  musicalWorks: Yup.array()
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
      })
    )
    .min(
      1,
      i18n.t('feedback:validation.must_have_minimum', {
        min: 1,
        field: i18n.t('registration:resource_type.artistic.musical_work_item').toLocaleLowerCase(),
      })
    ),
});

export const OtherPerformanceModal = ({ otherPerformance, onSubmit, open, closeModal }: OtherPerformanceModalProps) => {
  const { t } = useTranslation('registration');

  const [removeWorkItemIndex, setRemoveWorkItemIndex] = useState(-1);
  const closeConfirmDialog = () => setRemoveWorkItemIndex(-1);

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
      <DialogTitle>
        {otherPerformance
          ? t('resource_type.artistic.edit_other_performance')
          : t('resource_type.artistic.add_other_performance')}
      </DialogTitle>
      <Formik
        initialValues={otherPerformance ?? emptyOtherPerformance}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ values, errors, touched }: FormikProps<OtherMusicPerformance>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="performanceType">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('resource_type.artistic.performance_type')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Field name="place.label">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('common:place')}
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
                    sx={{ maxWidth: '15rem' }}
                    variant="filled"
                    fullWidth
                    label={t('resource_type.artistic.extent_in_minutes')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>

              <FieldArray name="musicalWorks">
                {({ name, push, remove }: FieldArrayRenderProps) => (
                  <>
                    <Typography variant="h3">{t('resource_type.artistic.musical_works')}</Typography>

                    {values.musicalWorks.map((_, index) => {
                      const baseFieldName = `${name}[${index}]`;
                      return (
                        <Box key={index} sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                          <Button
                            variant="outlined"
                            color="error"
                            title={t('resource_type.artistic.remove_other_performance')}
                            onClick={() => setRemoveWorkItemIndex(index)}
                            sx={{ px: '2rem' }}
                            startIcon={<DeleteIcon />}>
                            {t('common:remove')}
                          </Button>
                        </Box>
                      );
                    })}
                    <ConfirmDialog
                      title={t('resource_type.artistic.remove_other_performance')}
                      open={removeWorkItemIndex > -1}
                      onCancel={closeConfirmDialog}
                      onAccept={() => {
                        remove(removeWorkItemIndex);
                        closeConfirmDialog();
                      }}>
                      <Typography>{t('resource_type.artistic.remove_other_performance_description')}</Typography>
                    </ConfirmDialog>

                    <Button
                      variant="outlined"
                      sx={{ width: 'fit-content' }}
                      onClick={() => push(emptyMusicalWork)}
                      startIcon={<AddIcon />}>
                      {t('common:add')} {t('resource_type.artistic.musical_work_item').toLocaleLowerCase()}
                    </Button>
                    {!!touched.musicalWorks && typeof errors.musicalWorks === 'string' && (
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
              <Button variant="contained" type="submit" startIcon={<SaveIcon />}>
                {otherPerformance ? t('common:update') : t('common:add')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
