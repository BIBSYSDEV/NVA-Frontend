import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
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
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router';
import { useDuplicateRegistrationSearch } from '../../../api/hooks/useDuplicateRegistrationSearch';
import { publishRegistration } from '../../../api/registrationApi';
import { RegistrationErrorActions } from '../../../components/RegistrationErrorActions';
import { TicketStatusChip } from '../../../components/StatusChip';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { FileType } from '../../../types/associatedArtifact.types';
import { SelectedTicketTypeLocationState } from '../../../types/locationState.types';
import { PublishingTicket } from '../../../types/publication_types/ticket.types';
import { Registration, RegistrationStatus } from '../../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  getTabErrors,
  isPublishableForWorkflow2,
  validateRegistrationForm,
} from '../../../utils/formik-helpers/formik-helpers';
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
import { RefreshPublishingRequestButton } from './RefreshPublishingRequestButton';
import { TicketAssignee } from './TicketAssignee';

interface PublishingAccordionProps {
  registration: Registration;
  refetchData: () => Promise<void>;
  publishingRequestTickets: PublishingTicket[];
  isLoadingData: boolean;
  addMessage: (ticketId: string, message: string) => Promise<unknown>;
  hasReservedDoi: boolean;
}

export const PublishingAccordion = ({
  publishingRequestTickets,
  registration,
  refetchData,
  isLoadingData,
  addMessage,
  hasReservedDoi,
}: PublishingAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customer = useSelector((store: RootState) => store.customer);
  const location = useLocation();
  const locationState = location.state as SelectedTicketTypeLocationState | undefined;

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
    (file) => isOpenFile(file) || file.type === FileType.InternalFile
  );

  const userCanCreatePublishingRequest = userHasAccessRight(registration, 'publishing-request-create');
  const userCanApprovePublishingRequest = userHasAccessRight(registration, 'publishing-request-approve'); // TODO: This should be handled by allowedOperations (NP-48995)
  const userCanHandlePublishingRequest = userCanCreatePublishingRequest || userCanApprovePublishingRequest;

  const formErrors = validateRegistrationForm(registration);
  const registrationIsValid = Object.keys(formErrors).length === 0;
  const tabErrors = !registrationIsValid ? getTabErrors(registration, formErrors) : null;

  const canPublishMetadata =
    isDraftRegistration &&
    ((customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly' &&
      isPublishableForWorkflow2(registration)) ||
      (customer?.publicationWorkflow === 'RegistratorPublishesMetadataAndFiles' && registrationIsValid));

  const lastPublishingRequest =
    publishingRequestTickets.find((ticket) => ticket.status === 'New' || ticket.status === 'Pending') ??
    publishingRequestTickets.at(-1);

  const handlePublishRegistration = async () => {
    setIsCreatingPublishingRequest(true);
    const createPublishingRequestTicketResponse = await publishRegistration(registration.id);
    if (isErrorStatus(createPublishingRequestTicketResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.publish_registration'), variant: 'error' }));
    } else if (isSuccessStatus(createPublishingRequestTicketResponse.status)) {
      const hasFilesWaitingForApproval = registration.associatedArtifacts.some(
        (file) => file.type === FileType.PendingOpenFile || file.type === FileType.PendingInternalFile
      );

      const successMessage =
        hasFilesWaitingForApproval && hasReservedDoi
          ? t('feedback.success.published_metadata_waiting_for_files_and_doi')
          : hasFilesWaitingForApproval
            ? t('feedback.success.published_metadata_waiting_for_files')
            : hasReservedDoi
              ? t('feedback.success.published_registration_waiting_for_doi')
              : t('feedback.success.published_registration');

      dispatch(setNotification({ message: successMessage, variant: 'success' }));
      await refetchData();
    }
    setIsCreatingPublishingRequest(false);
  };

  const onConfirmNotDuplicate = () => {
    handlePublishRegistration();
    toggleDuplicateWarningModal();
  };

  const toggleDuplicateWarningModal = () => setDisplayDuplicateWarningModal(!displayDuplicateWarningModal);

  const registratorPublishesMetadataAndFiles =
    lastPublishingRequest?.workflow === 'RegistratorPublishesMetadataAndFiles';
  const registratorPublishesMetadataOnly = lastPublishingRequest?.workflow === 'RegistratorPublishesMetadataOnly';

  const hasClosedTicket = lastPublishingRequest?.status === 'Closed';
  const hasPendingTicket = lastPublishingRequest?.status === 'Pending' || lastPublishingRequest?.status === 'New';
  const hasCompletedTicket = lastPublishingRequest?.status === 'Completed';

  const mismatchingPublishedStatusWorkflow1 =
    registratorPublishesMetadataAndFiles && !!lastPublishingRequest && isDraftRegistration;
  const mismatchingPublishedStatusWorkflow2 =
    registratorPublishesMetadataOnly &&
    !!lastPublishingRequest &&
    (isDraftRegistration || hasMismatchingFiles(lastPublishingRequest, publishingRequestTickets, registration));

  const isWaitingForFileDeletion =
    isDeletedRegistration && getAssociatedFiles(registration.associatedArtifacts).length > 0;

  const hasMismatchingPublishedStatus =
    mismatchingPublishedStatusWorkflow1 || mismatchingPublishedStatusWorkflow2 || isWaitingForFileDeletion;

  const showRegistrationWithSameNameWarning = duplicateRegistration && isDraftRegistration;

  const defaultExpanded = locationState?.selectedTicketType
    ? locationState.selectedTicketType === 'PublishingRequest' ||
      locationState.selectedTicketType === 'FilesApprovalThesis'
    : isDraftRegistration || hasPendingTicket || hasMismatchingPublishedStatus || hasClosedTicket;

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAccordion}
      sx={{
        bgcolor: 'publishingRequest.light',
        '& .MuiAccordionSummary-content': {
          alignItems: 'center',
          gap: '0.5rem',
        },
      }}
      elevation={3}
      defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <Typography fontWeight={'bold'} sx={{ flexGrow: '1' }}>
          {isUnpublishedOrDeletedRegistration
            ? t(`registration.status.${registration.status}`)
            : t('registration.public_page.publication')}
        </Typography>

        {lastPublishingRequest && !isUnpublishedOrDeletedRegistration && (
          <TicketStatusChip ticket={lastPublishingRequest} />
        )}

        {(!registrationIsValid || showRegistrationWithSameNameWarning) && !isUnpublishedOrDeletedRegistration && (
          <Tooltip
            title={
              showRegistrationWithSameNameWarning
                ? t('registration.public_page.potential_duplicate')
                : t('registration.public_page.validation_errors')
            }>
            <ErrorIcon color="warning" sx={{ ml: '0.2rem' }} />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {lastPublishingRequest && <TicketAssignee ticket={lastPublishingRequest} refetchTickets={refetchData} />}

        {tabErrors && !isDeletedRegistration && (
          <RegistrationErrorActions tabErrors={tabErrors} registration={registration} sx={{ mb: '0.5rem' }} />
        )}

        {/* Show approval history */}
        {(isPublishedRegistration || isDeletedRegistration || isUnpublishedRegistration) && (
          <PublishingLogPreview registration={registration} tickets={publishingRequestTickets} />
        )}

        {hasPendingTicket && <Divider sx={{ my: '1rem' }} />}

        {/* Option to reload data if status is not up to date with ticket */}
        {((userCanHandlePublishingRequest && !tabErrors && hasMismatchingPublishedStatus) ||
          isWaitingForFileDeletion) && (
          <>
            <Typography sx={{ my: '1rem' }}>
              {isPublishedRegistration
                ? hasCompletedTicket
                  ? t('registration.public_page.tasks_panel.files_will_soon_be_published')
                  : hasClosedTicket
                    ? t('registration.public_page.tasks_panel.files_will_soon_be_rejected')
                    : ''
                : isWaitingForFileDeletion
                  ? t('registration.public_page.tasks_panel.files_will_soon_be_deleted')
                  : t('registration.public_page.tasks_panel.registration_will_soon_be_published')}
            </Typography>
            <RefreshPublishingRequestButton refetchData={refetchData} loading={isLoadingData} />
          </>
        )}

        {canPublishMetadata && showRegistrationWithSameNameWarning && (
          <div>
            <Typography sx={{ mb: '1rem' }}>
              {t('registration.public_page.tasks_panel.duplicate_title_description_introduction')}
            </Typography>
            <Link
              target="_blank"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.duplicateRegistrationLink}
              to={getRegistrationLandingPagePath(duplicateRegistration.identifier)}>
              <Box sx={{ display: 'flex', gap: '0.5rem', mb: '1rem' }}>
                <Typography sx={{ textDecoration: 'underline', cursor: 'pointer', color: 'primary.light' }}>
                  {duplicateRegistration.mainTitle}
                </Typography>
                <OpenInNewOutlinedIcon
                  sx={{ cursor: 'pointer', color: 'primary.main', height: '1.3rem', width: '1.3rem' }}
                />
              </Box>
            </Link>
            <Trans
              i18nKey="registration.public_page.tasks_panel.duplicate_title_description_details"
              components={[<Typography sx={{ mb: '1rem' }} key="1" />]}
            />
            <Divider sx={{ bgcolor: 'grey.400', mb: '0.5rem' }} />
          </div>
        )}

        {/* Tell user what they can publish */}
        {userCanCreatePublishingRequest && !lastPublishingRequest && isDraftRegistration && canPublishMetadata && (
          <>
            {customer?.publicationWorkflow === 'RegistratorPublishesMetadataAndFiles' ? (
              <Trans i18nKey="registration.public_page.tasks_panel.publish_registration_description_workflow1">
                <Typography sx={{ mb: '1rem' }} />
              </Trans>
            ) : customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly' ? (
              <Trans i18nKey="registration.public_page.tasks_panel.publish_registration_description_workflow2">
                <Typography sx={{ mb: '1rem' }} />
              </Trans>
            ) : null}
          </>
        )}

        {userCanCreatePublishingRequest && !lastPublishingRequest && isDraftRegistration && (
          <>
            <Button
              disabled={isCreatingPublishingRequest || !canPublishMetadata || titleSearchPending}
              data-testid={dataTestId.registrationLandingPage.tasksPanel.publishButton}
              sx={{ mt: '0.5rem' }}
              variant="contained"
              color="info"
              fullWidth
              onClick={duplicateRegistration ? toggleDuplicateWarningModal : handlePublishRegistration}
              loading={isLoadingData || isCreatingPublishingRequest || titleSearchPending}>
              {t('registration.public_page.tasks_panel.publish_registration')}
            </Button>

            {userHasAccessRight(registration, 'delete') && (
              <Typography sx={{ my: '1rem' }}>
                {t('registration.public_page.tasks_panel.delete_draft_description')}
              </Typography>
            )}
          </>
        )}

        {lastPublishingRequest && !hasMismatchingPublishedStatus && (
          <PublishingAccordionLastTicketInfo
            publishingTicket={lastPublishingRequest}
            canCreatePublishingRequest={userCanCreatePublishingRequest}
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

        <MoreActionsCollapse registration={registration} registrationIsValid={registrationIsValid} />
      </AccordionDetails>
    </Accordion>
  );
};

const hasMismatchingFiles = (
  lastPublishingRequest: PublishingTicket,
  allPublishingRequests: PublishingTicket[],
  registration: Registration
) => {
  if (lastPublishingRequest.status === 'Completed') {
    const ticketHasPendingFiles = lastPublishingRequest.filesForApproval.length > 0;
    if (ticketHasPendingFiles) {
      return true;
    }
    const approvedFileIdentifiers = allPublishingRequests
      .filter((ticket) => ticket.status === 'Completed' && ticket.approvedFiles.length > 0)
      .flatMap((ticket) => ticket.approvedFiles.map((file) => file.identifier));

    const hasMismatchingApprovedFiles = getAssociatedFiles(registration.associatedArtifacts)
      .filter((file) => approvedFileIdentifiers.includes(file.identifier)) // Find files handled by current institution
      .some((file) => isPendingOpenFile(file) || file.type === FileType.PendingInternalFile);

    return hasMismatchingApprovedFiles;
  }

  if (lastPublishingRequest.status === 'Closed') {
    const rejectedFileIdentifiers = allPublishingRequests
      .filter((ticket) => ticket.status === 'Closed' && ticket.filesForApproval.length > 0)
      .flatMap((ticket) => ticket.filesForApproval.map((file) => file.identifier));

    const hasMismatchingRejectedFiles = getAssociatedFiles(registration.associatedArtifacts)
      .filter((file) => rejectedFileIdentifiers.includes(file.identifier)) // Find files handled by current institution
      .some((file) => file.type === FileType.PendingOpenFile || file.type === FileType.PendingInternalFile);

    return hasMismatchingRejectedFiles;
  }

  return false;
};
