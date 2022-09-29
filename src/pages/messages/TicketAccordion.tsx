import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { addTicketMessage } from '../../api/registrationApi';
import { MessageForm } from '../../components/MessageForm';
import { setNotification } from '../../redux/notificationSlice';
import { Message, Ticket } from '../../types/publication_types/messages.types';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { MessageList } from './MessageList';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { RootState } from '../../redux/store';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { getRegistrationIdentifier, getTitleString } from '../../utils/registration-helpers';

interface TicketAccordionProps {
  ticket: Ticket;
}

export const TicketAccordion = ({ ticket }: TicketAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const username = useSelector((store: RootState) => store.user?.username);

  const registrationIdentifier = getRegistrationIdentifier(ticket.publication.id);

  const [messagesCopy, setMessagesCopy] = useState(ticket.messages);

  const onClickSendMessage = async (message: string) => {
    const updateDoiRequestResponse = await addTicketMessage(ticket.id, message);
    if (isErrorStatus(updateDoiRequestResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' }));
    } else if (isSuccessStatus(updateDoiRequestResponse.status)) {
      dispatch(setNotification({ message: t('feedback.success.send_message'), variant: 'success' }));
      const newMessage: Message = {
        ...messagesCopy[0],
        date: new Date().toString(),
        sender: username ?? '',
        text: message,
      };
      setMessagesCopy([...messagesCopy, newMessage]);
    }
  };

  return (
    <ErrorBoundary>
      <Accordion data-testid={`message-${registrationIdentifier}`}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon fontSize="large" />}
          sx={{
            '.MuiAccordionSummary-content': {
              display: 'grid',
              gridTemplateAreas: { xs: '"type date status" "title title title"', md: '"type title date status"' },
              gridTemplateColumns: { xs: '1fr 1fr 1fr', md: '1fr 5fr 1fr 1fr' },
              gap: '1rem',
            },
          }}>
          <Typography
            data-testid={`message-type-${registrationIdentifier}`}
            sx={{ gridArea: 'type', fontWeight: 'bold' }}>
            {ticket.type === 'DoiRequest'
              ? t('my_page.messages.types.doi')
              : ticket.type === 'GeneralSupportCase'
              ? t('my_page.messages.types.support')
              : ticket.type === 'PublishingRequest'
              ? t('my_page.messages.types.publishing_request')
              : null}
          </Typography>
          <Typography
            data-testid={`message-title-${registrationIdentifier}`}
            sx={{ gridArea: 'title', fontWeight: 'bold' }}>
            {getTitleString(ticket.publication.mainTitle)}
          </Typography>
          <Typography
            data-testid={`message-owner-${registrationIdentifier}`}
            sx={{ gridArea: 'date', fontWeight: 'bold' }}>
            {new Date(ticket.modifiedDate).toLocaleDateString()}
          </Typography>
          <Typography
            data-testid={`message-status-${registrationIdentifier}`}
            sx={{ gridArea: 'status', fontWeight: 'bold' }}>
            {t(`my_page.messages.ticket_types.${ticket.status}`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <MessageList messages={messagesCopy} />
            {ticket.status === 'Pending' && <MessageForm confirmAction={onClickSendMessage} />}
          </Box>
          <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <Button
              data-testid={`go-to-registration-${registrationIdentifier}`}
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              component={RouterLink}
              to={getRegistrationLandingPagePath(registrationIdentifier)}>
              {t('my_page.messages.go_to_registration')}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </ErrorBoundary>
  );
};
