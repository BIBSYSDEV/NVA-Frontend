import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Accordion, AccordionDetails, AccordionSummary, Button } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Label from '../../components/Label';
import { MessageForm } from '../../components/MessageForm';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { Message } from '../../types/publication_types/messages.types';
import { addMessage } from '../../api/registrationApi';
import { MessageList } from './MessageList';

const StyledAccordion = styled(Accordion)`
  width: 100%;
  margin: 0 1rem;
  .MuiAccordionSummary-content {
    display: grid;
    grid-template-areas: 'status title creator';
    grid-template-columns: 1fr 5fr 1fr;
    grid-column-gap: 1rem;
  }

  .MuiAccordionDetails-root {
    justify-content: space-between;
  }
`;

const StyledStatus = styled(Label)`
  grid-area: status;
`;

const StyledTitle = styled(Label)`
  grid-area: title;
`;

const StyledOwner = styled.div`
  word-break: break-word;
  grid-area: creator;
`;

const StyledMessages = styled.div`
  width: 75%;
  flex-direction: column;
`;

const StyledAccordionActionButtons = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

interface MessageAccordionProps {
  message: Message;
  refetchMessages: () => void;
}

export const MessageAccordion = ({ message, refetchMessages }: MessageAccordionProps) => {
  const { t } = useTranslation('workLists');
  const dispatch = useDispatch();
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const identifier = message.publication.identifier;

  const onClickSendMessage = async (message: string) => {
    setIsSendingMessage(true);
    const updatedDoiRequestWithMessage = await addMessage(identifier, message);
    if (updatedDoiRequestWithMessage) {
      if (updatedDoiRequestWithMessage.error) {
        dispatch(setNotification(t('feedback:error.send_message'), NotificationVariant.Error));
      } else {
        dispatch(setNotification(t('feedback:success.send_message'), NotificationVariant.Success));
        refetchMessages();
      }
      setIsSendingMessage(false);
    }
  };

  return (
    <StyledAccordion data-testid={`doi-request-${identifier}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <StyledStatus data-testid={`status-doi-request-${identifier}`}>
          {message.messages.some((m) => m.isDoiRequestRelated) ? t('types.doi') : t('types.support')}
        </StyledStatus>
        <StyledTitle data-testid={`title-doi-request-${identifier}`}>
          {message.publication.entityDescription?.mainTitle}
        </StyledTitle>
        <StyledOwner data-testid={`owner-doi-request-${identifier}`}>
          <Label>{message.publication.owner}</Label>
          {new Date(message.messages[message.messages.length - 1].date).toLocaleDateString()}
        </StyledOwner>
      </AccordionSummary>
      <AccordionDetails>
        <StyledMessages>
          <MessageList messages={message.messages} />
          <MessageForm
            confirmAction={async (message) => {
              onClickSendMessage(message);
            }}
            disabled={isSendingMessage}
          />
        </StyledMessages>
        <StyledAccordionActionButtons>
          <Button
            data-testid={`go-to-registration-${identifier}`}
            variant="outlined"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            component={RouterLink}
            to={getRegistrationLandingPagePath(identifier)}>
            {t('go_to_registration')}
          </Button>
        </StyledAccordionActionButtons>
      </AccordionDetails>
    </StyledAccordion>
  );
};
