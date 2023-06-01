import { Box, Divider, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Message, Ticket, TicketType } from '../../../types/publication_types/ticket.types';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { fetchUser } from '../../../api/roleApi';
import { getFullName } from '../../../utils/user-helpers';
import { dataTestId } from '../../../utils/dataTestIds';
import { ticketColor } from './TicketListItem';

interface MessageListProps {
  ticket: Ticket;
}

export const MessageList = ({ ticket }: MessageListProps) => {
  const messages = ticket.messages ?? [];

  return (
    <ErrorBoundary>
      <Box
        component="ul"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          listStyleType: 'none',
          p: 0,
          m: 0,
          gap: '0.25rem',
        }}>
        {messages.map((message) => (
          <MessageItem key={message.identifier} message={message} ticketType={ticket.type} />
        ))}
      </Box>
    </ErrorBoundary>
  );
};

interface MessageItemProps {
  message: Message;
  ticketType: TicketType;
}

const MessageItem = ({ message, ticketType }: MessageItemProps) => {
  const { t } = useTranslation();

  const senderQuery = useQuery({
    queryKey: [message.sender],
    queryFn: () => fetchUser(message.sender),
    meta: { errorMessage: t('feedback.error.get_person') },
  });

  const senderName = getFullName(senderQuery.data?.givenName, senderQuery.data?.familyName);

  return (
    <Box
      component={'li'}
      sx={{ bgcolor: ticketColor[ticketType], p: '0.5rem', borderRadius: '4px', maxWidth: '20rem' }}>
      <Typography sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <span>
          {senderQuery.isLoading ? (
            <Skeleton sx={{ width: '8rem' }} />
          ) : (
            <b data-testid={dataTestId.registrationLandingPage.tasksPanel.messageSender}>
              {senderName ? senderName : <i>{t('common.unknown')}</i>}
            </b>
          )}
        </span>
        <span data-testid={dataTestId.registrationLandingPage.tasksPanel.messageTimestamp}>
          {new Date(message.createdDate).toLocaleDateString()}
        </span>
      </Typography>

      <Divider sx={{ mb: '0.5rem', bgcolor: 'primary.main' }} />

      <Typography data-testid={dataTestId.registrationLandingPage.tasksPanel.messageText}>{message.text}</Typography>
    </Box>
  );
};
