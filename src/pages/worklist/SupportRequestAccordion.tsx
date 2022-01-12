import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { addMessage } from '../../api/registrationApi';
import { MessageForm } from '../../components/MessageForm';
import { setNotification } from '../../redux/actions/notificationActions';
import { Message, MessageCollection, MessageType } from '../../types/publication_types/messages.types';
import { RegistrationPreview } from '../../types/registration.types';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { MessageList } from './MessageList';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { RootStore } from '../../redux/reducers/rootReducer';

const StyledAccordion = styled(Accordion)`
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

interface SupportRequestAccordionProps {
  messageCollection: MessageCollection;
  registration: RegistrationPreview;
}

export const SupportRequestAccordion = ({ messageCollection, registration }: SupportRequestAccordionProps) => {
  const { t } = useTranslation('workLists');
  const dispatch = useDispatch();
  const userId = useSelector((store: RootStore) => store.user?.id);
  const { identifier } = registration;

  const [messagesCopy, setMessagesCopy] = useState(messageCollection.messages);

  const onClickSendMessage = async (message: string) => {
    const updateDoiRequestResponse = await addMessage(identifier, message, messageCollection.messageType);
    if (isErrorStatus(updateDoiRequestResponse.status)) {
      dispatch(setNotification(t('feedback:error.send_message'), 'error'));
    } else if (isSuccessStatus(updateDoiRequestResponse.status)) {
      dispatch(setNotification(t('feedback:success.send_message')));
      const newMessage: Message = {
        ...messagesCopy[0],
        date: new Date().toString(),
        sender: userId ?? '',
        text: message,
      };
      setMessagesCopy([...messagesCopy, newMessage]);
    }
  };

  return (
    <StyledAccordion data-testid={`message-${identifier}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <Typography data-testid={`message-type-${identifier}`} sx={{ gridArea: 'status', fontWeight: 'bold' }}>
          {messageCollection.messageType === MessageType.DoiRequest
            ? t('types.doi')
            : messageCollection.messageType === MessageType.Support
            ? t('types.support')
            : null}
        </Typography>
        <Typography data-testid={`message-title-${identifier}`} sx={{ gridArea: 'title', fontWeight: 'bold' }}>
          {registration.mainTitle}
        </Typography>
        <Box data-testid={`message-owner-${identifier}`} sx={{ wordBreak: 'break-word', gridArea: 'creator' }}>
          <Typography>{registration.owner}</Typography>
          {new Date(messagesCopy[messagesCopy.length - 1].date).toLocaleDateString()}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <MessageList messages={messagesCopy} />
          <MessageForm confirmAction={onClickSendMessage} />
        </Box>
        <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Button
            data-testid={`go-to-registration-${identifier}`}
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            component={RouterLink}
            to={getRegistrationLandingPagePath(identifier)}>
            {t('go_to_registration')}
          </Button>
        </Box>
      </AccordionDetails>
    </StyledAccordion>
  );
};
