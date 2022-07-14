import React from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { datePickerTranslationProps } from '../../../../../../themes/mainTheme';
import { CinematicRelease } from '../../../../../../types/publication_types/artisticRegistration.types';
import { getNewDateValue } from '../../../../../../utils/registration-helpers';
import i18n from '../../../../../../translations/i18n';

interface CinematicReleaseModalProps {
  cinematicRelease?: CinematicRelease;
  onSubmit: (cinematicRelease: CinematicRelease) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyCinematicRelease: CinematicRelease = {
  type: 'CinematicRelease',
  place: {
    type: 'UnconfirmedPlace',
    label: '',
    country: '',
  },
  date: {
    type: 'Instant',
    value: '',
  },
};

const validationSchema = Yup.object().shape({
  place: Yup.object().shape({
    label: Yup.string().required(
      i18n.t('feedback:validation.is_required', {
        field: i18n.t('common:place'),
      })
    ),
  }),
  date: Yup.object().shape({
    value: Yup.string().required(
      i18n.t('feedback:validation.is_required', {
        field: i18n.t('registration:resource_type.artistic.premiere_date'),
      })
    ),
  }),
});

export const CinematicReleaseModal = ({ cinematicRelease, onSubmit, open, closeModal }: CinematicReleaseModalProps) => {
  const { t } = useTranslation('registration');

  return (
    <Dialog open={open} onClose={closeModal} maxWidth={'sm'} fullWidth>
      <DialogTitle>
        {cinematicRelease
          ? t('resource_type.artistic.edit_cinematic_release')
          : t('resource_type.artistic.add_cinematic_release')}
      </DialogTitle>
      <Formik
        initialValues={cinematicRelease ?? emptyCinematicRelease}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        <Form noValidate>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <Field name="date.value">
              {({ field, form: { setFieldTouched, setFieldValue }, meta: { error, touched } }: FieldProps<string>) => (
                <DatePicker
                  {...datePickerTranslationProps}
                  label={t('resource_type.artistic.premiere_date')}
                  value={field.value ?? null}
                  onChange={(date: Date | null, keyboardInput) => {
                    !touched && setFieldTouched(field.name, true, false);
                    const newValue = getNewDateValue(date, keyboardInput);
                    if (newValue !== null) {
                      setFieldValue(field.name, newValue);
                    }
                  }}
                  inputFormat="dd.MM.yyyy"
                  mask="__.__.____"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...field}
                      sx={{ maxWidth: '13rem' }}
                      variant="filled"
                      required
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                />
              )}
            </Field>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={closeModal}>
              {t('common:cancel')}
            </Button>
            <Button variant="contained" type="submit">
              {cinematicRelease ? t('common:update') : t('common:add')}
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
