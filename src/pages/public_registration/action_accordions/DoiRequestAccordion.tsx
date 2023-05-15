import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Ticket, TicketStatus } from '../../../types/publication_types/messages.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { Modal } from '../../../components/Modal';
import { setNotification } from '../../../redux/notificationSlice';
import { addTicketMessage, createDraftDoi, createTicket, updateTicketStatus } from '../../../api/registrationApi';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { Registration, RegistrationStatus } from '../../../types/registration.types';
import { MessageList } from '../../messages/components/MessageList';
import { MessageForm } from '../../../components/MessageForm';

interface DoiRequestAccordionProps {
  registration: Registration;
  refetchRegistrationAndTickets: () => void;
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
  refetchRegistrationAndTickets,
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

  const isPublishedRegistration = registration.status === RegistrationStatus.Published;
  const isDraftRegistration = registration.status === RegistrationStatus.Draft;
  const isPendingDoiRequest = doiRequestTicket?.status === 'Pending';
  const isClosedDoiRequest = doiRequestTicket?.status === 'Closed';

  const addDraftDoi = async () => {
    setIsLoading(LoadingState.DraftDoi);

    const createDraftDoiResponse = await createDraftDoi(registration.id);

    if (isErrorStatus(createDraftDoiResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.reserve_doi'), variant: 'error' }));
      setIsLoading(LoadingState.None);
    } else if (isSuccessStatus(createDraftDoiResponse.status)) {
      dispatch(setNotification({ message: t('feedback.success.reserve_doi'), variant: 'success' }));
      refetchRegistrationAndTickets();
    }
  };

  const sendDoiRequest = async () => {
    setIsLoading(LoadingState.RequestDoi);
    const message = isPublishedRegistration ? messageToCurator : '';

    const createDoiRequestResponse = await createTicket(registration.id, 'DoiRequest', !!message);
    if (isErrorStatus(createDoiRequestResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_doi_request'), variant: 'error' }));
      setIsLoading(LoadingState.None);
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
      refetchRegistrationAndTickets();
    }
  };

  const updatePendingDoiRequest = async (status: TicketStatus) => {
    if (doiRequestTicket) {
      if (status === 'Completed') {
        setIsLoading(LoadingState.ApproveDoi);
      } else {
        setIsLoading(LoadingState.RejectDoi);
      }

      const updateTicketStatusResponse = await updateTicketStatus(doiRequestTicket.id, 'DoiRequest', status);
      if (isErrorStatus(updateTicketStatusResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_doi_request'), variant: 'error' }));
        setIsLoading(LoadingState.None);
      } else if (isSuccessStatus(updateTicketStatusResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.doi_request_updated'), variant: 'success' }));
        refetchRegistrationAndTickets();
      }
    }
  };

  const waitingForRemovalOfDoi = isClosedDoiRequest && !!registration.doi;
  const messages = doiRequestTicket?.messages ?? [];

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.doiRequestAccordion}
      elevation={3}
      defaultExpanded={waitingForRemovalOfDoi || (userIsCurator && isPendingDoiRequest)}>
      <AccordionSummary sx={{ fontWeight: 700 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
        {t('common.doi_long')}
      </AccordionSummary>
      <AccordionDetails>
        {!doiRequestTicket && registration.doi && (
          <Typography paragraph>{t('registration.public_page.tasks_panel.has_reserved_doi')}</Typography>
        )}

        {isPendingDoiRequest && (
          <Typography paragraph>{t('registration.public_page.tasks_panel.has_doi_request')}</Typography>
        )}

        {isClosedDoiRequest && (
          <>
            <Typography paragraph>{t('registration.public_page.tasks_panel.has_rejected_doi_request')}</Typography>
            {waitingForRemovalOfDoi && (
              <>
                <Typography gutterBottom>
                  {t('registration.public_page.tasks_panel.waiting_for_rejected_doi')}
                </Typography>
                <LoadingButton
                  variant="outlined"
                  onClick={refetchRegistrationAndTickets}
                  loading={isLoadingData}
                  startIcon={<RefreshIcon />}
                  data-testid={dataTestId.registrationLandingPage.tasksPanel.refreshDoiRequestButton}>
                  {t('registration.public_page.tasks_panel.reload')}
                </LoadingButton>
              </>
            )}
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

        {isPendingDoiRequest && (
          <Accordion elevation={3} sx={{ maxWidth: '60rem', my: '1rem' }}>
            <AccordionSummary sx={{ fontWeight: 700 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
              {`${t('my_page.messages.messages')} (${messages.length})`}
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <MessageList messages={messages} />
                <MessageForm confirmAction={async (message) => await addMessage(doiRequestTicket.id, message)} />
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {userIsCurator && isPublishedRegistration && isPendingDoiRequest && (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <LoadingButton
              variant="contained"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.createDoiButton}
              endIcon={<CheckIcon />}
              loadingPosition="end"
              onClick={() => updatePendingDoiRequest('Completed')}
              loading={isLoading === LoadingState.ApproveDoi}
              disabled={isLoadingData || isLoading !== LoadingState.None}>
              {t('common.create_doi')}
            </LoadingButton>
            <LoadingButton
              variant="contained"
              data-testid={dataTestId.registrationLandingPage.rejectDoiButton}
              endIcon={<CloseIcon />}
              loadingPosition="end"
              onClick={() => updatePendingDoiRequest('Closed')}
              loading={isLoading === LoadingState.RejectDoi}
              disabled={isLoadingData || isLoading !== LoadingState.None}>
              {t('common.reject_doi')}
            </LoadingButton>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
