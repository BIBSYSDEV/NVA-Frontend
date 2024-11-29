import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import { emptyInstant, emptyPlace } from '../../../../../../types/common.types';
import { CinematicRelease } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';

interface CinematicReleaseModalProps {
  cinematicRelease?: CinematicRelease;
  onSubmit: (cinematicRelease: CinematicRelease) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyCinematicRelease: CinematicRelease = {
  type: 'CinematicRelease',
  place: emptyPlace,
  date: emptyInstant,
};

const validationSchema = Yup.object<YupShape<CinematicRelease>>({
  place: Yup.object().shape({
    name: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('common.place'),
      })
    ),
  }),
  date: Yup.object().shape({
    value: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('registration.resource_type.artistic.premiere_date'),
      })
    ),
  }),
});

export const CinematicReleaseModal = ({ cinematicRelease, onSubmit, open, closeModal }: CinematicReleaseModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
      <DialogTitle>
        {cinematicRelease
          ? t('registration.resource_type.artistic.edit_cinematic_release')
          : t('registration.resource_type.artistic.add_cinematic_release')}
      </DialogTitle>
      <Formik
        initialValues={cinematicRelease ?? emptyCinematicRelease}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<CinematicRelease>) => (
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
              <Field name="date.value">
                {({
                  field,
                  form: { setFieldTouched, setFieldValue },
                  meta: { error, touched },
                }: FieldProps<string>) => (
                  <DatePicker
                    label={t('registration.resource_type.artistic.premiere_date')}
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      if (!touched) {
                        setFieldTouched(field.name, true, false);
                      }
                      setFieldValue(field.name, date);
                    }}
                    slotProps={{
                      textField: {
                        inputProps: {
                          'data-testid': dataTestId.registrationWizard.resourceType.outputInstantDateField,
                        },
                        sx: { maxWidth: '13rem' },
                        variant: 'filled',
                        required: true,
                        error: touched && !!error,
                        helperText: <ErrorMessage name={field.name} />,
                      },
                    }}
                  />
                )}
              </Field>
            </DialogContent>

            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!cinematicRelease} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
