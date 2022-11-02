import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, CircularProgress, DialogActions, TextField, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useTranslation } from 'react-i18next';
import { validateYupSchema, yupToFormErrors } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { RootState } from '../../redux/store';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/notificationSlice';
import { RegistrationStatus, Registration } from '../../types/registration.types';
import { addTicketMessage, createTicket, updateTicketStatus } from '../../api/registrationApi';
import { registrationValidationSchema } from '../../utils/validation/registration/registrationValidation';
import { getRegistrationPath } from '../../utils/urlPaths';
import { getFirstErrorTab, getTabErrors, TabErrors } from '../../utils/formik-helpers';
import { ErrorList } from '../registration/ErrorList';
import { dataTestId } from '../../utils/dataTestIds';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { userIsCuratorForRegistration, userIsRegistrationCurator } from '../../utils/registration-helpers';
import { useFetch } from '../../utils/hooks/useFetch';
import { TicketCollection, TicketStatus } from '../../types/publication_types/messages.types';
import { BackgroundDiv } from '../../components/styled/Wrappers';

enum LoadingState {
  None,
  Publish,
  RequestDoi,
  RejectDoi,
  ApproveDoi,
  ApprovePublishRequest,
  RejectPublishRequest,
}

interface PublicRegistrationStatusBarProps extends PublicRegistrationContentProps {
  refetchRegistration: () => void;
}

export const PublicRegistrationStatusBar = ({
  registration,
  refetchRegistration,
}: PublicRegistrationStatusBarProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const { identifier, doi } = registration;

  const [messageToCurator, setMessageToCurator] = useState('');
  const [openRequestDoiModal, setOpenRequestDoiModal] = useState(false);
  const [isLoading, setIsLoading] = useState(LoadingState.None);
  const toggleRequestDoiModal = () => setOpenRequestDoiModal((state) => !state);
  const [tabErrors, setTabErrors] = useState<TabErrors>();

  const [registrationTicketCollection, isLoadingRegistrationTicketCollection] = useFetch<TicketCollection>({
    url: userIsCuratorForRegistration(user, registration) ? `${registration.id}/tickets` : '',
    withAuthentication: true,
    errorMessage: t('feedback.error.get_tickets'),
  });
  const registrationTickets = registrationTicketCollection?.tickets ?? [];

  const pendingDoiRequestTicket = registrationTickets.find(
    (ticket) => ticket.type === 'DoiRequest' && ticket.status === 'Pending'
  );
  const pendingPublishingRequestTicket = registrationTickets.find(
    (ticket) => ticket.type === 'PublishingRequest' && ticket.status === 'Pending'
  );

  const sendDoiRequest = async () => {
    setIsLoading(LoadingState.RequestDoi);
    const message = isPublishedRegistration ? messageToCurator : t('registration.public_page.reserve_doi_message');

    const createDoiRequestResponse = await createTicket(registration.id, 'DoiRequest');
    if (isErrorStatus(createDoiRequestResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_doi_request'), variant: 'error' }));
      setIsLoading(LoadingState.None);
    } else if (isSuccessStatus(createDoiRequestResponse.status)) {
      const ticketId = createDoiRequestResponse.data.id;
      // Add message
      if (ticketId && message) {
        await addTicketMessage(ticketId, message);
        // No need to show potential error message, since Ticket with actual DoiRequest is created anyway
      }
      // TODO: Adding DOI can take some extra time, so wait 10 sec before refetching
      setTimeout(() => {
        if (openRequestDoiModal) {
          toggleRequestDoiModal();
        }
        dispatch(setNotification({ message: t('feedback.success.doi_request_sent'), variant: 'success' }));
        refetchRegistration();
      }, 10_000);
    }
  };

  const updatePendingDoiRequest = async (status: TicketStatus) => {
    if (pendingDoiRequestTicket) {
      if (status === 'Completed') {
        setIsLoading(LoadingState.ApproveDoi);
      } else {
        setIsLoading(LoadingState.RejectDoi);
      }

      const updateTicketStatusResponse = await updateTicketStatus(pendingDoiRequestTicket.id, 'DoiRequest', status);
      if (isErrorStatus(updateTicketStatusResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_doi_request'), variant: 'error' }));
        setIsLoading(LoadingState.None);
      } else if (isSuccessStatus(updateTicketStatusResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.doi_request_updated'), variant: 'success' }));
        refetchRegistration();
      }
    }
  };

  const updatePendingPublishingRequest = async (status: TicketStatus) => {
    if (pendingPublishingRequestTicket) {
      if (status === 'Completed') {
        setIsLoading(LoadingState.ApprovePublishRequest);
      } else {
        setIsLoading(LoadingState.RejectPublishRequest);
      }

      const updateTicketStatusResponse = await updateTicketStatus(
        pendingPublishingRequestTicket.id,
        'PublishingRequest',
        status
      );
      if (isErrorStatus(updateTicketStatusResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_publishing_request'), variant: 'error' }));
        setIsLoading(LoadingState.None);
      } else if (isSuccessStatus(updateTicketStatusResponse.status)) {
        // TODO: Updating status of PublishingRequest can take some time, so wait 10 sec before refetching
        setTimeout(() => {
          if (status === 'Completed') {
            dispatch(
              setNotification({ message: t('feedback.success.publishing_request_approved'), variant: 'success' })
            );
          } else {
            dispatch(
              setNotification({ message: t('feedback.success.publishing_request_rejected'), variant: 'success' })
            );
          }
          refetchRegistration();
        }, 10_000);
      }
    }
  };

  const onClickPublish = async () => {
    setIsLoading(LoadingState.Publish);
    const createPublishingRequestTicketResponse = await createTicket(registration.id, 'PublishingRequest');
    if (isErrorStatus(createPublishingRequestTicketResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_publishing_request'), variant: 'error' }));
      setIsLoading(LoadingState.None);
    } else if (isSuccessStatus(createPublishingRequestTicketResponse.status)) {
      // TODO: Creating PublishingRequest can take some time, so wait 10 sec before refetching
      setTimeout(() => {
        dispatch(setNotification({ message: t('feedback.success.create_publishing_request'), variant: 'success' }));
        refetchRegistration();
      }, 10_000);
    }
  };

  useEffect(() => {
    const publicationInstance = registration.entityDescription?.reference?.publicationInstance;
    const contentType =
      publicationInstance && 'contentType' in publicationInstance ? publicationInstance.contentType : null;
    try {
      validateYupSchema<Registration>(registration, registrationValidationSchema, true, {
        publicationInstanceType: publicationInstance?.type ?? '',
        publicationStatus: registration.status,
        contentType,
      });
    } catch (error) {
      const formErrors = yupToFormErrors(error);
      const customErrors = getTabErrors(registration, formErrors);
      setTabErrors(customErrors);
    }
  }, [registration]);

  const firstErrorTab = getFirstErrorTab(tabErrors);
  const registrationIsValid = !tabErrors || firstErrorTab === -1;

  const isCurator = userIsRegistrationCurator(user, registration);
  const hasNvaDoi = !!doi;
  const isPublishedRegistration = registration.status === RegistrationStatus.Published;

  return (
    <div>
      {!registrationIsValid && tabErrors && (
        <ErrorList
          tabErrors={tabErrors}
          description={
            <>
              <Typography variant="h4" component="h1">
                {registration.status === RegistrationStatus.Published
                  ? t('registration.public_page.published')
                  : t('registration.public_page.not_published')}
              </Typography>
              <Typography>{t('registration.public_page.error_description')}</Typography>
            </>
          }
          actions={
            <Button
              variant="contained"
              color="inherit"
              component={RouterLink}
              to={`${getRegistrationPath(identifier)}?tab=${firstErrorTab}`}
              endIcon={<EditIcon />}
              data-testid={dataTestId.registrationLandingPage.backToWizard}>
              {t('registration.public_page.go_back_to_wizard')}
            </Button>
          }
        />
      )}
      <BackgroundDiv data-testid={dataTestId.registrationLandingPage.status}>
        {!isPublishedRegistration && registrationIsValid && (
          <>
            <Typography variant="h4" component="h1">
              {t('registration.public_page.ready_to_be_published')}
            </Typography>
            <Typography gutterBottom>{t('registration.public_page.ready_to_be_published_description')}</Typography>
          </>
        )}
        {isPublishedRegistration && (
          <Typography variant="h4" component="h1" gutterBottom>
            {t('registration.public_page.published_date', {
              date: registration.publishedDate ? new Date(registration.publishedDate).toLocaleDateString() : '',
              interpolation: { escapeValue: false },
            })}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          {registration.status === RegistrationStatus.Draft &&
            !isLoadingRegistrationTicketCollection &&
            !pendingPublishingRequestTicket && (
              <LoadingButton
                disabled={!!isLoading || !registrationIsValid}
                data-testid={dataTestId.registrationLandingPage.publishButton}
                color="secondary"
                variant="contained"
                endIcon={<CloudUploadIcon />}
                loadingPosition="end"
                onClick={onClickPublish}
                loading={isLoading === LoadingState.Publish}>
                {t('common.publish')}
              </LoadingButton>
            )}

          {!hasNvaDoi && (
            <>
              <LoadingButton
                variant="outlined"
                endIcon={<LocalOfferIcon />}
                loadingPosition="end"
                loading={isLoading === LoadingState.RequestDoi}
                data-testid={
                  isPublishedRegistration
                    ? dataTestId.registrationLandingPage.requestDoiButton
                    : dataTestId.registrationLandingPage.reserveDoiButton
                }
                onClick={() => (isPublishedRegistration ? toggleRequestDoiModal() : sendDoiRequest())}>
                {isPublishedRegistration
                  ? t('registration.public_page.request_doi')
                  : t('registration.public_page.reserve_doi')}
              </LoadingButton>
              <Modal
                open={openRequestDoiModal}
                onClose={toggleRequestDoiModal}
                headingText={t('registration.public_page.request_doi')}
                dataTestId={dataTestId.registrationLandingPage.requestDoiModal}>
                <Typography paragraph>{t('registration.public_page.request_doi_description')}</Typography>
                <TextField
                  variant="outlined"
                  multiline
                  rows="4"
                  fullWidth
                  data-testid={dataTestId.registrationLandingPage.doiMessageField}
                  label={t('registration.public_page.message_to_curator')}
                  onChange={(event) => setMessageToCurator(event.target.value)}
                />
                <DialogActions>
                  <Button onClick={toggleRequestDoiModal}>{t('common.cancel')}</Button>
                  <LoadingButton
                    variant="contained"
                    data-testid={dataTestId.registrationLandingPage.sendDoiButton}
                    onClick={sendDoiRequest}
                    loading={isLoading === LoadingState.RequestDoi}>
                    {t('common.send')}
                  </LoadingButton>
                </DialogActions>
              </Modal>
            </>
          )}

          {isCurator ? (
            isLoadingRegistrationTicketCollection ? (
              <CircularProgress />
            ) : (
              <>
                {!isPublishedRegistration && pendingPublishingRequestTicket && (
                  <>
                    <LoadingButton
                      variant="contained"
                      data-testid={dataTestId.registrationLandingPage.publishingRequestAcceptButton}
                      endIcon={<CheckIcon />}
                      loadingPosition="end"
                      onClick={() => updatePendingPublishingRequest('Completed')}
                      loading={isLoading === LoadingState.ApprovePublishRequest}
                      disabled={!!isLoading || !registrationIsValid}>
                      {t('registration.public_page.approve_publish_request')}
                    </LoadingButton>
                    <LoadingButton
                      variant="contained"
                      data-testid={dataTestId.registrationLandingPage.publishingRequestRejectButton}
                      endIcon={<CloseIcon />}
                      loadingPosition="end"
                      onClick={() => updatePendingPublishingRequest('Closed')}
                      loading={isLoading === LoadingState.RejectPublishRequest}
                      disabled={!!isLoading}>
                      {t('registration.public_page.reject_publish_request')}
                    </LoadingButton>
                  </>
                )}
                {isPublishedRegistration && pendingDoiRequestTicket && (
                  <>
                    <LoadingButton
                      variant="contained"
                      data-testid={dataTestId.registrationLandingPage.createDoiButton}
                      endIcon={<CheckIcon />}
                      loadingPosition="end"
                      onClick={() => updatePendingDoiRequest('Completed')}
                      loading={isLoading === LoadingState.ApproveDoi}
                      disabled={!!isLoading || !registrationIsValid}>
                      {t('common.create_doi')}
                    </LoadingButton>
                    <LoadingButton
                      variant="contained"
                      data-testid={dataTestId.registrationLandingPage.rejectDoiButton}
                      endIcon={<CloseIcon />}
                      loadingPosition="end"
                      onClick={() => updatePendingDoiRequest('Closed')}
                      loading={isLoading === LoadingState.RejectDoi}
                      disabled={!!isLoading}>
                      {t('common.reject_doi')}
                    </LoadingButton>
                  </>
                )}
              </>
            )
          ) : null}
        </Box>
      </BackgroundDiv>
    </div>
  );
};
