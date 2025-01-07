import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Divider, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { MessageForm } from '../../../components/MessageForm';
import { PublishingTicket } from '../../../types/publication_types/ticket.types';
import { RegistrationTab } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getRegistrationWizardPath, UrlPathTemplate } from '../../../utils/urlPaths';
import { TicketMessageList } from '../../messages/components/MessageList';
import { PendingPublishingTicketForCuratorSection } from './PendingPublishingTicketForCuratorSection';

interface PublishingAccordionLastTicketInfoProps {
  publishingTicket: PublishingTicket;
  canApprovePublishingRequest: boolean;
  registrationHasApprovedFile: boolean;
  refetchData: () => Promise<void>;
  addMessage: (ticketId: string, message: string) => Promise<unknown>;
  registrationIsValid: boolean;
}

export const PublishingAccordionLastTicketInfo = ({
  publishingTicket,
  canApprovePublishingRequest,
  registrationHasApprovedFile,
  registrationIsValid,
  addMessage,
  refetchData,
}: PublishingAccordionLastTicketInfoProps) => {
  const { t } = useTranslation();

  const isCompletedTicket = publishingTicket.status === 'Completed';

  if (publishingTicket.workflow === 'RegistratorPublishesMetadataAndFiles' && isCompletedTicket) {
    return (
      <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_description_for_workflow1">
        <Typography sx={{ mb: '1rem' }} />
      </Trans>
    );
  }

  const isClosedTicket = publishingTicket.status === 'Closed';
  const isPendingTicket = publishingTicket.status === 'New' || publishingTicket.status === 'Pending';

  return (
    <>
      {isCompletedTicket && (
        <>
          {canApprovePublishingRequest ? (
            registrationHasApprovedFile ? (
              <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_description_for_curator">
                <Typography sx={{ mb: '1rem' }} />
              </Trans>
            ) : (
              <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_without_file_description_for_curator">
                <Typography sx={{ mb: '1rem' }} />
              </Trans>
            )
          ) : registrationHasApprovedFile ? (
            <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_description_for_registrator">
              <Typography sx={{ mb: '1rem' }} />
            </Trans>
          ) : (
            <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_without_file_description_for_registrator">
              <Typography sx={{ mb: '1rem' }} />
            </Trans>
          )}
        </>
      )}

      {isClosedTicket && (
        <>
          {canApprovePublishingRequest ? (
            <Trans i18nKey="registration.public_page.tasks_panel.has_rejected_files_publishing_request">
              <Typography sx={{ mb: '1rem' }} />
            </Trans>
          ) : (
            <>
              <Trans i18nKey="registration.public_page.tasks_panel.has_rejected_files_publishing_request_registrator">
                <Typography sx={{ mb: '1rem' }} />
              </Trans>
              <Button
                sx={{ bgcolor: 'white' }}
                variant="outlined"
                fullWidth
                data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestEditButton}
                endIcon={<EditIcon />}
                component={RouterLink}
                to={getRegistrationWizardPath(
                  publishingTicket.publicationIdentifier,
                  RegistrationTab.FilesAndLicenses
                )}>
                {t('registration.edit_registration')}
              </Button>
            </>
          )}
        </>
      )}

      {isPendingTicket && (
        <>
          {canApprovePublishingRequest ? (
            <PendingPublishingTicketForCuratorSection
              publishingTicket={publishingTicket}
              addMessage={addMessage}
              refetchData={refetchData}
              registrationIsValid={registrationIsValid}
            />
          ) : registrationHasApprovedFile ? (
            <Trans i18nKey="registration.public_page.tasks_panel.pending_publishing_request_with_file_description_for_registrator">
              <Typography sx={{ mb: '1rem' }} />
            </Trans>
          ) : (
            <Trans i18nKey="registration.public_page.tasks_panel.pending_publishing_request_without_file_description_for_registrator">
              <Typography sx={{ mb: '1rem' }} />
            </Trans>
          )}
        </>
      )}

      <Divider sx={{ my: '1rem' }} />
      <Typography fontWeight="bold" gutterBottom>
        {t('common.messages')}
      </Typography>
      <Typography gutterBottom>
        {window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue)
          ? t('registration.public_page.publishing_request_message_about_curator')
          : t('registration.public_page.publishing_request_message_about')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <MessageForm
          confirmAction={async (message) => await addMessage(publishingTicket.id, message)}
          hideRequiredAsterisk
        />
        {publishingTicket.messages.length > 0 && <TicketMessageList ticket={publishingTicket} />}
      </Box>
    </>
  );
};
