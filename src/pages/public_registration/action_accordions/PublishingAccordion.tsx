import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Link as RouterLink } from 'react-router-dom';
import { useDuplicateRegistrationSearch } from '../../../api/hooks/useDuplicateRegistrationSearch';
import { createTicket, updateTicket, UpdateTicketData } from '../../../api/registrationApi';
import { MessageForm } from '../../../components/MessageForm';
import { RegistrationErrorActions } from '../../../components/RegistrationErrorActions';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { FileType } from '../../../types/associatedArtifact.types';
import { RegistrationFormLocationState } from '../../../types/locationState.types';
import { PublishingTicket } from '../../../types/publication_types/ticket.types';
import { Registration, RegistrationStatus, RegistrationTab } from '../../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { toDateString } from '../../../utils/date-helpers';
import { getTabErrors, validateRegistrationForm } from '../../../utils/formik-helpers/formik-helpers';
import { userCanPublishRegistration } from '../../../utils/registration-helpers';
import { getRegistrationLandingPagePath, getRegistrationWizardPath, UrlPathTemplate } from '../../../utils/urlPaths';
import { TicketMessageList } from '../../messages/components/MessageList';
import { StyledStatusMessageBox } from '../../messages/components/PublishingRequestMessagesColumn';
import { CompletedPublishingRequestStatusBox } from './CompletedPublishingRequestStatusBox';
import { DeletedRegistrationInformation } from './DeletedRegistrationInformation';
import { DuplicateWarningDialog } from './DuplicateWarningDialog';
import { MoreActionsCollapse } from './MoreActionsCollapse';
import { TicketAssignee } from './TicketAssignee';

interface PublishingAccordionProps {
  registration: Registration;
  refetchData: () => void;
  publishingRequestTickets: PublishingTicket[];
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
  isLoadingData,
  addMessage,
}: PublishingAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customer = useSelector((store: RootState) => store.customer);
  const [openRejectionDialog, setOpenRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const { titleSearchPending, duplicateRegistration } = useDuplicateRegistrationSearch(
    registration.entityDescription?.mainTitle || '',
    registration.identifier,
    registration.entityDescription?.publicationDate?.year,
    registration.entityDescription?.reference?.publicationInstance?.type
  );

  const [isLoading, setIsLoading] = useState(LoadingState.None);
  const [displayDuplicateWarningModal, setDisplayDuplicateWarningModal] = useState(false);
  const registrationHasFile = registration.associatedArtifacts.some(
    (artifact) => artifact.type === FileType.PublishedFile
  );
  const completedTickets = publishingRequestTickets.filter((ticket) => ticket.status === 'Completed');
  const userCanPublish = userCanPublishRegistration(registration);

  const formErrors = validateRegistrationForm(registration);
  const registrationIsValid = Object.keys(formErrors).length === 0;
  const tabErrors = !registrationIsValid ? getTabErrors(registration, formErrors) : null;

  const lastPublishingRequest = publishingRequestTickets.at(-1);

  const ticketMutation = useMutation({
    mutationFn: lastPublishingRequest
      ? (newTicketData: UpdateTicketData) => {
          if (newTicketData.status === 'Completed') {
            setIsLoading(LoadingState.ApprovePulishingRequest);
          } else if (newTicketData.status === 'Closed') {
            setIsLoading(LoadingState.RejectPublishingRequest);
          }
          return updateTicket(lastPublishingRequest.id, newTicketData);
        }
      : undefined,
    onSettled: () => setIsLoading(LoadingState.None),
    onSuccess: (_, variables) => {
      if (variables.status === 'Completed') {
        dispatch(
          setNotification({
            message: t('feedback.success.publishing_request_approved'),
            variant: 'success',
          })
        );
      } else if (variables.status === 'Closed') {
        dispatch(
          setNotification({
            message: t('feedback.success.publishing_request_rejected'),
            variant: 'success',
          })
        );
      }
      refetchData();
    },
    onError: () =>
      dispatch(
        setNotification({
          message: t('feedback.error.update_publishing_request'),
          variant: 'error',
        })
      ),
  });

  const publishRegistration = async () => {
    setIsLoading(LoadingState.CreatePublishingRequest);
    const createPublishingRequestTicketResponse = await createTicket(registration.id, 'PublishingRequest');
    if (isErrorStatus(createPublishingRequestTicketResponse.status)) {
      dispatch(
        setNotification({
          message: t('feedback.error.create_publishing_request'),
          variant: 'error',
        })
      );
    } else if (isSuccessStatus(createPublishingRequestTicketResponse.status)) {
      userCanPublish
        ? dispatch(
            setNotification({
              message: t('feedback.success.publish_as_curator'),
              variant: 'success',
            })
          )
        : dispatch(
            setNotification({
              message: t('feedback.success.create_publishing_request'),
              variant: 'success',
            })
          );
      refetchData();
    }
    setIsLoading(LoadingState.None);
  };

  const onConfirmNotDuplicate = () => {
    publishRegistration();
    toggleDuplicateWarningModal();
  };

  const toggleDuplicateWarningModal = () => setDisplayDuplicateWarningModal(!displayDuplicateWarningModal);

  const registratorPublishesMetadataAndFiles =
    lastPublishingRequest?.workflow === 'RegistratorPublishesMetadataAndFiles';
  const registratorPublishesMetadataOnly = lastPublishingRequest?.workflow === 'RegistratorPublishesMetadataOnly';

  const isDraftRegistration = registration.status === RegistrationStatus.Draft;
  const isPublishedRegistration = registration.status === RegistrationStatus.Published;
  const filesAwaitingApproval = registration.associatedArtifacts.filter(
    (artifact) => artifact.type === FileType.UnpublishedFile
  ).length;
  const hasUnpublishedFiles = filesAwaitingApproval > 0;

  const hasClosedTicket = lastPublishingRequest?.status === 'Closed';
  const hasPendingTicket = lastPublishingRequest?.status === 'Pending' || lastPublishingRequest?.status === 'New';
  const hasCompletedTicket = lastPublishingRequest?.status === 'Completed';

  const canHandlePublishingRequest = userCanPublish && !registratorPublishesMetadataAndFiles && hasPendingTicket;

  const mismatchingPublishedStatusWorkflow1 =
    registratorPublishesMetadataAndFiles && !!lastPublishingRequest && isDraftRegistration;
  const mismatchingPublishedStatusWorkflow2 =
    registratorPublishesMetadataOnly &&
    !!lastPublishingRequest &&
    (isDraftRegistration || (hasCompletedTicket && hasUnpublishedFiles));

  const hasMismatchingPublishedStatus = mismatchingPublishedStatusWorkflow1 || mismatchingPublishedStatusWorkflow2;

  const ticketMessages = lastPublishingRequest?.messages ?? [];

  const isOnTasksPath = window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue);

  const isUnpublishedOrDeleted =
    registration.status === RegistrationStatus.Deleted || registration.status === RegistrationStatus.Unpublished;
  const isPublished = registration.status === RegistrationStatus.Published;
  const showRegistrationWithSameNameWarningIcon = duplicateRegistration && !isPublished;

  const handleRejectPublishFileRequest = async (message: string) => {
    if (lastPublishingRequest) {
      setIsLoading(LoadingState.RejectPublishingRequest);
      await addMessage(lastPublishingRequest.id, message);
      await ticketMutation.mutateAsync({ status: 'Closed' });
      setIsLoading(LoadingState.None);
      setOpenRejectionDialog(false);
    }
  };

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAccordion}
      sx={{ bgcolor: 'publishingRequest.light' }}
      elevation={3}
      defaultExpanded={isDraftRegistration || hasPendingTicket || hasMismatchingPublishedStatus || hasClosedTicket}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <Typography fontWeight={'bold'} sx={{ flexGrow: '1' }}>
          {isUnpublishedOrDeleted
            ? t(`registration.status.${registration.status}`)
            : t('registration.public_page.publication')}
          {lastPublishingRequest &&
            registration.status !== RegistrationStatus.Unpublished &&
            registration.status !== RegistrationStatus.Deleted &&
            ` - ${t(`my_page.messages.ticket_types.${lastPublishingRequest.status}`)}`}
        </Typography>
        {(!registrationIsValid || showRegistrationWithSameNameWarningIcon) && !isUnpublishedOrDeleted && (
          <Tooltip
            title={
              showRegistrationWithSameNameWarningIcon
                ? t('registration.public_page.potential_duplicate')
                : t('registration.public_page.validation_errors')
            }>
            <ErrorIcon color="warning" sx={{ ml: '0.5rem' }} />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {lastPublishingRequest && <TicketAssignee ticket={lastPublishingRequest} refetchTickets={refetchData} />}

        {tabErrors && !isUnpublishedOrDeleted && (
          <RegistrationErrorActions
            tabErrors={tabErrors}
            registrationIdentifier={registration.identifier}
            isPublished={isPublishedRegistration}
            sx={{ mb: '0.5rem' }}
          />
        )}

        {/* Show approval history */}
        {(registration.status === RegistrationStatus.Published ||
          registration.status === RegistrationStatus.Deleted ||
          registration.status === RegistrationStatus.Unpublished) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', mb: '0.5rem' }}>
            <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
              <Typography>{t('registration.status.PUBLISHED_METADATA')}</Typography>
              {registration.publishedDate && <Typography>{toDateString(registration.publishedDate)}</Typography>}
            </StyledStatusMessageBox>
            {completedTickets.map((ticket) => (
              <CompletedPublishingRequestStatusBox key={ticket.id} ticket={ticket} />
            ))}
            {registration.publicationNotes
              ?.filter((note) => note.type === 'UnpublishingNote')
              .map((note, index) => (
                <DeletedRegistrationInformation
                  key={note.createdDate ?? index}
                  registration={registration}
                  unpublishingNote={note}
                />
              ))}
          </Box>
        )}

        {hasPendingTicket && <Divider sx={{ my: '1rem' }} />}

        {/* Option to reload data if status is not up to date with ticket */}
        {!tabErrors && hasMismatchingPublishedStatus && (
          <>
            <Typography paragraph sx={{ mt: '1rem' }}>
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
        {registrationIsValid && duplicateRegistration && !isUnpublishedOrDeleted && !isPublished && (
          <Box>
            <Typography paragraph>
              {t('registration.public_page.tasks_panel.duplicate_title_description_introduction')}
            </Typography>
            <Link
              target="_blank"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.duplicateRegistrationLink}
              to={getRegistrationLandingPagePath(duplicateRegistration.identifier)}>
              <Box sx={{ display: 'flex', gap: '0.5rem', mb: '1rem' }}>
                <Typography sx={{ textDecoration: 'underline', cursor: 'pointer', color: 'primary.light' }}>
                  {duplicateRegistration.entityDescription?.mainTitle}
                </Typography>
                <OpenInNewOutlinedIcon
                  sx={{ cursor: 'pointer', color: 'primary.main', height: '1.3rem', width: '1.3rem' }}
                />
              </Box>
            </Link>
            <Trans
              t={t}
              i18nKey="registration.public_page.tasks_panel.duplicate_title_description_details"
              components={[<Typography paragraph key="1" />]}
            />
            <Divider sx={{ bgcolor: 'grey.400', mb: '0.5rem' }} />
          </Box>
        )}

        {/* Tell user what they can publish */}
        {!lastPublishingRequest && isDraftRegistration && registrationIsValid && (
          <>
            <Typography paragraph>
              {t('registration.public_page.tasks_panel.review_preview_before_publishing')}
            </Typography>

            {customer?.publicationWorkflow === 'RegistratorPublishesMetadataAndFiles' ? (
              <Typography paragraph>{t('registration.public_page.tasks_panel.you_can_publish_everything')}</Typography>
            ) : customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly' ? (
              <>
                <Typography paragraph>{t('registration.public_page.tasks_panel.you_can_publish_metadata')}</Typography>
                {hasUnpublishedFiles && (
                  <Typography paragraph>
                    {t('registration.public_page.tasks_panel.you_can_publish_metadata_files_info')}
                  </Typography>
                )}
              </>
            ) : null}
          </>
        )}

        {isDraftRegistration && !lastPublishingRequest && (
          <LoadingButton
            disabled={isLoading !== LoadingState.None || !registrationIsValid || titleSearchPending}
            data-testid={dataTestId.registrationLandingPage.tasksPanel.publishButton}
            sx={{ mt: '1rem' }}
            variant="contained"
            color="info"
            fullWidth
            onClick={duplicateRegistration ? toggleDuplicateWarningModal : publishRegistration}
            loading={isLoadingData || isLoading === LoadingState.CreatePublishingRequest || titleSearchPending}>
            {t('registration.public_page.tasks_panel.publish_registration')}
          </LoadingButton>
        )}

        {isPublishedRegistration && hasClosedTicket && (
          <>
            <Trans
              t={t}
              i18nKey="registration.public_page.tasks_panel.has_rejected_files_publishing_request"
              components={[<Typography paragraph key="1" />]}
            />
            <TicketMessageList ticket={lastPublishingRequest} />
          </>
        )}

        {isPublishedRegistration && !isOnTasksPath && hasPendingTicket && (
          <Trans
            t={t}
            i18nKey="registration.public_page.tasks_panel.metadata_published_waiting_for_files"
            components={[<Typography paragraph key="1" />]}
          />
        )}

        {isPublishedRegistration && !isOnTasksPath && hasCompletedTicket && (
          <Box sx={{ mt: '0.5rem' }}>
            {registratorPublishesMetadataAndFiles ? (
              <>
                <Typography paragraph>{t('registration.public_page.tasks_panel.published_registration')}</Typography>
                <Typography paragraph>
                  {registrationHasFile
                    ? t('registration.public_page.tasks_panel.registration_is_published_with_files')
                    : t('registration.public_page.tasks_panel.registration_is_published')}
                </Typography>
              </>
            ) : registrationHasFile ? (
              <Trans
                t={t}
                i18nKey="registration.public_page.tasks_panel.registration_is_published_workflow2"
                components={[<Typography paragraph key="1" />]}
              />
            ) : (
              <Trans
                t={t}
                i18nKey="registration.public_page.tasks_panel.registration_is_published_workflow2_without_file"
                components={[<Typography paragraph key="1" />]}
              />
            )}
          </Box>
        )}

        {canHandlePublishingRequest && !hasMismatchingPublishedStatus && isOnTasksPath && (
          <Box sx={{ mt: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Trans
              t={t}
              i18nKey="registration.public_page.tasks_panel.approve_publishing_request_description"
              components={[<Typography key="1" />]}
            />
            <LoadingButton
              sx={{ bgcolor: 'white', mb: '0.5rem' }}
              variant="outlined"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAcceptButton}
              startIcon={<AttachFileIcon fontSize="large" />}
              onClick={() => ticketMutation.mutate({ status: 'Completed' })}
              loading={isLoading === LoadingState.ApprovePulishingRequest}
              disabled={isLoadingData || isLoading !== LoadingState.None || !registrationIsValid}>
              {t('registration.public_page.approve_publish_request')} ({filesAwaitingApproval})
            </LoadingButton>
            <Typography>{t('registration.public_page.tasks_panel.edit_publishing_request_description')}</Typography>
            <Button
              sx={{ bgcolor: 'white', mb: '0.5rem' }}
              variant="outlined"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestEditButton}
              endIcon={<EditIcon fontSize="large" />}
              component={RouterLink}
              to={{
                pathname: getRegistrationWizardPath(registration.identifier),
                search: '?tab=' + RegistrationTab.FilesAndLicenses,
                state: { previousPath: window.location.pathname } satisfies RegistrationFormLocationState,
              }}>
              {t('registration.edit_registration')}
            </Button>

            <Trans
              t={t}
              i18nKey="registration.public_page.tasks_panel.reject_publishing_request_description"
              values={{ count: filesAwaitingApproval }}
              components={[<Typography key="1" />]}
            />
            <LoadingButton
              sx={{ bgcolor: 'white' }}
              variant="outlined"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestRejectButton}
              startIcon={<CloseIcon />}
              onClick={() => setOpenRejectionDialog(true)}
              loading={isLoading === LoadingState.RejectPublishingRequest}
              disabled={isLoadingData || isLoading !== LoadingState.None}>
              {t('registration.public_page.reject_publish_request')} ({filesAwaitingApproval})
            </LoadingButton>

            <Dialog open={openRejectionDialog} onClose={() => setOpenRejectionDialog(false)}>
              <DialogTitle fontWeight="bold">{t('registration.public_page.reject_publish_request')}</DialogTitle>
              <DialogContent>
                <Trans
                  i18nKey="registration.public_page.reject_publish_request_description"
                  components={[<Typography paragraph key="1" />]}
                />
                <TextField
                  data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestRejectionMessageTextField}
                  inputProps={{ maxLength: 160 }}
                  variant="filled"
                  multiline
                  minRows={3}
                  maxRows={Infinity}
                  fullWidth
                  required
                  label={t('registration.public_page.reason_for_rejection')}
                  FormHelperTextProps={{ sx: { textAlign: 'end' } }}
                  helperText={`${rejectionReason.length}/160`}
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  data-testid={dataTestId.registrationLandingPage.tasksPanel.cancelRejectionButton}
                  onClick={() => setOpenRejectionDialog(false)}>
                  {t('common.cancel')}
                </Button>
                <LoadingButton
                  data-testid={dataTestId.registrationLandingPage.tasksPanel.rejectionDialogConfirmButton}
                  disabled={!rejectionReason}
                  loading={isLoading === LoadingState.RejectPublishingRequest}
                  variant="contained"
                  onClick={() =>
                    handleRejectPublishFileRequest(
                      `${t('registration.public_page.reason_for_rejection')}: ${rejectionReason}`
                    )
                  }>
                  {t('common.reject')}
                </LoadingButton>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {hasPendingTicket && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem' }}>
            {ticketMessages.length > 0 ? (
              <TicketMessageList ticket={lastPublishingRequest} />
            ) : (
              <Typography>{t('registration.public_page.publishing_request_message_about')}</Typography>
            )}
            <MessageForm
              confirmAction={async (message) => await addMessage(lastPublishingRequest.id, message)}
              hideRequiredAsterisk
            />
          </Box>
        )}
        <DuplicateWarningDialog
          isOpen={displayDuplicateWarningModal}
          toggleModal={toggleDuplicateWarningModal}
          duplicateId={duplicateRegistration?.identifier}
          onConfirmNotDuplicate={onConfirmNotDuplicate}
        />

        <MoreActionsCollapse registration={registration} />
      </AccordionDetails>
    </Accordion>
  );
};
