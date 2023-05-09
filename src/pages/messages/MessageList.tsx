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
      gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' },
      columnGap: '0.5rem',
    }}>
    {messages.map((message) => {
      const firstName = message.sender.preferredFirstName ?? message.sender.firstName;
      const lastName = message.sender.preferredLastName ?? message.sender.lastName;

      return (
        <Fragment key={message.identifier}>
          <Typography>
            <b data-testid="message-author">{`${firstName} ${lastName}`}</b>{' '}
            <span data-testid="message-timestamp">({new Date(message.createdDate).toLocaleDateString()})</span>:
          </Typography>
          <Typography data-testid="message-text">{message.text}</Typography>
        </Fragment>
      );
    })}
  </Box>
);
