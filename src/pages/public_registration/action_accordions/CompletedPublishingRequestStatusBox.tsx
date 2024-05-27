import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PublishingTicket } from '../../../types/publication_types/ticket.types';
import { toDateString } from '../../../utils/date-helpers';
import { StyledStatusMessageBox } from '../../messages/components/PublishingRequestMessagesColumn';

interface CompletedPublishingRequestStatusBoxProps {
  ticket: PublishingTicket;
}

export const CompletedPublishingRequestStatusBox = ({ ticket }: CompletedPublishingRequestStatusBoxProps) => {
  const { t } = useTranslation();

  if (ticket.status !== 'Completed' || ticket.approvedFiles.length === 0) {
    return null;
  }

  return (
    <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
      <Typography>{t('my_page.messages.files_published', { count: ticket.approvedFiles.length })}</Typography>
      <Typography>{toDateString(ticket.modifiedDate)}</Typography>
    </StyledStatusMessageBox>
  );
};
