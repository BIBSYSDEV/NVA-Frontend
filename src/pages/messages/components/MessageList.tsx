import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Message } from '../../../types/publication_types/messages.types';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { fetchUser } from '../../../api/roleApi';
import { getFullName } from '../../../utils/user-helpers';

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => (
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
        <MessageItem message={message} />
      ))}
    </Box>
  </ErrorBoundary>
);

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  const senderQuery = useQuery({
    queryKey: [message.sender],
    queryFn: () => fetchUser(message.sender),
  });
  const senderName = getFullName(senderQuery.data?.givenName, senderQuery.data?.familyName);

  return (
    <li key={message.identifier}>
      <Typography>
        <b data-testid="message-author">{senderName}</b>{' '}
        <span data-testid="message-timestamp">({new Date(message.createdDate).toLocaleString()})</span>
      </Typography>
      <Typography data-testid="message-text">{message.text}</Typography>
    </li>
  );
};
