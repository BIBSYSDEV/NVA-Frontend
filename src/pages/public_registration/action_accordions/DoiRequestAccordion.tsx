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
import { addTicketMessage, createTicket, updateTicketStatus } from '../../../api/registrationApi';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { Registration, RegistrationStatus } from '../../../types/registration.types';

interface DoiRequestAccordionProps {
  registration: Registration;
  refetchData: () => void;
  doiRequestTicket: Ticket | null;
  userIsCurator: boolean;
}

enum LoadingState {
  None,
  RequestDoi,
  RejectDoi,
  ApproveDoi,
}

export const DoiRequestAccordion = ({
  registration,
  doiRequestTicket,
  refetchData,
  userIsCurator,
}: DoiRequestAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(LoadingState.None);
  const [messageToCurator, setMessageToCurator] = useState('');
  const [openRequestDoiModal, setOpenRequestDoiModal] = useState(false);
  const toggleRequestDoiModal = () => setOpenRequestDoiModal((open) => !open);

  const isPublishedRegistration = registration.status === RegistrationStatus.Published;
  const isPendingDoiRequest = doiRequestTicket?.status === 'Pending';

  const sendDoiRequest = async () => {
    setIsLoading(LoadingState.RequestDoi);
    const message = isPublishedRegistration ? messageToCurator : '';

    const createDoiRequestResponse = await createTicket(registration.id, 'DoiRequest');
    if (isErrorStatus(createDoiRequestResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_doi_request'), variant: 'error' }));
      setIsLoading(LoadingState.None);
    } else if (isSuccessStatus(createDoiRequestResponse.status)) {
      const ticketId = createDoiRequestResponse.data.id;
      // Add message
      if (ticketId && message) {
        await addTicketMessage(ticketId, message);
        // No need to show potential error message, since Ticket with actual DoiRequest is created anyway
      }

      if (openRequestDoiModal) {
        toggleRequestDoiModal();
      }
      dispatch(setNotification({ message: t('feedback.success.doi_request_sent'), variant: 'success' }));
      refetchData();
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
        refetchData();
      }
    }
  };

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.doiRequestAccordion}
      elevation={3}
      defaultExpanded={isPendingDoiRequest && !registration.doi}>
      <AccordionSummary sx={{ fontWeight: 700 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
        {t('common.doi_long')}
      </AccordionSummary>
      <AccordionDetails>
        {isPendingDoiRequest && (
          <>
            <Typography paragraph>
              {registration.status === RegistrationStatus.Published
                ? 'Registreringen har en DOI-forespørsel til behandling for kurator. Gå til Meldinger for å se oppdatert status.'
                : registration.status === RegistrationStatus.Draft
                ? 'Registreringen har fått en reservert DOI. Når registreringen publiseres vil det automatisk bli opprettet en DOI-forespørsel som skal behandles av en kurator.'
                : null}
            </Typography>
            {!registration.doi && (
              <>
                <Typography gutterBottom>
                  Det kan ta litt tid før reservert DOI vises. Last innholdet på nytt for å sjekke igjen.
                </Typography>
                <Button variant="outlined" onClick={refetchData} startIcon={<RefreshIcon />}>
                  Last på nytt
                </Button>
              </>
            )}
          </>
        )}
        {doiRequestTicket?.status === 'Closed' && (
          <Typography paragraph>Registreringen har en avslått DOI-forespørsel.</Typography>
        )}

        {!doiRequestTicket && !registration.doi && (
          <>
            <LoadingButton
              variant="outlined"
              endIcon={<LocalOfferIcon />}
              loadingPosition="end"
              loading={isLoading === LoadingState.RequestDoi}
              disabled={isLoading !== LoadingState.None}
              data-testid={
                isPublishedRegistration
                  ? dataTestId.registrationLandingPage.tasksPanel.requestDoiButton
                  : dataTestId.registrationLandingPage.tasksPanel.reserveDoiButton
              }
              onClick={isPublishedRegistration ? toggleRequestDoiModal : sendDoiRequest}>
              {isPublishedRegistration
                ? t('registration.public_page.request_doi')
                : t('registration.public_page.reserve_doi')}
            </LoadingButton>

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
                  loading={isLoading !== LoadingState.None}>
                  {t('common.send')}
                </LoadingButton>
              </DialogActions>
            </Modal>
          </>
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
              disabled={isLoading !== LoadingState.None}>
              {t('common.create_doi')}
            </LoadingButton>
            <LoadingButton
              variant="contained"
              data-testid={dataTestId.registrationLandingPage.rejectDoiButton}
              endIcon={<CloseIcon />}
              loadingPosition="end"
              onClick={() => updatePendingDoiRequest('Closed')}
              loading={isLoading === LoadingState.RejectDoi}
              disabled={isLoading !== LoadingState.None}>
              {t('common.reject_doi')}
            </LoadingButton>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
