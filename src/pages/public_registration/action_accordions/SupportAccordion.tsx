import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LoadingButton } from '@mui/lab';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createTicket, updateTicket, UpdateTicketData } from '../../../api/registrationApi';
import { MessageForm } from '../../../components/MessageForm';
import { RegistrationErrorActions } from '../../../components/RegistrationErrorActions';
import { setNotification } from '../../../redux/notificationSlice';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { Registration } from '../../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getTabErrors, validateRegistrationForm } from '../../../utils/formik-helpers/formik-helpers';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { TicketMessageList } from '../../messages/components/MessageList';
import { TicketAssignee } from './TicketAssignee';

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

  const ticketMutation = useMutation({
    mutationFn: supportTicket
      ? (newTicketData: UpdateTicketData) => updateTicket(supportTicket.id, newTicketData)
      : undefined,
    onSuccess: refetchData,
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

  const formErrors = validateRegistrationForm(registration);
  const registrationIsValid = Object.keys(formErrors).length === 0;
  const tabErrors = !registrationIsValid ? getTabErrors(registration, formErrors) : null;

  const isPendingSupportTicket = supportTicket?.status === 'New' || supportTicket?.status === 'Pending';
  const ownerHasReadTicket = supportTicket?.viewedBy.includes(supportTicket?.owner);
  const isOnTasksPage = window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue);

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.supportAccordion}
      sx={{ bgcolor: 'generalSupportCase.light' }}
      elevation={3}
      defaultExpanded={isPendingSupportTicket || !ownerHasReadTicket}>
      <AccordionSummary sx={{ fontWeight: 700 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
        {t('my_page.messages.types.GeneralSupportCase')}
        {supportTicket && ` - ${t(`my_page.messages.ticket_types.${supportTicket.status}`)}`}
      </AccordionSummary>
      <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isOnTasksPage && <Typography>{t('my_page.messages.contact_curator_if_you_need_assistance')}</Typography>}

        {supportTicket && (
          <>
            <TicketAssignee ticket={supportTicket} refetchTickets={refetchData} />
            {userIsCurator && isOnTasksPage && supportTicket.status !== 'Completed' && (
              <LoadingButton
                sx={{
                  alignSelf: 'center',
                  width: 'fit-content',
                  bgcolor: 'white',
                }}
                loading={ticketMutation.isPending}
                variant="outlined"
                onClick={() => ticketMutation.mutate({ status: 'Completed' })}>
                {t('my_page.messages.mark_as_completed')}
              </LoadingButton>
            )}

            {isOnTasksPage && tabErrors && (
              <RegistrationErrorActions tabErrors={tabErrors} registrationIdentifier={registration.identifier} />
            )}

            {supportTicket.messages.length > 0 && (
              <TicketMessageList ticket={supportTicket} refetchData={refetchData} canDeleteMessage={userIsCurator} />
            )}
          </>
        )}
        <MessageForm
          hideRequiredAsterisk
          confirmAction={async (message) => {
            if (message) {
              if (supportTicket) {
                await addMessage(supportTicket.id, message);
                if (userIsCurator) {
                  await updateTicket(supportTicket.id, { status: 'Completed' });
                }
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
