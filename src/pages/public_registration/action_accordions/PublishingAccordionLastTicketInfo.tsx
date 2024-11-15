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
  if (publishingTicket.status === 'Completed') {
    if (canApprovePublishingRequest) {
      return null;
    }
    return null;
  }

  if (publishingTicket.status === 'New' || publishingTicket.status === 'Pending') {
    // if (canApprovePublishingRequest) {
    //   return null;
    // }
    return (
      <Trans i18nKey="registration.public_page.tasks_panel.metadata_published_waiting_for_files">
        <Typography paragraph />
      </Trans>
    );
  }

  if (publishingTicket.status === 'Closed') {
    if (canApprovePublishingRequest) {
      return null;
    }
    return null;
  }
  return null;
};
