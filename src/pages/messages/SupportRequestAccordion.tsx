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

interface SupportRequestAccordionProps {
  ticket: Ticket;
}

export const SupportRequestAccordion = ({ ticket }: SupportRequestAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const username = useSelector((store: RootState) => store.user?.username);

  const identifier =
    ticket.publicationSummary?.identifier ?? getRegistrationIdentifier(ticket.publication?.id ?? '') ?? '';

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
      <Accordion data-testid={`message-${identifier}`}>
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
          <Typography data-testid={`message-type-${identifier}`} sx={{ gridArea: 'status', fontWeight: 'bold' }}>
            {ticket.type === 'DoiRequest'
              ? t('my_page.messages.types.doi')
              : ticket.type === 'GeneralSupportCase'
              ? t('my_page.messages.types.support')
              : null}
          </Typography>
          <Typography data-testid={`message-title-${identifier}`} sx={{ gridArea: 'title', fontWeight: 'bold' }}>
            {getTitleString(ticket.publicationSummary?.mainTitle ?? ticket.publication?.mainTitle)}
          </Typography>
          <Typography data-testid={`message-owner-${identifier}`} sx={{ gridArea: 'creator', fontWeight: 'bold' }}>
            {new Date(ticket.modifiedDate).toLocaleDateString()}
          </Typography>
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
              {t('my_page.messages.go_to_registration')}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </ErrorBoundary>
  );
};
