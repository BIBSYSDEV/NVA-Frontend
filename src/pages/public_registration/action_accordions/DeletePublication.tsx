import { Registration, UnpublishPublicationRequest } from '../../../types/registration.types';
import { Box, Breadcrumbs, Button, DialogActions, Divider, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FindRegistration } from './FindRegistration';
import { unpublishRegistration } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { RequiredDescription } from '../../../components/RequiredDescription';
import { dataTestId } from '../../../utils/dataTestIds';
import { useHistory } from 'react-router-dom';

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
  const [awatingUnpublishedResponse, setAwaitingUnpublishingResponse] = useState(false);
  const history = useHistory();

  const deleteValidationSchema = Yup.object().shape({
    deleteMessage: Yup.string()
      .min(3, t('unpublish_actions.unpublish_comment_min_length_feedback'))
      .required(t('unpublish_actions.unpublish_comment_required')),
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

    setAwaitingUnpublishingResponse(true);

    const unpublishingResponse = await unpublishRegistration(registration.identifier, unpublishRequest());
    setAwaitingUnpublishingResponse(false);
    if (isErrorStatus(unpublishingResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' }));
    }
    if (isSuccessStatus(unpublishingResponse.status)) {
      setShowDeleteModal(false);
      history.push(`/registration/${registration.identifier}?shouldNotRedirect`);
    }
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
          <Box>
            <RequiredDescription />
          </Box>
          <Box sx={{ gap: '1rem' }}>
            <Typography variant="h3">{t('unpublish_actions.unpublish_registration')}</Typography>
            <Typography>{t('unpublish_actions.unpublish_registration_detail_1')}</Typography>
            <Typography>{t('unpublish_actions.unpublish_registration_detail_2')}</Typography>
          </Box>

          <Formik
            initialValues={{
              deleteMessage: '',
            }}
            validationSchema={deleteValidationSchema}
            onSubmit={(values, _formikHelpers) => {
              handleDelete(values);
            }}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ my: '1rem' }}>
                  <Typography variant="h3">{t('registration.is_registration_error_question')}</Typography>
                  <Typography gutterBottom={true}>{t('unpublish_actions.unpublish_registration_reason')}</Typography>
                  <TextField
                    variant="filled"
                    fullWidth
                    id="deleteMessageId"
                    name="deleteMessage"
                    data-testid={dataTestId.unpublishActions.unpublishJustificationTextField}
                    label={t('common.justification')}
                    placeholder={t('common.fill_textfield')}
                    required={true}
                    value={values.deleteMessage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.deleteMessage && Boolean(errors.deleteMessage)}
                    helperText={touched.deleteMessage && errors.deleteMessage}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', my: '1rem' }}>
                  <Box sx={{ gap: '1rem' }}>
                    <Typography variant="h3">
                      {t('unpublish_actions.unpublish_registration_duplicate_question')}
                    </Typography>
                    <Typography>
                      {t('unpublish_actions.unpublish_registration_duplicate_citation_information')}
                    </Typography>
                  </Box>
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
                    loading={awatingUnpublishedResponse}
                    type="submit"
                    data-testid={dataTestId.unpublishActions.submitButton}
                    variant="outlined">
                    {t('common.save')}
                  </LoadingButton>
                </DialogActions>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};
