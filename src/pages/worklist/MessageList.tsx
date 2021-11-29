import { Fragment } from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';
import { Message } from '../../types/publication_types/messages.types';

const StyledMessagesContainer = styled.div`
  display: grid;
  grid-template-areas: 'author text';
  grid-template-columns: auto 1fr;
  grid-column-gap: 0.5rem;
`;

const StyledAuthorTypography = styled(Typography)`
  grid-area: 'author';
`;

const StyledTextTypography = styled(Typography)`
  grid-area: 'text';
`;

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => (
  <StyledMessagesContainer>
    {messages.map((message) => (
      <Fragment key={message.date}>
        <StyledAuthorTypography>
          <b data-testid="message-author">{message.sender}</b>{' '}
          <span data-testid="message-timestamp">({new Date(message.date).toLocaleDateString()})</span>:
        </StyledAuthorTypography>
        <StyledTextTypography data-testid="message-text">{message.text}</StyledTextTypography>
      </Fragment>
    ))}
  </StyledMessagesContainer>
);
