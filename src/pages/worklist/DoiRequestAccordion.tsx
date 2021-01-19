import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Accordion, AccordionDetails, AccordionSummary, Button } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { updateDoiRequestWithMessage } from '../../api/doiRequestApi';
import Label from '../../components/Label';
import { MessageForm } from '../../components/MessageForm';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import useFetchRegistration from '../../utils/hooks/useFetchRegistration';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import MessageList from './MessageList';

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

  button,
  a {
    width: 100%;
    :last-child {
      margin-top: 1rem;
    }
  }
`;

interface DoiRequestAccordionProps {
  identifier: string;
}

export const DoiRequestAccordion = ({ identifier }: DoiRequestAccordionProps) => {
  const { t } = useTranslation('workLists');
  const dispatch = useDispatch();
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [registration, , refetchRegistration] = useFetchRegistration(identifier);

  if (!registration?.doiRequest) {
    return null;
  }

  const onClickSendMessage = async (message: string) => {
    setIsSendingMessage(true);
    const updatedDoiRequestWithMessage = await updateDoiRequestWithMessage(identifier, message);
    if (updatedDoiRequestWithMessage) {
      if (updatedDoiRequestWithMessage.error) {
        dispatch(setNotification(t('feedback:error.message_failed'), NotificationVariant.Error));
      } else {
        dispatch(setNotification(t('feedback:success.message_sent'), NotificationVariant.Success));
        refetchRegistration();
      }
      setIsSendingMessage(false);
    }
  };

  return (
    <StyledAccordion data-testid={`doi-request-${identifier}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <StyledStatus>{t(`doi_requests.status.${registration?.doiRequest.status}`)}</StyledStatus>
        <StyledTitle>{registration?.entityDescription?.mainTitle}</StyledTitle>
        <StyledOwner>
          <Label>{registration?.owner}</Label>
          {new Date(registration?.doiRequest.createdDate).toLocaleDateString()}
        </StyledOwner>
      </AccordionSummary>
      <AccordionDetails>
        <StyledMessages>
          {registration?.doiRequest.messages && <MessageList messages={registration?.doiRequest.messages} />}
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
            component={RouterLink}
            to={getRegistrationLandingPagePath(identifier)}>
            {t('doi_requests.go_to_registration')}
          </Button>
          <Button variant="contained" color="primary" disabled>
            {t('doi_requests.archive')}
          </Button>
        </StyledAccordionActionButtons>
      </AccordionDetails>
    </StyledAccordion>
  );
};
