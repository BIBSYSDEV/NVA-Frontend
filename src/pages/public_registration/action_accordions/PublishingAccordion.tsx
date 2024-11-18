import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LoadingButton } from '@mui/lab';
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDuplicateRegistrationSearch } from '../../../api/hooks/useDuplicateRegistrationSearch';
import { createTicket } from '../../../api/registrationApi';
import { RegistrationErrorActions } from '../../../components/RegistrationErrorActions';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { FileType } from '../../../types/associatedArtifact.types';
import { PublishingTicket } from '../../../types/publication_types/ticket.types';
import { Registration, RegistrationStatus } from '../../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getTabErrors, validateRegistrationForm } from '../../../utils/formik-helpers/formik-helpers';
import {
  getAssociatedFiles,
  isOpenFile,
  isPendingOpenFile,
  userHasAccessRight,
} from '../../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../../utils/urlPaths';
import { PublishingLogPreview } from '../PublishingLogPreview';
import { DuplicateWarningDialog } from './DuplicateWarningDialog';
import { MoreActionsCollapse } from './MoreActionsCollapse';
import { PublishingAccordionLastTicketInfo } from './PublishingAccordionLastTicketInfo';
import { TicketAssignee } from './TicketAssignee';

interface PublishingAccordionProps {
  registration: Registration;
  refetchData: () => Promise<void>;
  publishingRequestTickets: PublishingTicket[];
  isLoadingData: boolean;
  addMessage: (ticketId: string, message: string) => Promise<unknown>;
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

  const isDraftRegistration = registration.status === RegistrationStatus.Draft;
  const isPublishedRegistration = registration.status === RegistrationStatus.Published;
  const isDeletedRegistration = registration.status === RegistrationStatus.Deleted;
  const isUnpublishedRegistration = registration.status === RegistrationStatus.Unpublished;
  const isUnpublishedOrDeletedRegistration = isDeletedRegistration || isUnpublishedRegistration;

  const { titleSearchPending, duplicateRegistration } = useDuplicateRegistrationSearch({
    enabled: isDraftRegistration && !!registration.entityDescription?.mainTitle,
    title: registration.entityDescription?.mainTitle,
    identifier: registration.identifier,
    publishedYear: registration.entityDescription?.publicationDate?.year,
    category: registration.entityDescription?.reference?.publicationInstance?.type,
  });

  const [isCreatingPublishingRequest, setIsCreatingPublishingRequest] = useState(false);
  const [displayDuplicateWarningModal, setDisplayDuplicateWarningModal] = useState(false);
  const registrationHasApprovedFile = registration.associatedArtifacts.some(
    (file) =>
      isOpenFile(file) ||
      file.type === FileType.OpenFile ||
      file.type === FileType.InternalFile ||
      file.type === FileType.PublishedFile
  );

  const userCanCreatePublishingRequest = userHasAccessRight(registration, 'publishing-request-create');
  const userCanApprovePublishingRequest = userHasAccessRight(registration, 'publishing-request-approve');
  const userCanHandlePublishingRequest = userCanCreatePublishingRequest || userCanApprovePublishingRequest;

  const formErrors = validateRegistrationForm(registration);
  const registrationIsValid = Object.keys(formErrors).length === 0;
  const tabErrors = !registrationIsValid ? getTabErrors(registration, formErrors) : null;

  const lastPublishingRequest =
    publishingRequestTickets.find((ticket) => ticket.status === 'New' || ticket.status === 'Pending') ??
    publishingRequestTickets.at(-1);

  const publishRegistration = async () => {
    setIsCreatingPublishingRequest(true);
    const createPublishingRequestTicketResponse = await createTicket(registration.id, 'PublishingRequest');
    if (isErrorStatus(createPublishingRequestTicketResponse.status)) {
      dispatch(
        setNotification({
          message: t('feedback.error.publish_registration'),
          variant: 'error',
        })
      );
    } else if (isSuccessStatus(createPublishingRequestTicketResponse.status)) {
      if (userCanApprovePublishingRequest) {
        dispatch(
          setNotification({
            message: t('feedback.success.published_registration'),
            variant: 'success',
          })
        );
      } else {
        const hasFilesWaitingForApproval = registration.associatedArtifacts.some(isPendingOpenFile);
        if (hasFilesWaitingForApproval) {
          dispatch(
            setNotification({
              message: t('feedback.success.published_metadata_waiting_for_files'),
              variant: 'success',
            })
          );
        } else {
          dispatch(
            setNotification({
              message: t('feedback.success.published_registration'),
              variant: 'success',
            })
          );
        }
      }
      await refetchData();
    }
    setIsCreatingPublishingRequest(false);
  };

  const onConfirmNotDuplicate = () => {
    publishRegistration();
    toggleDuplicateWarningModal();
  };

  const toggleDuplicateWarningModal = () => setDisplayDuplicateWarningModal(!displayDuplicateWarningModal);

  const registratorPublishesMetadataAndFiles =
    lastPublishingRequest?.workflow === 'RegistratorPublishesMetadataAndFiles';
  const registratorPublishesMetadataOnly = lastPublishingRequest?.workflow === 'RegistratorPublishesMetadataOnly';

  const filesAwaitingApproval = lastPublishingRequest ? lastPublishingRequest.filesForApproval.length : 0;
  const ticketHasPendingFiles = filesAwaitingApproval > 0;

  const approvedFileIdentifiers = publishingRequestTickets
    .filter((ticket) => ticket.status === 'Completed' && ticket.approvedFiles.length > 0)
    .flatMap((ticket) => ticket.approvedFiles.map((file) => file.identifier));

  const registrationHasMismatchingFiles = getAssociatedFiles(registration.associatedArtifacts)
    .filter((file) => approvedFileIdentifiers.includes(file.identifier)) // Find files handled by current institution
    .some(
      (file) =>
        file.type === FileType.PendingOpenFile ||
        file.type === FileType.PendingInternalFile ||
        file.type === FileType.UnpublishedFile
    );

  const hasClosedTicket = lastPublishingRequest?.status === 'Closed';
  const hasPendingTicket = lastPublishingRequest?.status === 'Pending' || lastPublishingRequest?.status === 'New';
  const hasCompletedTicket = lastPublishingRequest?.status === 'Completed';

  const mismatchingPublishedStatusWorkflow1 =
    registratorPublishesMetadataAndFiles && !!lastPublishingRequest && isDraftRegistration;
  const mismatchingPublishedStatusWorkflow2 =
    registratorPublishesMetadataOnly &&
    !!lastPublishingRequest &&
    (isDraftRegistration || (hasCompletedTicket && (ticketHasPendingFiles || registrationHasMismatchingFiles)));

  const hasMismatchingPublishedStatus = mismatchingPublishedStatusWorkflow1 || mismatchingPublishedStatusWorkflow2;

  const showRegistrationWithSameNameWarning = duplicateRegistration && isDraftRegistration;

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAccordion}
      sx={{ bgcolor: 'publishingRequest.light' }}
      elevation={3}
      defaultExpanded={isDraftRegistration || hasPendingTicket || hasMismatchingPublishedStatus || hasClosedTicket}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <Typography fontWeight={'bold'} sx={{ flexGrow: '1' }}>
          {isUnpublishedOrDeletedRegistration
            ? t(`registration.status.${registration.status}`)
            : t('registration.public_page.publication')}
          {lastPublishingRequest &&
            !isUnpublishedRegistration &&
            !isDeletedRegistration &&
            ` - ${t(`my_page.messages.ticket_types.${lastPublishingRequest.status}`)}`}
        </Typography>
        {(!registrationIsValid || showRegistrationWithSameNameWarning) && !isUnpublishedOrDeletedRegistration && (
          <Tooltip
            title={
              showRegistrationWithSameNameWarning
                ? t('registration.public_page.potential_duplicate')
                : t('registration.public_page.validation_errors')
            }>
            <ErrorIcon color="warning" sx={{ ml: '0.5rem' }} />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {lastPublishingRequest && <TicketAssignee ticket={lastPublishingRequest} refetchTickets={refetchData} />}

        {tabErrors && !isUnpublishedOrDeletedRegistration && (
          <RegistrationErrorActions
            tabErrors={tabErrors}
            registrationIdentifier={registration.identifier}
            isPublished={isPublishedRegistration}
            sx={{ mb: '0.5rem' }}
          />
        )}

        {/* Show approval history */}
        {(isPublishedRegistration || isDeletedRegistration || isUnpublishedRegistration) && (
          <PublishingLogPreview registration={registration} tickets={publishingRequestTickets} />
        )}

        {hasPendingTicket && <Divider sx={{ my: '1rem' }} />}

        {/* Option to reload data if status is not up to date with ticket */}
        {userCanHandlePublishingRequest && !tabErrors && hasMismatchingPublishedStatus && (
          <>
            <Typography paragraph sx={{ mt: '1rem' }}>
              {isPublishedRegistration
                ? t('registration.public_page.tasks_panel.files_will_soon_be_published')
                : t('registration.public_page.tasks_panel.registration_will_soon_be_published')}
            </Typography>
            <LoadingButton
              variant="contained"
              color="info"
              size="small"
              loading={isLoadingData}
              fullWidth
              onClick={refetchData}
              startIcon={<RefreshIcon />}
              data-testid={dataTestId.registrationLandingPage.tasksPanel.refreshPublishingRequestButton}>
              {t('registration.public_page.tasks_panel.reload')}
            </LoadingButton>
          </>
        )}

        {registrationIsValid && showRegistrationWithSameNameWarning && (
          <div>
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
              i18nKey="registration.public_page.tasks_panel.duplicate_title_description_details"
              components={[<Typography paragraph key="1" />]}
            />
            <Divider sx={{ bgcolor: 'grey.400', mb: '0.5rem' }} />
          </div>
        )}

        {/* Tell user what they can publish */}
        {userCanCreatePublishingRequest && !lastPublishingRequest && isDraftRegistration && registrationIsValid && (
          <>
            {customer?.publicationWorkflow === 'RegistratorPublishesMetadataAndFiles' ? (
              <Trans i18nKey="registration.public_page.tasks_panel.publish_registration_description_workflow1">
                <Typography paragraph />
              </Trans>
            ) : customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly' ? (
              <Trans i18nKey="registration.public_page.tasks_panel.publish_registration_description_workflow2">
                <Typography paragraph />
              </Trans>
            ) : null}
          </>
        )}

        {userCanCreatePublishingRequest && !lastPublishingRequest && isDraftRegistration && (
          <>
            <LoadingButton
              disabled={isCreatingPublishingRequest || !registrationIsValid || titleSearchPending}
              data-testid={dataTestId.registrationLandingPage.tasksPanel.publishButton}
              sx={{ mt: '0.5rem' }}
              variant="contained"
              color="info"
              fullWidth
              onClick={duplicateRegistration ? toggleDuplicateWarningModal : publishRegistration}
              loading={isLoadingData || isCreatingPublishingRequest || titleSearchPending}>
              {t('registration.public_page.tasks_panel.publish_registration')}
            </LoadingButton>

            <Typography paragraph sx={{ mt: '1rem' }}>
              {t('registration.public_page.tasks_panel.delete_draft_description')}
            </Typography>
          </>
        )}

        {lastPublishingRequest && !hasMismatchingPublishedStatus && (
          <PublishingAccordionLastTicketInfo
            publishingTicket={lastPublishingRequest}
            canApprovePublishingRequest={userCanApprovePublishingRequest}
            registrationHasApprovedFile={registrationHasApprovedFile}
            registrationIsValid={registrationIsValid}
            addMessage={addMessage}
            refetchData={refetchData}
          />
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
