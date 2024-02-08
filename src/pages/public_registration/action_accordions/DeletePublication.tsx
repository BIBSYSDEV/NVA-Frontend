import { Registration, UnpublishPublicationRequest } from '../../../types/registration.types';
import { Box, Breadcrumbs, Button, DialogActions, Divider, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FindRegistration } from './FindRegistration';
import { unpublishRegistration } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { RequiredDescription } from '../../../components/RequiredDescription';
import { dataTestId } from '../../../utils/dataTestIds';
import { useHistory } from 'react-router-dom';
import i18n from '../../../translations/i18n';
import { useMutation } from '@tanstack/react-query';

interface DeleteForm {
  deleteMessage: string;
}

interface DeletePublicationProps {
  registration: Registration;
}

export const DeletePublication = ({ registration }: DeletePublicationProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedDuplicate, setSelectedDuplicate] = useState<Registration | null>(null);
  const history = useHistory();

  const deleteValidationSchema = Yup.object().shape({
    deleteMessage: Yup.string()
      .min(3, t('feedback.validation.must_be_bigger_than', { field: i18n.t('common.justification'), limit: 3 }))
      .required(t('feedback.validation.is_required', { field: i18n.t('common.justification') })),
  });

  const unpublishRegistrationMutation = useMutation({
    mutationFn: (unpublishRequest: UnpublishPublicationRequest) =>
      unpublishRegistration(registration.identifier, unpublishRequest),
    onSuccess: () => {
      setShowDeleteModal(false);
      history.push(`/registration/${registration.identifier}?shouldNotRedirect`);
    },
    onError: () => {
      dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' }));
    },
  });

  const handleDelete = async (values: DeleteForm) => {
    const unpublishRequest = (): UnpublishPublicationRequest => {
      return selectedDuplicate
        ? {
            type: 'UnpublishPublicationRequest',
            duplicateOf: selectedDuplicate.id,
            comment: values.deleteMessage,
          }
        : { type: 'UnpublishPublicationRequest', comment: values.deleteMessage };
    };
    unpublishRegistrationMutation.mutate(unpublishRequest());
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem' }}>
        <Divider />
        <Breadcrumbs
          sx={{ alignSelf: 'center' }}
          itemsBeforeCollapse={0}
          itemsAfterCollapse={0}
          maxItems={0}
          aria-label={t('common.show_more_options')}>
          <Button
            data-testid={dataTestId.unpublishActions.openUnpublishModalButton}
            variant="outlined"
            onClick={() => setShowDeleteModal(true)}>
            {t('common.delete')}
          </Button>
        </Breadcrumbs>
      </Box>
      <Modal
        dataTestId="delete-registration-modal"
        headingText={t('registration.delete_registration')}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <RequiredDescription />
          <Typography variant="h3">{t('unpublish_actions.unpublish_registration')}</Typography>
          <Typography>{t('unpublish_actions.unpublish_registration_detail_1')}</Typography>
          <Typography>{t('unpublish_actions.unpublish_registration_detail_2')}</Typography>

          <Formik
            initialValues={{
              deleteMessage: '',
            }}
            validationSchema={deleteValidationSchema}
            onSubmit={handleDelete}>
            <Form noValidate>
              <Box sx={{ my: '1rem' }}>
                <Typography variant="h3">{t('registration.is_registration_error_question')}</Typography>
                <Typography gutterBottom>{t('unpublish_actions.unpublish_registration_reason')}</Typography>
                <Field name="deleteMessage">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      required
                      data-testid={dataTestId.unpublishActions.unpublishJustificationTextField}
                      variant="filled"
                      fullWidth
                      label={t('common.justification')}
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', my: '1rem' }}>
                <Typography variant="h3">{t('unpublish_actions.unpublish_registration_duplicate_question')}</Typography>
                <Typography>{t('unpublish_actions.unpublish_registration_duplicate_citation_information')}</Typography>
              </Box>
              <FindRegistration
                setSelectedRegistration={setSelectedDuplicate}
                selectedRegistration={selectedDuplicate}
                filteredRegistrationIdentifier={registration.identifier}
              />
              <DialogActions>
                <Button data-testid={'close-delete-modal'} onClick={() => setShowDeleteModal(false)}>
                  {t('common.cancel')}
                </Button>
                <LoadingButton
                  loading={unpublishRegistrationMutation.isLoading}
                  type="submit"
                  data-testid={dataTestId.unpublishActions.submitButton}
                  variant="outlined">
                  {t('common.save')}
                </LoadingButton>
              </DialogActions>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </>
  );
};
