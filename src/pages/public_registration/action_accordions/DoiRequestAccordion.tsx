import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  DialogActions,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  addTicketMessage,
  createDraftDoi,
  createTicket,
  updateTicket,
  UpdateTicketData,
} from '../../../api/registrationApi';
import { MessageForm } from '../../../components/MessageForm';
import { Modal } from '../../../components/Modal';
import { setNotification } from '../../../redux/notificationSlice';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { Registration, RegistrationStatus } from '../../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { DoiRequestMessagesColumn } from '../../messages/components/DoiRequestMessagesColumn';
import { TicketMessageList } from '../../messages/components/MessageList';
import { TicketAssignee } from './TicketAssignee';

interface DoiRequestAccordionProps {
  registration: Registration;
  refetchData: () => void;
  doiRequestTicket: Ticket | null;
  userIsCurator: boolean;
  isLoadingData: boolean;
  addMessage: (ticketId: string, message: string) => Promise<unknown>;
}

enum LoadingState {
  None,
  RequestDoi,
  RejectDoi,
  ApproveDoi,
  DraftDoi,
}

export const DoiRequestAccordion = ({
  registration,
  doiRequestTicket,
  refetchData,
  userIsCurator,
  isLoadingData,
  addMessage,
}: DoiRequestAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(LoadingState.None);
  const [messageToCurator, setMessageToCurator] = useState('');
  const [openRequestDoiModal, setOpenRequestDoiModal] = useState(false);
  const toggleRequestDoiModal = () => setOpenRequestDoiModal((open) => !open);

  const ticketMutation = useMutation({
    mutationFn: doiRequestTicket
      ? (newTicketData: UpdateTicketData) => {
          if (newTicketData.status === 'Completed') {
            setIsLoading(LoadingState.ApproveDoi);
          } else if (newTicketData.status === 'Closed') {
            setIsLoading(LoadingState.RejectDoi);
          }
          return updateTicket(doiRequestTicket.id, newTicketData);
        }
      : undefined,
    onSettled: () => setIsLoading(LoadingState.None),
    onSuccess: () => {
      dispatch(setNotification({ message: t('feedback.success.doi_request_updated'), variant: 'success' }));
      refetchData();
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_doi_request'), variant: 'error' })),
  });

  const isPublishedRegistration = registration.status === RegistrationStatus.Published;
  const isDraftRegistration = registration.status === RegistrationStatus.Draft;
  const isPendingDoiRequest = doiRequestTicket?.status === 'Pending' || doiRequestTicket?.status === 'New';
  const isClosedDoiRequest = doiRequestTicket?.status === 'Closed';

  const addDraftDoi = async () => {
    setIsLoading(LoadingState.DraftDoi);

    const createDraftDoiResponse = await createDraftDoi(registration.id);

    if (isErrorStatus(createDraftDoiResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.reserve_doi'), variant: 'error' }));
    } else if (isSuccessStatus(createDraftDoiResponse.status)) {
      dispatch(setNotification({ message: t('feedback.success.reserve_doi'), variant: 'success' }));
      refetchData();
    }
    setIsLoading(LoadingState.None);
  };

  const sendDoiRequest = async () => {
    setIsLoading(LoadingState.RequestDoi);
    const message = isPublishedRegistration ? messageToCurator : '';

    const createDoiRequestResponse = await createTicket(registration.id, 'DoiRequest', !!message);
    if (isErrorStatus(createDoiRequestResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_doi_request'), variant: 'error' }));
    } else if (isSuccessStatus(createDoiRequestResponse.status)) {
      const ticketId = createDoiRequestResponse.data?.id;
      // Add message
      if (ticketId && message) {
        await addTicketMessage(ticketId, message);
        // No need to show potential error message, since Ticket with actual DoiRequest is created anyway
      }

      if (openRequestDoiModal) {
        toggleRequestDoiModal();
      }
      dispatch(
        setNotification({
          message: t('feedback.success.doi_request_sent'),
          variant: 'success',
        })
      );
      refetchData();
    }
    setIsLoading(LoadingState.None);
  };

  const waitingForRemovalOfDoi = isClosedDoiRequest && !!registration.doi;
  const messages = doiRequestTicket?.messages ?? [];

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.doiRequestAccordion}
      sx={{ bgcolor: 'doiRequest.light' }}
      elevation={3}
      defaultExpanded={waitingForRemovalOfDoi || isPendingDoiRequest}>
      <AccordionSummary sx={{ fontWeight: 700 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
        {t('common.doi')}
        {doiRequestTicket && ` - ${t(`my_page.messages.ticket_types.${doiRequestTicket.status}`)}`}
      </AccordionSummary>
      <AccordionDetails>
        {doiRequestTicket && <TicketAssignee ticket={doiRequestTicket} refetchTickets={refetchData} />}

        {doiRequestTicket && <DoiRequestMessagesColumn ticket={doiRequestTicket} />}

        {!doiRequestTicket && registration.doi && (
          <Typography paragraph>{t('registration.public_page.tasks_panel.has_reserved_doi')}</Typography>
        )}

        {waitingForRemovalOfDoi && (
          <>
            <Typography gutterBottom>{t('registration.public_page.tasks_panel.waiting_for_rejected_doi')}</Typography>
            <LoadingButton
              variant="outlined"
              onClick={refetchData}
              loading={isLoadingData}
              startIcon={<RefreshIcon />}
              data-testid={dataTestId.registrationLandingPage.tasksPanel.refreshDoiRequestButton}>
              {t('registration.public_page.tasks_panel.reload')}
            </LoadingButton>
          </>
        )}

        {!doiRequestTicket && !registration.doi && (
          <>
            {isPublishedRegistration && (
              <LoadingButton
                variant="outlined"
                endIcon={<LocalOfferIcon />}
                loadingPosition="end"
                loading={isLoadingData || isLoading === LoadingState.RequestDoi}
                disabled={isLoading !== LoadingState.None}
                data-testid={dataTestId.registrationLandingPage.tasksPanel.requestDoiButton}
                onClick={toggleRequestDoiModal}>
                {t('registration.public_page.request_doi')}
              </LoadingButton>
            )}
            {isDraftRegistration && (
              <LoadingButton
                variant="outlined"
                endIcon={<LocalOfferIcon />}
                loadingPosition="end"
                loading={isLoadingData || isLoading === LoadingState.DraftDoi}
                disabled={isLoading !== LoadingState.None}
                data-testid={dataTestId.registrationLandingPage.tasksPanel.reserveDoiButton}
                onClick={addDraftDoi}>
                {t('registration.public_page.reserve_doi')}
              </LoadingButton>
            )}

            <Modal
              open={openRequestDoiModal}
              onClose={toggleRequestDoiModal}
              headingText={t('registration.public_page.request_doi')}
              dataTestId={dataTestId.registrationLandingPage.tasksPanel.requestDoiModal}>
              <Typography paragraph>{t('registration.public_page.request_doi_description')}</Typography>
              <TextField
                variant="outlined"
                multiline
                rows="4"
                fullWidth
                data-testid={dataTestId.registrationLandingPage.doiMessageField}
                label={t('registration.public_page.message_to_curator')}
                onChange={(event) => setMessageToCurator(event.target.value)}
              />
              <DialogActions>
                <Button onClick={toggleRequestDoiModal}>{t('common.cancel')}</Button>
                <LoadingButton
                  variant="contained"
                  data-testid={dataTestId.registrationLandingPage.tasksPanel.sendDoiButton}
                  onClick={sendDoiRequest}
                  loading={isLoadingData || isLoading !== LoadingState.None}>
                  {t('common.send')}
                </LoadingButton>
              </DialogActions>
            </Modal>
          </>
        )}

        {userIsCurator && isPublishedRegistration && isPendingDoiRequest && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
            <Typography>{t('registration.public_page.tasks_panel.assign_doi_about')}</Typography>
            <LoadingButton
              sx={{ bgcolor: 'white' }}
              variant="outlined"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.createDoiButton}
              endIcon={<CheckIcon />}
              loadingPosition="end"
              onClick={() => ticketMutation.mutate({ status: 'Completed' })}
              loading={isLoading === LoadingState.ApproveDoi}
              disabled={isLoadingData || isLoading !== LoadingState.None}>
              {t('registration.public_page.tasks_panel.assign_doi')}
            </LoadingButton>
            <LoadingButton
              sx={{ bgcolor: 'white' }}
              variant="outlined"
              data-testid={dataTestId.registrationLandingPage.rejectDoiButton}
              endIcon={<CloseIcon />}
              loadingPosition="end"
              onClick={() => ticketMutation.mutate({ status: 'Closed' })}
              loading={isLoading === LoadingState.RejectDoi}
              disabled={isLoadingData || isLoading !== LoadingState.None}>
              {t('common.reject_doi')}
            </LoadingButton>
          </Box>
        )}

        {isPendingDoiRequest && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem' }}>
            {messages.length > 0 ? (
              <TicketMessageList ticket={doiRequestTicket} canDeleteMessage={userIsCurator} refetchData={refetchData} />
            ) : (
              <Typography>{t('registration.public_page.publishing_request_message_about')}</Typography>
            )}
            <MessageForm confirmAction={async (message) => await addMessage(doiRequestTicket.id, message)} />
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
