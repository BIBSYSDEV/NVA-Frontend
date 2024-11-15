import { Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import { PublishingTicket } from '../../../types/publication_types/ticket.types';

interface PublishingAccordionLastTicketInfoProps {
  publishingTicket: PublishingTicket;
  canApprovePublishingRequest: boolean;
  registrationHasApprovedFile: boolean;
}

export const PublishingAccordionLastTicketInfo = ({
  publishingTicket,
  canApprovePublishingRequest,
  registrationHasApprovedFile,
}: PublishingAccordionLastTicketInfoProps) => {
  return (
    <>
      {publishingTicket.status === 'Completed' && (
        <>
          {canApprovePublishingRequest ? (
            registrationHasApprovedFile ? (
              <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_description_for_curator">
                <Typography paragraph />
              </Trans>
            ) : (
              <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_without_file_description_for_curator">
                <Typography paragraph />
              </Trans>
            )
          ) : registrationHasApprovedFile ? (
            <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_description_for_registrator">
              <Typography paragraph />
            </Trans>
          ) : (
            <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_without_file_description_for_registrator">
              <Typography paragraph />
            </Trans>
          )}
        </>
      )}

      {publishingTicket.status === 'Closed' && (
        <>
          {canApprovePublishingRequest ? (
            <Trans i18nKey="registration.public_page.tasks_panel.has_rejected_files_publishing_request">
              <Typography paragraph />
            </Trans>
          ) : (
            <Trans i18nKey="registration.public_page.tasks_panel.has_rejected_files_publishing_request_registrator">
              <Typography paragraph />
            </Trans>
          )}
        </>
      )}

      {(publishingTicket.status === 'New' || publishingTicket.status === 'Pending') && <></>}

      {/* TODO: Add message field? */}
    </>
  );
};
