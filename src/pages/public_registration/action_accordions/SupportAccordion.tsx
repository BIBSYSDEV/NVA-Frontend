import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { createTicket, updateTicket, UpdateTicketData } from '../../../api/registrationApi';
import { MessageForm } from '../../../components/MessageForm';
import { RegistrationErrorActions } from '../../../components/RegistrationErrorActions';
import { TicketStatusChip } from '../../../components/StatusChip';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { SelectedTicketTypeLocationState } from '../../../types/locationState.types';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { Registration } from '../../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getTabErrors, validateRegistrationForm } from '../../../utils/formik-helpers/formik-helpers';
import { userHasAccessRight } from '../../../utils/registration-helpers';
import { invalidateQueryKeyDueToReindexing } from '../../../utils/searchHelpers';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { TicketMessageList } from '../../messages/components/MessageList';
import { TicketAssignee } from './TicketAssignee';

interface SupportAccordionProps {
  registration: Registration;
  supportTicket?: Ticket;
  addMessage: (ticketId: string, message: string) => Promise<unknown>;
  refetchData: () => Promise<void>;
}

export const SupportAccordion = ({ registration, supportTicket, addMessage, refetchData }: SupportAccordionProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state as SelectedTicketTypeLocationState | undefined;

  const user = useSelector((store: RootState) => store.user);
  const userIsTicketOwner = user && supportTicket?.owner === user.nvaUsername;

  const queryClient = useQueryClient();
  const ticketMutation = useMutation({
    mutationFn: supportTicket
      ? (newTicketData: UpdateTicketData) => updateTicket(supportTicket.id, newTicketData)
      : undefined,
    onSuccess: refetchData,
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_ticket_status'), variant: 'error' })),
  });

  const createSupportTicket = async (message: string) => {
    const createTicketResponse = await createTicket(registration.id, 'GeneralSupportCase', message);

    if (isErrorStatus(createTicketResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' }));
    } else if (isSuccessStatus(createTicketResponse.status)) {
      await refetchData();
      dispatch(setNotification({ message: t('feedback.success.send_message'), variant: 'success' }));
    }
  };

  const formErrors = validateRegistrationForm(registration);
  const registrationIsValid = Object.keys(formErrors).length === 0;
  const tabErrors = !registrationIsValid ? getTabErrors(registration, formErrors) : null;

  const isPendingSupportTicket = supportTicket?.status === 'New' || supportTicket?.status === 'Pending';
  const userHasReadTicket = !!user?.nvaUsername && !!supportTicket?.viewedBy.includes(user.nvaUsername);
  const isOnTasksPage = window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue);

  const userCanCompleteTicket = userHasAccessRight(registration, 'support-request-approve');

  const defaultExpanded = locationState?.selectedTicketType
    ? locationState.selectedTicketType === 'GeneralSupportCase'
    : isPendingSupportTicket || !userHasReadTicket;

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.supportAccordion}
      sx={{
        bgcolor: 'background.neutral97',
        '& .MuiAccordionSummary-content': {
          alignItems: 'center',
          gap: '0.5rem',
        },
      }}
      elevation={3}
      defaultExpanded={defaultExpanded}>
      <AccordionSummary sx={{ fontWeight: 700 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <Typography fontWeight="bold" sx={{ flexGrow: '1' }}>
          {t('my_page.messages.types.GeneralSupportCase')}
        </Typography>
        {supportTicket && isOnTasksPage && <TicketStatusChip ticket={supportTicket} />}
      </AccordionSummary>
      <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isOnTasksPage && (
          <Trans i18nKey="my_page.messages.contact_curator_if_you_need_assistance" components={{ p: <Typography /> }} />
        )}

        {supportTicket && (
          <>
            <TicketAssignee ticket={supportTicket} refetchTickets={refetchData} />
            {userCanCompleteTicket && isOnTasksPage && supportTicket.status !== 'Completed' && (
              <Button
                color="tertiary"
                variant="contained"
                sx={{ alignSelf: 'center', width: 'fit-content' }}
                loading={ticketMutation.isPending}
                onClick={async () => {
                  await ticketMutation.mutateAsync({ status: 'Completed' });
                  invalidateQueryKeyDueToReindexing(queryClient, 'taskNotifications');
                }}>
                {t('my_page.messages.mark_as_completed')}
              </Button>
            )}

            {isOnTasksPage && tabErrors && (
              <RegistrationErrorActions tabErrors={tabErrors} registration={registration} />
            )}

            {supportTicket.messages.length > 0 && <TicketMessageList ticket={supportTicket} />}
          </>
        )}
        <MessageForm
          hideRequiredAsterisk
          confirmAction={async (message) => {
            if (message) {
              if (supportTicket) {
                await addMessage(supportTicket.id, message);
                if (userCanCompleteTicket && !userIsTicketOwner) {
                  await updateTicket(supportTicket.id, { status: 'Completed' });
                  invalidateQueryKeyDueToReindexing(queryClient, 'taskNotifications');
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
