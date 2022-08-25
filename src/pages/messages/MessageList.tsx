import { Fragment } from 'react';
import { Box, Typography } from '@mui/material';
import { Message } from '../../types/publication_types/messages.types';

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: '0.5rem',
    }}>
    {messages.map((message) => (
      <Fragment key={message.identifier}>
        <Typography>
          <b data-testid="message-author">{message.sender}</b>{' '}
          <span data-testid="message-timestamp">({new Date(message.createdDate).toLocaleDateString()})</span>:
        </Typography>
        <Typography data-testid="message-text">{message.text}</Typography>
      </Fragment>
    ))}
  </Box>
);
