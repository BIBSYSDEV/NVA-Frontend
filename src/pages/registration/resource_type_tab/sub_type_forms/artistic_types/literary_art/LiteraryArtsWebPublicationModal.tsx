import { Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import {
  emptyUnconfirmedPublisher,
  LiteraryArtsWeb,
  UnconfirmedPublisher,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { emptyRegistrationDate, RegistrationDate } from '../../../../../../types/registration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';

interface LiteraryArtsWebPublicationModalProps {
  webPublication?: LiteraryArtsWeb;
  onSubmit: (webPublication: LiteraryArtsWeb) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyLiteraryArtsWeb: LiteraryArtsWeb = {
  type: 'LiteraryArtsWeb',
  id: '',
  publisher: emptyUnconfirmedPublisher,
  publicationDate: emptyRegistrationDate,
};

const validationSchema = Yup.object<YupShape<LiteraryArtsWeb>>({
  id: Yup.string()
    .url(
      i18n.t('feedback.validation.has_invalid_format', {
        field: i18n.t('registration.resource_type.artistic.web_link'),
      })
    )
    .required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('registration.resource_type.artistic.web_link'),
      })
    ),
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
        1950,
        i18n.t('feedback.validation.must_be_bigger_than', {
          field: i18n.t('common.year'),
          limit: 1950,
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
});

export const LiteraryArtsWebPublicationModal = ({
  webPublication,
  onSubmit,
  open,
  closeModal,
}: LiteraryArtsWebPublicationModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {webPublication
          ? t('registration.resource_type.artistic.edit_web_publication')
          : t('registration.resource_type.artistic.add_web_publication')}
      </DialogTitle>
      <Formik
        initialValues={webPublication ?? emptyLiteraryArtsWeb}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<LiteraryArtsWeb>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="id">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    type="url"
                    label={t('registration.resource_type.artistic.web_link')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.linkField}
                  />
                )}
              </Field>
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
                    data-testid={dataTestId.registrationWizard.resourceType.publicationDateField}
                  />
                )}
              </Field>
            </DialogContent>
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!webPublication} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
