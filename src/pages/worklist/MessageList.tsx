import React, { FC, Fragment } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { DoiRequestMessage } from '../../types/registration.types';

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
  messages: DoiRequestMessage[];
}
const MessageList: FC<MessageListProps> = ({ messages }) => (
  <StyledMessagesContainer>
    {messages.map((message) => (
      <Fragment key={message.timestamp}>
        <StyledAuthorTypography>
          <b>{message.author}</b> ({new Date(message.timestamp).toLocaleDateString()}):
        </StyledAuthorTypography>
        <StyledTextTypography>{message.text}</StyledTextTypography>
      </Fragment>
    ))}
  </StyledMessagesContainer>
);

export default MessageList;
