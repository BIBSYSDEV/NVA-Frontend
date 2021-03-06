import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { addMessage } from '../../api/registrationApi';
import { MessageForm } from '../../components/MessageForm';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { MessageCollection, MessageType } from '../../types/publication_types/messages.types';
import { Registration } from '../../types/registration.types';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { MessageList } from './MessageList';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';

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

const StyledStatus = styled(Typography)`
  grid-area: status;
  font-weight: bold;
`;

const StyledTitle = styled(Typography)`
  grid-area: title;
  font-weight: bold;
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

interface SupportRequestAccordionProps {
  messageCollection: MessageCollection;
  registration: Registration;
  fetchSupportRequests: () => void;
}

export const SupportRequestAccordion = ({
  messageCollection,
  registration,
  fetchSupportRequests,
}: SupportRequestAccordionProps) => {
  const { t } = useTranslation('workLists');
  const dispatch = useDispatch();
  const { identifier } = registration;

  const onClickSendMessage = async (message: string) => {
    const updateDoiRequestResponse = await addMessage(identifier, message, messageCollection.messageType);
    if (isErrorStatus(updateDoiRequestResponse.status)) {
      dispatch(setNotification(t('feedback:error.send_message'), NotificationVariant.Error));
    } else if (isSuccessStatus(updateDoiRequestResponse.status)) {
      dispatch(setNotification(t('feedback:success.send_message'), NotificationVariant.Success));
      fetchSupportRequests();
    }
  };

  return (
    <StyledAccordion data-testid={`message-${identifier}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <StyledStatus data-testid={`message-type-${identifier}`}>
          {messageCollection.messageType === MessageType.DoiRequest
            ? t('types.doi')
            : messageCollection.messageType === MessageType.Support
            ? t('types.support')
            : null}
        </StyledStatus>
        <StyledTitle data-testid={`message-title-${identifier}`}>
          {registration.entityDescription?.mainTitle}
        </StyledTitle>
        <StyledOwner data-testid={`message-owner-${identifier}`}>
          <Typography>{registration.owner}</Typography>
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
