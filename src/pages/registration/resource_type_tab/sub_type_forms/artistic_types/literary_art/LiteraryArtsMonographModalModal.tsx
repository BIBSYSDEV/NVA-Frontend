import { Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import {
  emptyUnconfirmedPublisher,
  LiteraryArtsMonograph,
  UnconfirmedPublisher,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { emptyPagesMonograph, PagesMonograph } from '../../../../../../types/publication_types/pages.types';
import { emptyRegistrationDate, RegistrationDate } from '../../../../../../types/registration.types';
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
  publisher: Yup.object<YupShape<UnconfirmedPublisher>>({
    name: Yup.string().required(
      i18n.t('translation:feedback.validation.is_required', {
        field: i18n.t('translation:registration.resource_type.artistic.publisher'),
      })
    ),
  }),
  publicationDate: Yup.object<YupShape<RegistrationDate>>({
    year: Yup.number()
      .min(
        1800,
        i18n.t('translation:feedback.validation.must_be_bigger_than', {
          field: i18n.t('translation:common.year'),
          limit: 1800,
        })
      )
      .max(
        2100,
        i18n.t('translation:feedback.validation.must_be_smaller_than', {
          field: i18n.t('translation:common.year'),
          limit: 2100,
        })
      )
      .typeError(
        i18n.t('translation:feedback.validation.has_invalid_format', {
          field: i18n.t('translation:common.year'),
        })
      )
      .required(
        i18n.t('translation:feedback.validation.is_required', {
          field: i18n.t('translation:common.year'),
        })
      ),
  }),
  pages: Yup.object<YupShape<PagesMonograph>>({
    pages: Yup.number().typeError(
      i18n.t('translation:feedback.validation.has_invalid_format', {
        field: i18n.t('translation:registration.resource_type.number_of_pages'),
      })
    ),
  }),
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
        {({ isSubmitting }: FormikProps<LiteraryArtsMonograph>) => (
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
                  <TextField
                    {...field}
                    variant="filled"
                    label={t('common.year')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.artisticOutputDate}
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
