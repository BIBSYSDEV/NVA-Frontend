import React from 'react';
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
import { MessageCollection, MessageType } from '../../types/publication_types/messages.types';
import { addMessage } from '../../api/registrationApi';
import { MessageList } from './MessageList';
import { Registration } from '../../types/registration.types';

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
  messageCollection: MessageCollection;
  registration: Registration;
  refetchMessages: () => void;
}

export const MessageAccordion = ({ messageCollection, registration, refetchMessages }: MessageAccordionProps) => {
  const { t } = useTranslation('workLists');
  const dispatch = useDispatch();
  const identifier = registration.identifier;

  const onClickSendMessage = async (message: string) => {
    const updatedDoiRequestWithMessage = await addMessage(identifier, message, messageCollection.messageType);
    if (updatedDoiRequestWithMessage) {
      if (updatedDoiRequestWithMessage.error) {
        dispatch(setNotification(t('feedback:error.send_message'), NotificationVariant.Error));
      } else {
        dispatch(setNotification(t('feedback:success.send_message'), NotificationVariant.Success));
        refetchMessages();
      }
    }
  };

  return (
    <StyledAccordion data-testid={`message-${identifier}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <StyledStatus data-testid={`message-type-${identifier}`}>
          {messageCollection.messageType === MessageType.DoiRequest ? t('types.doi') : t('types.support')}
        </StyledStatus>
        <StyledTitle data-testid={`message-title-${identifier}`}>
          {registration.entityDescription?.mainTitle}
        </StyledTitle>
        <StyledOwner data-testid={`message-owner-${identifier}`}>
          <Label>{registration.owner}</Label>
          {new Date(messageCollection.messages[messageCollection.messages.length - 1].date).toLocaleDateString()}
        </StyledOwner>
      </AccordionSummary>
      <AccordionDetails>
        <StyledMessages>
          <MessageList messages={messageCollection.messages} />
          <MessageForm confirmAction={onClickSendMessage} />
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
