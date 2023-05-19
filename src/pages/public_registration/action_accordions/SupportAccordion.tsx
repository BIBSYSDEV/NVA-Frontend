import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { MessageList } from '../../messages/components/MessageList';
import { MessageForm } from '../../../components/MessageForm';
import { createTicket } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { TicketAssignee } from './TicketAssignee';

interface SupportAccordionProps {
  registration: Registration;
  supportTicket: Ticket | null;
  addMessage: (ticketId: string, message: string) => Promise<unknown>;
}

export const SupportAccordion = ({ registration, supportTicket, addMessage }: SupportAccordionProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const createSupportTicket = async (message: string) => {
    const createTicketResponse = await createTicket(registration.id, 'GeneralSupportCase', true);

    if (isErrorStatus(createTicketResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' }));
    } else if (isSuccessStatus(createTicketResponse.status)) {
      const ticketId = createTicketResponse.data?.id;
      if (ticketId) {
        await addMessage(ticketId, message);
      }
    }
  };

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.supportAccordion}
      sx={{
        borderLeft: '1.25rem solid',
        borderLeftColor: 'generalSupportCase.main',
      }}
      elevation={3}>
      <AccordionSummary sx={{ fontWeight: 700 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
        {t('my_page.messages.types.GeneralSupportCase')}
      </AccordionSummary>
      <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {supportTicket && (
          <>
            <TicketAssignee ticket={supportTicket} />
            {supportTicket.messages.length > 0 && <MessageList messages={supportTicket.messages} />}
          </>
        )}
        <MessageForm
          confirmAction={async (message) => {
            if (message) {
              if (supportTicket) {
                await addMessage(supportTicket.id, message);
              } else {
                await createSupportTicket(message);
              }
            }
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
};
