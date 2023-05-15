import { Box, Typography } from '@mui/material';
import { Message } from '../../types/publication_types/messages.types';
import { ErrorBoundary } from '../../components/ErrorBoundary';

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
      {messages.map((message) => {
        const firstName = message.sender.preferredFirstName ?? message.sender.firstName;
        const lastName = message.sender.preferredLastName ?? message.sender.lastName;

        return (
          <li key={message.identifier}>
            <Typography>
              <b data-testid="message-author">{`${firstName} ${lastName}`}</b>{' '}
              <span data-testid="message-timestamp">({new Date(message.createdDate).toLocaleString()})</span>
            </Typography>
            <Typography data-testid="message-text">{message.text}</Typography>
          </li>
        );
      })}
    </Box>
  </ErrorBoundary>
);
