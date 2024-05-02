import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogActions, Divider, IconButton, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { unpublishRegistration } from '../../../api/registrationApi';
import { Modal } from '../../../components/Modal';
import { RequiredDescription } from '../../../components/RequiredDescription';
import { setNotification } from '../../../redux/notificationSlice';
import i18n from '../../../translations/i18n';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { userCanUnpublishRegistration } from '../../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../../utils/urlPaths';
import { FindRegistration } from './FindRegistration';

interface DeleteForm {
  deleteMessage: string;
}

interface DeletePublicationProps {
  registration: Registration;
}

export const DeletePublication = ({ registration }: DeletePublicationProps) => {
  const [showDeleteField, setShowDeleteField] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedDuplicate, setSelectedDuplicate] = useState<Registration | null>(null);
  const history = useHistory();

  const userCanUnpublish = userCanUnpublishRegistration(registration);

  const deleteValidationSchema = Yup.object().shape({
    deleteMessage: Yup.string()
      .min(3, t('feedback.validation.must_be_bigger_than', { field: i18n.t('common.justification'), limit: 3 }))
      .required(t('feedback.validation.is_required', { field: i18n.t('common.justification') })),
  });

  const unpublishRegistrationMutation = useMutation({
    mutationFn: (values: DeleteForm) => {
      if (selectedDuplicate) {
        return unpublishRegistration(registration.identifier, {
          type: 'UnpublishPublicationRequest',
          duplicateOf: selectedDuplicate.id,
          comment: values.deleteMessage,
        });
      } else {
        return unpublishRegistration(registration.identifier, {
          type: 'UnpublishPublicationRequest',
          comment: values.deleteMessage,
        });
      }
    },
    onSuccess: () => {
      setShowDeleteModal(false);
      history.push(`${getRegistrationLandingPagePath(registration.identifier)}?shouldNotRedirect`);
    },
    onError: () => {
      dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' }));
    },
  });

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
        <Divider flexItem />
        <IconButton
          sx={{ width: 'fit-content', alignSelf: 'center', p: '0' }}
          data-testid={dataTestId.unpublishActions.showUnpublishButtonButton}
          title={t('common.show_more_options')}
          onClick={() => setShowDeleteField(!showDeleteField)}>
          {showDeleteField ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        {showDeleteField && (
          <>
            <Typography fontWeight="bold">{t('unpublish_actions.unpublish_header')}</Typography>
            {userCanUnpublish ? (
              <>
                <Typography>{t('unpublish_actions.unpublish_info')}</Typography>
                <Button
                  data-testid={dataTestId.unpublishActions.openUnpublishModalButton}
                  variant="outlined"
                  sx={{ bgcolor: 'white' }}
                  onClick={() => setShowDeleteModal(true)}>
                  {t('unpublish_actions.unpublish')}
                </Button>
              </>
            ) : (
              <Trans t={t} i18nKey="unpublish_actions.unpublish_not_allowed" components={[<Typography paragraph />]} />
            )}
          </>
        )}
      </Box>
      <Modal
        headingText={t('registration.delete_registration')}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <RequiredDescription />
          <Typography>{t('unpublish_actions.unpublish_registration_detail_1')}</Typography>
          <Typography>{t('unpublish_actions.unpublish_registration_detail_2')}</Typography>

          <Formik
            initialValues={{
              deleteMessage: '',
            }}
            validationSchema={deleteValidationSchema}
            onSubmit={(values) => unpublishRegistrationMutation.mutate(values)}>
            <Form noValidate>
              <Box sx={{ my: '1rem' }}>
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
                  {t('unpublish_actions.unpublish')}
                </LoadingButton>
              </DialogActions>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </>
  );
};
