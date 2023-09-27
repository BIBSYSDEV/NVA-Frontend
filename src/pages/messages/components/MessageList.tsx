import { Box, Button, Divider, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchUser } from '../../../api/roleApi';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getFullName } from '../../../utils/user-helpers';
import { ticketColor } from './TicketListItem';

interface MessageListProps {
  ticket: Ticket;
}

export const TicketMessageList = ({ ticket }: MessageListProps) => {
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
          <MessageItem
            key={message.identifier}
            text={message.text}
            date={message.createdDate}
            username={message.sender}
            backgroundColor={ticketColor[ticket.type]}
          />
        ))}
      </Box>
    </ErrorBoundary>
  );
};

interface MessageItemProps {
  text: ReactNode;
  date: string;
  username: string;
  backgroundColor: string;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export const MessageItem = ({ text, date, username, backgroundColor, onDelete, isDeleting }: MessageItemProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const senderQuery = useQuery({
    queryKey: [username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: t('feedback.error.get_person') },
  });

  const senderName = getFullName(senderQuery.data?.givenName, senderQuery.data?.familyName);

  return (
    <Box
      component="li"
      sx={{
        bgcolor: backgroundColor,
        p: '0.5rem',
        borderRadius: '4px',
        cursor: onDelete && !expanded ? 'pointer' : 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => setExpanded(true)}>
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
          {new Date(date).toLocaleDateString()}
        </span>
      </Typography>

      <Divider sx={{ mb: '0.5rem', bgcolor: 'primary.main' }} />

      {typeof text === 'string' ? (
        <Typography data-testid={dataTestId.registrationLandingPage.tasksPanel.messageText}>{text}</Typography>
      ) : (
        <div data-testid={dataTestId.registrationLandingPage.tasksPanel.messageText}>{text}</div>
      )}

      {expanded && onDelete && (
        <Button
          size="small"
          variant="outlined"
          disabled={isDeleting}
          sx={{ mt: '0.25rem', alignSelf: 'center' }}
          onClick={onDelete}>
          {t('common.undo')}
        </Button>
      )}
    </Box>
  );
};
