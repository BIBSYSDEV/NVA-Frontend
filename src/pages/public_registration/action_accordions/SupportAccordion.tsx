import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { MessageList } from '../../messages/components/MessageList';
import { MessageForm } from '../../../components/MessageForm';
import { UpdateTicketData, createTicket, updateTicket } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { TicketAssignee } from './TicketAssignee';
import { useHistory } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useMutation } from '@tanstack/react-query';

interface SupportAccordionProps {
  registration: Registration;
  supportTicket: Ticket | null;
  userIsCurator: boolean;
  addMessage: (ticketId: string, message: string) => Promise<unknown>;
  refetchData: () => void;
}

export const SupportAccordion = ({
  registration,
  supportTicket,
  userIsCurator,
  addMessage,
  refetchData,
}: SupportAccordionProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  const ticketMutation = useMutation({
    mutationFn: supportTicket
      ? (newTicketData: UpdateTicketData) => {
          return updateTicket(supportTicket.id, newTicketData);
        }
      : undefined,
    onSuccess: () => {
      refetchData();
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_ticket_status'), variant: 'error' })),
  });

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
        bgcolor: 'generalSupportCase.light',
      }}
      elevation={3}>
      <AccordionSummary sx={{ fontWeight: 700 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
        {t('my_page.messages.types.GeneralSupportCase')}
        {supportTicket && ` - ${t(`my_page.messages.ticket_types.${supportTicket.status}`)}`}
      </AccordionSummary>
      <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {supportTicket && (
          <>
            {userIsCurator && !currentPath.startsWith('/registration') && (
              <LoadingButton
                sx={{ bgcolor: 'white' }}
                loading={ticketMutation.isLoading}
                variant="outlined"
                loadingPosition="end"
                disabled={supportTicket.status === 'Completed'}
                onClick={() => ticketMutation.mutate({ status: 'Completed' })}>
                {t('my_page.messages.mark_as_completed')}
              </LoadingButton>
            )}
            <TicketAssignee ticket={supportTicket} refetchTickets={refetchData} />
            {supportTicket.messages.length > 0 && <MessageList ticket={supportTicket} />}
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
