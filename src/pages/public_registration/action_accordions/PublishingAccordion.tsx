import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateYupSchema, yupToFormErrors } from 'formik';
import { dataTestId } from '../../../utils/dataTestIds';
import { getFirstErrorTab, getTabErrors, TabErrors } from '../../../utils/formik-helpers';
import { getRegistrationWizardPath } from '../../../utils/urlPaths';
import { ErrorList } from '../../registration/ErrorList';
import { Ticket, TicketStatus } from '../../../types/publication_types/messages.types';
import { Registration, RegistrationStatus } from '../../../types/registration.types';
import { createTicket, updateTicketStatus } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { registrationValidationSchema } from '../../../utils/validation/registration/registrationValidation';
import { RootState } from '../../../redux/store';

interface PublishingAccordionProps {
  registration: Registration;
  refetchRegistrationAndTickets: () => void;
  publishingRequestTicket: Ticket | null;
  userIsCurator: boolean;
}

enum LoadingState {
  CreatePublishingREquest,
  ApprovePulishingRequest,
  RejectPublishingRequest,
  None,
}

export const PublishingAccordion = ({
  publishingRequestTicket,
  registration,
  refetchRegistrationAndTickets,
  userIsCurator,
}: PublishingAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { customer } = useSelector((store: RootState) => store);

  const [isLoading, setIsLoading] = useState(LoadingState.None);
  const [registrationIsValid, setRegistrationIsValid] = useState(false);

  const [tabErrors, setTabErrors] = useState<TabErrors>();
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
      setRegistrationIsValid(true);
    } catch (error) {
      const formErrors = yupToFormErrors(error);
      const customErrors = getTabErrors(registration, formErrors);
      setTabErrors(customErrors);
    }
  }, [registration]);

  const firstErrorTab = getFirstErrorTab(tabErrors);

  const onClickPublish = async () => {
    setIsLoading(LoadingState.CreatePublishingREquest);
    const createPublishingRequestTicketResponse = await createTicket(registration.id, 'PublishingRequest');
    if (isErrorStatus(createPublishingRequestTicketResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_publishing_request'), variant: 'error' }));
      setIsLoading(LoadingState.None);
    } else if (isSuccessStatus(createPublishingRequestTicketResponse.status)) {
      dispatch(setNotification({ message: t('feedback.success.create_publishing_request'), variant: 'success' }));
      refetchRegistrationAndTickets();
    }
  };

  const updatePendingPublishingRequest = async (status: TicketStatus) => {
    if (publishingRequestTicket) {
      if (status === 'Completed') {
        setIsLoading(LoadingState.ApprovePulishingRequest);
      } else {
        setIsLoading(LoadingState.RejectPublishingRequest);
      }

      const updateTicketStatusResponse = await updateTicketStatus(
        publishingRequestTicket.id,
        'PublishingRequest',
        status
      );
      if (isErrorStatus(updateTicketStatusResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_publishing_request'), variant: 'error' }));
        setIsLoading(LoadingState.None);
      } else if (isSuccessStatus(updateTicketStatusResponse.status)) {
        if (status === 'Completed') {
          dispatch(setNotification({ message: t('feedback.success.publishing_request_approved'), variant: 'success' }));
        } else {
          dispatch(setNotification({ message: t('feedback.success.publishing_request_rejected'), variant: 'success' }));
        }
        refetchRegistrationAndTickets();
      }
    }
  };

  const registratorPublishesMetadataAndFiles = customer?.publicationWorkflow === 'RegistratorPublishesMetadataAndFiles';
  const registratorPublishesMetadataOnly = customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly';
  const registratorRequiresApprovalForMetadataAndFiles =
    customer?.publicationWorkflow === 'RegistratorRequiresApprovalForMetadataAndFiles';

  const isDraftRegistration = registration.status === RegistrationStatus.Draft;
  const isPublishedRegistration = registration.status === RegistrationStatus.Published;
  const hasUnpublishedFiles = registration.associatedArtifacts.some((artifact) => artifact.type === 'UnpublishedFile');

  const hasClosedTicket = publishingRequestTicket?.status === 'Closed';
  const hasPendingTicket = publishingRequestTicket?.status === 'Pending';
  const hasCompletedTicket = publishingRequestTicket?.status === 'Completed';

  const canHandlePublishingRequest = userIsCurator && !registratorPublishesMetadataAndFiles && hasPendingTicket;

  const mismatchingPublishedStatusWorkflow1 =
    registratorPublishesMetadataAndFiles && !!publishingRequestTicket && isDraftRegistration;
  const mismatchingPublishedStatusWorkflow2 =
    registratorPublishesMetadataOnly &&
    !!publishingRequestTicket &&
    (isDraftRegistration || (hasCompletedTicket && hasUnpublishedFiles));
  const mismatchingPublishedStatusWorkflow3 =
    registratorRequiresApprovalForMetadataAndFiles && hasCompletedTicket && isDraftRegistration;

  const hasMismatchingPublishedStatus =
    mismatchingPublishedStatusWorkflow1 || mismatchingPublishedStatusWorkflow2 || mismatchingPublishedStatusWorkflow3;

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAccordion}
      elevation={3}
      defaultExpanded={isDraftRegistration || canHandlePublishingRequest || hasMismatchingPublishedStatus}>
      <AccordionSummary sx={{ fontWeight: 700 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
        {t('registration.public_page.publishing_request')} - {t(`registration.status.${registration.status}`)}
        {!registrationIsValid && (
          <Tooltip title={t('registration.public_page.validation_errors')}>
            <WarningIcon color="warning" sx={{ ml: '0.5rem' }} />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {tabErrors && (
          <ErrorList
            tabErrors={tabErrors}
            description={<Typography>{t('registration.public_page.error_description')}</Typography>}
            actions={
              <Button
                variant="outlined"
                component={RouterLink}
                to={`${getRegistrationWizardPath(registration.identifier)}?tab=${firstErrorTab}`}
                endIcon={<EditIcon />}
                data-testid={dataTestId.registrationLandingPage.tasksPanel.backToWizard}>
                {t('registration.public_page.go_back_to_wizard')}
              </Button>
            }
          />
        )}

        {registration.status === RegistrationStatus.Published && (
          <Typography paragraph>
            {t('registration.public_page.published_date', {
              date: registration.publishedDate ? new Date(registration.publishedDate).toLocaleDateString() : '',
              interpolation: { escapeValue: false },
            })}
          </Typography>
        )}

        {hasMismatchingPublishedStatus && (
          <>
            <Typography gutterBottom>
              {hasUnpublishedFiles && isPublishedRegistration
                ? t('registration.public_page.tasks_panel.files_will_soon_be_published')
                : t('registration.public_page.tasks_panel.registration_will_soon_be_published')}
            </Typography>
            <Button
              variant="outlined"
              onClick={refetchRegistrationAndTickets}
              startIcon={<RefreshIcon />}
              data-testid={dataTestId.registrationLandingPage.tasksPanel.refreshPublishingRequestButton}>
              {t('registration.public_page.tasks_panel.reload')}
            </Button>
          </>
        )}

        {publishingRequestTicket &&
          !hasMismatchingPublishedStatus &&
          isDraftRegistration &&
          (registratorPublishesMetadataOnly ? (
            <Typography paragraph>
              {hasClosedTicket
                ? t('registration.public_page.tasks_panel.has_rejected_files_publishing_request')
                : hasPendingTicket
                ? t('registration.public_page.tasks_panel.metadata_published_waiting_for_files')
                : ''}
            </Typography>
          ) : registratorRequiresApprovalForMetadataAndFiles ? (
            <Typography paragraph>
              {hasClosedTicket
                ? t('registration.public_page.tasks_panel.has_rejected_publishing_request')
                : hasPendingTicket
                ? t('registration.public_page.tasks_panel.waiting_for_publishing_approval')
                : ''}
            </Typography>
          ) : null)}

        {!publishingRequestTicket && isDraftRegistration && registrationIsValid && (
          <>
            {registratorPublishesMetadataAndFiles ? (
              <Typography>{t('registration.public_page.tasks_panel.you_can_publish_everything')}</Typography>
            ) : registratorPublishesMetadataOnly ? (
              <Typography>{t('registration.public_page.tasks_panel.you_can_publish_metadata')}</Typography>
            ) : registratorRequiresApprovalForMetadataAndFiles ? (
              <Typography>
                {t('registration.public_page.tasks_panel.you_can_publish_metadata_after_curator_approval')}
              </Typography>
            ) : null}
            <Typography>{t('registration.public_page.tasks_panel.review_preview_before_publishing')}</Typography>
          </>
        )}

        {isDraftRegistration && !publishingRequestTicket && (
          <LoadingButton
            disabled={isLoading !== LoadingState.None || !registrationIsValid}
            data-testid={dataTestId.registrationLandingPage.tasksPanel.publishButton}
            sx={{ mt: '1rem' }}
            color="primary"
            variant="contained"
            endIcon={<CloudUploadIcon />}
            loadingPosition="end"
            onClick={onClickPublish}
            loading={isLoading === LoadingState.CreatePublishingREquest}>
            {registratorRequiresApprovalForMetadataAndFiles
              ? t('registration.public_page.tasks_panel.request_publishing')
              : t('common.publish')}
          </LoadingButton>
        )}

        {canHandlePublishingRequest && !hasMismatchingPublishedStatus && (
          <Box sx={{ mt: '1rem', display: 'flex', gap: '1rem' }}>
            <LoadingButton
              variant="contained"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAcceptButton}
              endIcon={<CheckIcon />}
              loadingPosition="end"
              onClick={() => updatePendingPublishingRequest('Completed')}
              loading={isLoading === LoadingState.ApprovePulishingRequest}
              disabled={isLoading !== LoadingState.None || !registrationIsValid}>
              {t('registration.public_page.approve_publish_request')}
            </LoadingButton>
            <LoadingButton
              variant="contained"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestRejectButton}
              endIcon={<CloseIcon />}
              loadingPosition="end"
              onClick={() => updatePendingPublishingRequest('Closed')}
              loading={isLoading === LoadingState.RejectPublishingRequest}
              disabled={isLoading !== LoadingState.None}>
              {t('registration.public_page.reject_publish_request')}
            </LoadingButton>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
