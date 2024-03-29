import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import {
  LiteraryArtsMonograph,
  UnconfirmedPublisher,
  emptyUnconfirmedPublisher,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { PagesMonograph, emptyPagesMonograph } from '../../../../../../types/publication_types/pages.types';
import { RegistrationDate, emptyRegistrationDate } from '../../../../../../types/registration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { isbnListField } from '../../../../../../utils/validation/registration/referenceValidation';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { IsbnField } from '../../../components/isbn_and_pages/IsbnField';
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
  isbnList: [],
  pages: emptyPagesMonograph,
};

const validationSchema = Yup.object<YupShape<LiteraryArtsMonograph>>({
  publisher: Yup.object<YupShape<UnconfirmedPublisher>>({
    name: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('registration.resource_type.artistic.publisher'),
      })
    ),
  }),
  publicationDate: Yup.object<YupShape<RegistrationDate>>({
    year: Yup.number()
      .min(
        1800,
        i18n.t('feedback.validation.must_be_bigger_than', {
          field: i18n.t('common.year'),
          limit: 1800,
        })
      )
      .max(
        2100,
        i18n.t('feedback.validation.must_be_smaller_than', {
          field: i18n.t('common.year'),
          limit: 2100,
        })
      )
      .typeError(
        i18n.t('feedback.validation.has_invalid_format', {
          field: i18n.t('common.year'),
        })
      )
      .required(
        i18n.t('feedback.validation.is_required', {
          field: i18n.t('common.year'),
        })
      ),
  }),
  pages: Yup.object<YupShape<PagesMonograph>>({
    pages: Yup.number().typeError(
      i18n.t('feedback.validation.has_invalid_format', {
        field: i18n.t('registration.resource_type.number_of_pages'),
      })
    ),
  }),
  isbnList: isbnListField,
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
                    data-testid={dataTestId.registrationWizard.resourceType.outputInstantDateField}
                  />
                )}
              </Field>
              <IsbnField fieldName="isbnList" />
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
