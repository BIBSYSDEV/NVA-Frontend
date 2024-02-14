import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { validateYupSchema, yupToFormErrors } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { UpdateTicketData, createTicket, updateTicket } from '../../../api/registrationApi';
import { MessageForm } from '../../../components/MessageForm';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { PublishingTicket } from '../../../types/publication_types/ticket.types';
import { Registration, RegistrationStatus } from '../../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { TabErrors, getFirstErrorTab, getTabErrors } from '../../../utils/formik-helpers';
import { UrlPathTemplate, getRegistrationWizardPath } from '../../../utils/urlPaths';
import { registrationValidationSchema } from '../../../utils/validation/registration/registrationValidation';
import { TicketMessageList } from '../../messages/components/MessageList';
import {
  CompletedPublishingRequestStatusBox,
  StyledStatusMessageBox,
} from '../../messages/components/PublishingRequestMessagesColumn';
import { ErrorList } from '../../registration/ErrorList';
import { TicketAssignee } from './TicketAssignee';

interface PublishingAccordionProps {
  registration: Registration;
  refetchData: () => void;
  publishingRequestTickets: PublishingTicket[];
  userIsCurator: boolean;
  isLoadingData: boolean;
  addMessage: (ticketId: string, message: string) => Promise<unknown>;
}

enum LoadingState {
  CreatePublishingRequest,
  ApprovePulishingRequest,
  RejectPublishingRequest,
  None,
}

export const PublishingAccordion = ({
  publishingRequestTickets,
  registration,
  refetchData,
  userIsCurator,
  isLoadingData,
  addMessage,
}: PublishingAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customer = useSelector((store: RootState) => store.customer);

  const [isLoading, setIsLoading] = useState(LoadingState.None);
  const [registrationIsValid, setRegistrationIsValid] = useState(false);
  const registrationHasFile = registration.associatedArtifacts.some((artifact) => artifact.type === 'PublishedFile');
  const publishingRequestTicket = [...publishingRequestTickets].pop();
  const completedTickets = publishingRequestTickets.filter((ticket) => ticket.status === 'Completed');

  const ticketMutation = useMutation({
    mutationFn: publishingRequestTicket
      ? (newTicketData: UpdateTicketData) => {
          if (newTicketData.status === 'Completed') {
            setIsLoading(LoadingState.ApprovePulishingRequest);
          } else if (newTicketData.status === 'Closed') {
            setIsLoading(LoadingState.RejectPublishingRequest);
          }
          return updateTicket(publishingRequestTicket.id, newTicketData);
        }
      : undefined,
    onSettled: () => setIsLoading(LoadingState.None),
    onSuccess: (_, variables) => {
      if (variables.status === 'Completed') {
        dispatch(setNotification({ message: t('feedback.success.publishing_request_approved'), variant: 'success' }));
      } else if (variables.status === 'Closed') {
        dispatch(setNotification({ message: t('feedback.success.publishing_request_rejected'), variant: 'success' }));
      }
      refetchData();
    },
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.update_publishing_request'), variant: 'error' })),
  });

  const [tabErrors, setTabErrors] = useState<TabErrors>();
  useEffect(() => {
    const publicationInstance = registration.entityDescription?.reference?.publicationInstance;

    try {
      validateYupSchema<Registration>(registration, registrationValidationSchema, true, {
        publicationInstanceType: publicationInstance?.type ?? '',
        publicationStatus: registration.status,
      });
      setRegistrationIsValid(true);
    } catch (error) {
      const formErrors = yupToFormErrors(error);
      const customErrors = getTabErrors(registration, formErrors);
      setTabErrors(customErrors);
    }
  }, [registration]);

  const firstErrorTab = Math.max(getFirstErrorTab(tabErrors), 0);

  const onClickPublish = async () => {
    setIsLoading(LoadingState.CreatePublishingRequest);
    const createPublishingRequestTicketResponse = await createTicket(registration.id, 'PublishingRequest');
    if (isErrorStatus(createPublishingRequestTicketResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_publishing_request'), variant: 'error' }));
    } else if (isSuccessStatus(createPublishingRequestTicketResponse.status)) {
      userIsCurator
        ? dispatch(
            setNotification({
              message: t('feedback.success.publish_as_curator'),
              variant: 'success',
            })
          )
        : dispatch(setNotification({ message: t('feedback.success.create_publishing_request'), variant: 'success' }));
      refetchData();
    }
    setIsLoading(LoadingState.None);
  };

  const registratorPublishesMetadataAndFiles =
    publishingRequestTicket?.workflow === 'RegistratorPublishesMetadataAndFiles';
  const registratorPublishesMetadataOnly = publishingRequestTicket?.workflow === 'RegistratorPublishesMetadataOnly';

  const isDraftRegistration = registration.status === RegistrationStatus.Draft;
  const isPublishedRegistration = registration.status === RegistrationStatus.Published;
  const hasUnpublishedFiles = registration.associatedArtifacts.some((artifact) => artifact.type === 'UnpublishedFile');

  const hasClosedTicket = publishingRequestTicket?.status === 'Closed';
  const hasPendingTicket = publishingRequestTicket?.status === 'Pending' || publishingRequestTicket?.status === 'New';
  const hasCompletedTicket = publishingRequestTicket?.status === 'Completed';

  const canHandlePublishingRequest = userIsCurator && !registratorPublishesMetadataAndFiles && hasPendingTicket;

  const mismatchingPublishedStatusWorkflow1 =
    registratorPublishesMetadataAndFiles && !!publishingRequestTicket && isDraftRegistration;
  const mismatchingPublishedStatusWorkflow2 =
    registratorPublishesMetadataOnly &&
    !!publishingRequestTicket &&
    (isDraftRegistration || (hasCompletedTicket && hasUnpublishedFiles));

  const hasMismatchingPublishedStatus = mismatchingPublishedStatusWorkflow1 || mismatchingPublishedStatusWorkflow2;

  const ticketMessages = publishingRequestTicket?.messages ?? [];

  const isOnTasksPath = window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue);

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAccordion}
      sx={{ bgcolor: 'publishingRequest.light' }}
      elevation={3}
      defaultExpanded={isDraftRegistration || hasPendingTicket || hasMismatchingPublishedStatus}>
      <AccordionSummary sx={{ fontWeight: 700 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
        {t('registration.public_page.publication')}
        {publishingRequestTicket && ` - ${t(`my_page.messages.ticket_types.${publishingRequestTicket.status}`)}`}
        {!registrationIsValid && (
          <Tooltip title={t('registration.public_page.validation_errors')}>
            <WarningIcon color="warning" sx={{ ml: '0.5rem' }} />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {publishingRequestTicket && <TicketAssignee ticket={publishingRequestTicket} refetchTickets={refetchData} />}

        {tabErrors && (
          <>
            <Typography>{t('registration.public_page.error_description')}</Typography>
            <ErrorList tabErrors={tabErrors} />
            <Button
              variant="outlined"
              component={RouterLink}
              size="small"
              sx={{ mb: publishingRequestTicket ? '1rem' : undefined }}
              to={`${getRegistrationWizardPath(registration.identifier)}?tab=${firstErrorTab}`}
              endIcon={<EditIcon />}
              data-testid={dataTestId.registrationLandingPage.tasksPanel.backToWizard}>
              {t('registration.public_page.go_back_to_wizard')}
            </Button>
          </>
        )}

        {/* Show approval history */}
        {registration.status === RegistrationStatus.Published && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
              <Typography>{t('registration.status.PUBLISHED_METADATA')}</Typography>
              {registration.publishedDate && (
                <Typography>{new Date(registration.publishedDate).toLocaleDateString()}</Typography>
              )}
            </StyledStatusMessageBox>
            {completedTickets.map((ticket) => (
              <CompletedPublishingRequestStatusBox key={ticket.id} ticket={ticket} />
            ))}
          </Box>
        )}

        {hasPendingTicket && <Divider sx={{ my: '1rem' }} />}

        {/* Option to reload data if status is not up to date with ticket */}
        {!tabErrors && hasMismatchingPublishedStatus && (
          <>
            <Typography gutterBottom>
              {hasUnpublishedFiles && isPublishedRegistration
                ? t('registration.public_page.tasks_panel.files_will_soon_be_published')
                : t('registration.public_page.tasks_panel.registration_will_soon_be_published')}
            </Typography>
            <LoadingButton
              variant="outlined"
              loading={isLoadingData}
              onClick={refetchData}
              startIcon={<RefreshIcon />}
              data-testid={dataTestId.registrationLandingPage.tasksPanel.refreshPublishingRequestButton}>
              {t('registration.public_page.tasks_panel.reload')}
            </LoadingButton>
          </>
        )}

        {/* Show current status info */}
        {!!publishingRequestTicket &&
          !hasMismatchingPublishedStatus &&
          (isDraftRegistration || hasUnpublishedFiles) &&
          (registratorPublishesMetadataOnly ? (
            hasClosedTicket ? (
              <Typography paragraph>
                {t('registration.public_page.tasks_panel.has_rejected_files_publishing_request')}
              </Typography>
            ) : null
          ) : null)}

        {/* Tell user what they can publish */}
        {!publishingRequestTicket && isDraftRegistration && registrationIsValid && (
          <>
            {registratorPublishesMetadataAndFiles ? (
              <Typography>{t('registration.public_page.tasks_panel.you_can_publish_everything')}</Typography>
            ) : registratorPublishesMetadataOnly ? (
              <Typography>{t('registration.public_page.tasks_panel.you_can_publish_metadata')}</Typography>
            ) : null}
            <Typography>{t('registration.public_page.tasks_panel.review_preview_before_publishing')}</Typography>
          </>
        )}

        {isDraftRegistration && !publishingRequestTicket && (
          <LoadingButton
            disabled={isLoading !== LoadingState.None || !registrationIsValid}
            data-testid={dataTestId.registrationLandingPage.tasksPanel.publishButton}
            sx={{ mt: '1rem', bgcolor: 'white' }}
            variant="outlined"
            onClick={onClickPublish}
            loading={isLoadingData || isLoading === LoadingState.CreatePublishingRequest}>
            {customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly'
              ? t('registration.public_page.tasks_panel.publish_metadata')
              : t('registration.public_page.tasks_panel.publish_metadata_and_files')}
          </LoadingButton>
        )}

        {isPublishedRegistration && !isOnTasksPath && hasPendingTicket && (
          <Typography>{t('registration.public_page.tasks_panel.metadata_published_waiting_for_files')}</Typography>
        )}

        {isPublishedRegistration && !isOnTasksPath && hasCompletedTicket && (
          <Typography sx={{ mt: '0.5rem' }}>
            {registrationHasFile
              ? t('registration.public_page.tasks_panel.registration_is_published_with_files')
              : t('registration.public_page.tasks_panel.registration_is_published')}
          </Typography>
        )}

        {canHandlePublishingRequest && !hasMismatchingPublishedStatus && isOnTasksPath && (
          <Box sx={{ mt: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography paragraph>
              {t('registration.public_page.tasks_panel.metadata_published_waiting_for_files_curator')}
            </Typography>
            <LoadingButton
              sx={{ bgcolor: 'white' }}
              variant="outlined"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAcceptButton}
              startIcon={<AttachFileIcon fontSize="large" />}
              onClick={() => ticketMutation.mutate({ status: 'Completed' })}
              loading={isLoading === LoadingState.ApprovePulishingRequest}
              disabled={isLoadingData || isLoading !== LoadingState.None || !registrationIsValid}>
              {t('registration.public_page.approve_publish_request')} (
              {registration.associatedArtifacts.filter((artifact) => artifact.type === 'UnpublishedFile').length})
            </LoadingButton>
            <LoadingButton
              sx={{ bgcolor: 'white' }}
              variant="outlined"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestRejectButton}
              startIcon={<CloseIcon />}
              onClick={() => ticketMutation.mutate({ status: 'Closed' })}
              loading={isLoading === LoadingState.RejectPublishingRequest}
              disabled={isLoadingData || isLoading !== LoadingState.None}>
              {t('registration.public_page.reject_publish_request')}
            </LoadingButton>
          </Box>
        )}

        {hasPendingTicket && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem' }}>
            {ticketMessages.length > 0 ? (
              <TicketMessageList ticket={publishingRequestTicket} />
            ) : (
              <Typography>{t('registration.public_page.publishing_request_message_about')}</Typography>
            )}
            <MessageForm confirmAction={async (message) => await addMessage(publishingRequestTicket.id, message)} />
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
