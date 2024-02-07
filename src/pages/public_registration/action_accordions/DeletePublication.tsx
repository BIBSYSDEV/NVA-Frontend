import { Registration } from '../../../types/registration.types';
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

export interface UnpublishPublicationRequest {
  type: 'UnpublishPublicationRequest';
  duplicateOf?: string;
  comment: string;
}

interface DeleteForm {
  deleteMessage: string;
}

interface DeletePublicationProps {
  registration: Registration;
  refetchData: () => void;
}

const deleteValidationSchema = Yup.object().shape({
  deleteMessage: Yup.string().min(3, 'Begrunnelsen må minst være på 3 tegn').required('Begrunnelse er påkrevt'),
});

export const DeletePublication = ({ registration, refetchData }: DeletePublicationProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedDuplicate, setSelectedDuplicate] = useState<Registration | null>(null);
  const [awatingUnpublishedResponse, setAwaitingUnpublishingResponse] = useState(false);

  const handleDelete = async (values: DeleteForm) => {
    const unpublishRequest = (): UnpublishPublicationRequest => {
      return selectedDuplicate
        ? {
            type: 'UnpublishPublicationRequest',
            duplicateOf: selectedDuplicate.identifier,
            comment: values.deleteMessage,
          }
        : { type: 'UnpublishPublicationRequest', comment: values.deleteMessage };
    };

    setAwaitingUnpublishingResponse(true);

    const unpublishingResponse = await unpublishRegistration(registration, unpublishRequest());
    setAwaitingUnpublishingResponse(false);
    if (isErrorStatus(unpublishingResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' }));
    }
    if (isSuccessStatus(unpublishingResponse.status)) {
      setShowDeleteModal(false);
      refetchData();
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
          <Button data-testid={'open delete modal'} variant="outlined" onClick={() => setShowDeleteModal(true)}>
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
            <Typography variant="h3">{t('registration.unpublish_registration')}</Typography>
            <Typography>{t('registration.unpublish_registration_detail_1')}</Typography>
            <Typography>{t('registration.unpublish_registration_detail_2')}</Typography>
          </Box>

          <Formik
            initialValues={{
              deleteMessage: '',
            }}
            validationSchema={deleteValidationSchema}
            onSubmit={(values, formikHelpers) => {
              handleDelete(values);
            }}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ my: '1rem' }}>
                  <Typography variant="h3">{t('registration.is_registration_error_question')}</Typography>
                  <Typography gutterBottom={true}>{t('registration.unpublish_registration_reason')}</Typography>
                  <TextField
                    variant="filled"
                    fullWidth
                    id="deleteMessageId"
                    name="deleteMessage"
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
                    <Typography variant="h3">{t('registration.unpublish_registration_duplicate_question')}</Typography>
                    <Typography>{t('registration.unpublish_registration_duplicate_citation_information')}</Typography>
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
                    data-testid={'delete-registration-button'}
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
