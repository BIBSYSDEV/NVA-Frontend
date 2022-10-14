import { Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Formik, Form, Field, FieldProps, ErrorMessage, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import {
  emptyUnconfirmedPublisher,
  LiteraryArtsMonograph,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { emptyPagesMonograph } from '../../../../../../types/publication_types/pages.types';
import { emptyRegistrationDate } from '../../../../../../types/registration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';

interface LiteraryArtsMonographModalProps {
  literaryArtsMonograph?: LiteraryArtsMonograph;
  onSubmit: (literaryArtsMonograph: LiteraryArtsMonograph) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyLiteraryArtsMonograph: LiteraryArtsMonograph = {
  type: 'LiteraryArtsMonograph',
  publisher: emptyUnconfirmedPublisher,
  publicationDate: emptyRegistrationDate,
  isbn: '',
  pages: emptyPagesMonograph,
};

const validationSchema = Yup.object<YupShape<LiteraryArtsMonograph>>({
  publisher: Yup.object({
    name: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('registration.resource_type.artistic.publisher'),
      })
    ),
  }),
  publicationDate: Yup.object({
    year: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('common.year'),
      })
    ),
  }),
  isbn: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.isbn'),
    })
  ),
});

export const LiteraryArtsMonographModal = ({
  literaryArtsMonograph,
  onSubmit,
  open,
  closeModal,
}: LiteraryArtsMonographModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {literaryArtsMonograph
          ? t('registration.resource_type.artistic.edit_book')
          : t('registration.resource_type.artistic.add_book')}
      </DialogTitle>
      <Formik
        initialValues={literaryArtsMonograph ?? emptyLiteraryArtsMonograph}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting, setFieldTouched, setFieldValue }: FormikProps<LiteraryArtsMonograph>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="publisher.name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.publisher')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.publisherNameField}
                  />
                )}
              </Field>
              <Field name="publicationDate.year">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <DatePicker
                    label={t('common.year')}
                    PopperProps={{
                      'aria-label': t('common.year'),
                    }}
                    value={field.value ?? null}
                    onChange={(date) => {
                      !touched && setFieldTouched(field.name, true, false);
                      setFieldValue(field.name, date ?? '');
                    }}
                    inputFormat="yyyy"
                    views={['year']}
                    mask="____"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        required
                        onBlur={() => !touched && setFieldTouched(field.name)}
                        error={touched && !!error}
                        helperText={<ErrorMessage name={field.name} />}
                        data-testid={dataTestId.registrationWizard.resourceType.publicationDateField}
                      />
                    )}
                  />
                )}
              </Field>
              <Field name="isbn">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.isbn')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.isbnField}
                  />
                )}
              </Field>
              <Field name="pages.pages">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.number_of_pages')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.pagesField}
                  />
                )}
              </Field>
            </DialogContent>
            <OutputModalActions
              isSubmitting={isSubmitting}
              closeModal={closeModal}
              isAddAction={!literaryArtsMonograph}
            />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
