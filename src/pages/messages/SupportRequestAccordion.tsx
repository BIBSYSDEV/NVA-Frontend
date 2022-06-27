import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { addMessage } from '../../api/registrationApi';
import { MessageForm } from '../../components/MessageForm';
import { setNotification } from '../../redux/notificationSlice';
import { Message, MessageType } from '../../types/publication_types/messages.types';
import { RegistrationPreview } from '../../types/registration.types';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { MessageList } from './MessageList';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { RootState } from '../../redux/store';
import { ErrorBoundary } from '../../components/ErrorBoundary';

interface SupportRequestAccordionProps {
  messageType: MessageType;
  messages: Message[];
  registration: RegistrationPreview;
}

export const SupportRequestAccordion = ({ registration, messageType, messages }: SupportRequestAccordionProps) => {
  const { t } = useTranslation('myPage');
  const dispatch = useDispatch();
  const userId = useSelector((store: RootState) => store.user?.id);

  const [messagesCopy, setMessagesCopy] = useState(messages);

  const onClickSendMessage = async (message: string) => {
    const updateDoiRequestResponse = await addMessage(registration.identifier, message, messageType);
    if (isErrorStatus(updateDoiRequestResponse.status)) {
      dispatch(setNotification({ message: t('feedback:error.send_message'), variant: 'error' }));
    } else if (isSuccessStatus(updateDoiRequestResponse.status)) {
      dispatch(setNotification({ message: t('feedback:success.send_message'), variant: 'success' }));
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
    <ErrorBoundary>
      <Accordion data-testid={`message-${registration.identifier}`}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon fontSize="large" />}
          sx={{
            '.MuiAccordionSummary-content': {
              display: 'grid',
              gridTemplateAreas: { xs: '"status creator" "title title"', md: '"status title creator"' },
              gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 5fr 1fr' },
              gap: '1rem',
            },
          }}>
          <Typography
            data-testid={`message-type-${registration.identifier}`}
            sx={{ gridArea: 'status', fontWeight: 'bold' }}>
            {messageType === MessageType.DoiRequest
              ? t('messages.types.doi')
              : messageType === MessageType.Support
              ? t('messages.types.support')
              : null}
          </Typography>
          <Typography
            data-testid={`message-title-${registration.identifier}`}
            sx={{ gridArea: 'title', fontWeight: 'bold' }}>
            {registration.mainTitle}
          </Typography>
          <Typography
            data-testid={`message-owner-${registration.identifier}`}
            sx={{ gridArea: 'creator', fontWeight: 'bold' }}>
            {new Date(messagesCopy[messagesCopy.length - 1].date).toLocaleDateString()}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <MessageList messages={messagesCopy} />
            <MessageForm confirmAction={onClickSendMessage} />
          </Box>
          <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <Button
              data-testid={`go-to-registration-${registration.identifier}`}
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              component={RouterLink}
              to={getRegistrationLandingPagePath(registration.identifier)}>
              {t('messages.go_to_registration')}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </ErrorBoundary>
  );
};
