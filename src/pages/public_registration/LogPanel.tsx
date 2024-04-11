import { PublishingTicket, Ticket, TicketStatus } from '../../types/publication_types/ticket.types';
import { Box, Typography } from '@mui/material';
import { CompletedPublishingRequestStatusBox } from './action_accordions/CompletedPublishingRequestStatusBox';
import { DoiRequestMessagesColumn } from '../messages/components/DoiRequestMessagesColumn';
import { StyledStatusMessageBox } from '../messages/components/PublishingRequestMessagesColumn';
import { useTranslation } from 'react-i18next';

interface LogPanelProps {
  tickets: Ticket[];
  registrationPublishedDate: string;
}

export const LogPanel = ({ tickets, registrationPublishedDate }: LogPanelProps) => {
  const { t } = useTranslation();
  const ticketStatusesToShow: TicketStatus[] = ['Completed', 'Closed'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '0.5rem' }}>
      {registrationPublishedDate && (
        <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
          <Typography>{t('registration.status.PUBLISHED_METADATA')}</Typography>
          <Typography>{new Date(registrationPublishedDate).toLocaleDateString()}</Typography>
        </StyledStatusMessageBox>
      )}
      {tickets
        .filter((ticket) => ticketStatusesToShow.includes(ticket.status))
        .sort((a, b) => +a.modifiedDate - +b.modifiedDate)
        .map((ticket) => {
          if (ticket.type === 'PublishingRequest') {
            return <CompletedPublishingRequestStatusBox key={ticket.id} ticket={ticket as PublishingTicket} />;
          }
          if (ticket.type === 'DoiRequest') {
            return <DoiRequestMessagesColumn key={ticket.id} ticket={ticket} />;
          }
          return null;
        })}
    </Box>
  );
};
