import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  DialogActions,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'react-redux';
import { Ticket } from '../../../types/publication_types/messages.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { Modal } from '../../../components/Modal';
import { setNotification } from '../../../redux/notificationSlice';
import { addTicketMessage, createTicket } from '../../../api/registrationApi';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { RegistrationStatus } from '../../../types/registration.types';
import { ActionPanelProps } from '../ActionPanel';

interface DoiRequestAccordionProps extends ActionPanelProps {
  doiRequest: Ticket | null;
}

export const DoiRequestAccordion = ({ registration, doiRequest, refetchRegistration }: DoiRequestAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [messageToCurator, setMessageToCurator] = useState('');
  const [openRequestDoiModal, setOpenRequestDoiModal] = useState(false);
  const toggleRequestDoiModal = () => setOpenRequestDoiModal((open) => !open);

  const isPublishedRegistration = registration.status === RegistrationStatus.Published;

  const sendDoiRequest = async () => {
    setIsLoading(true);
    const message = isPublishedRegistration ? messageToCurator : t('registration.public_page.reserve_doi_message');

    const createDoiRequestResponse = await createTicket(registration.id, 'DoiRequest');
    if (isErrorStatus(createDoiRequestResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_doi_request'), variant: 'error' }));
      setIsLoading(false);
    } else if (isSuccessStatus(createDoiRequestResponse.status)) {
      const ticketId = createDoiRequestResponse.data.id;
      // Add message
      if (ticketId && message) {
        await addTicketMessage(ticketId, message);
        // No need to show potential error message, since Ticket with actual DoiRequest is created anyway
      }
      // TODO: Adding DOI can take some extra time, so wait 10 sec before refetching
      setTimeout(() => {
        if (openRequestDoiModal) {
          toggleRequestDoiModal();
        }
        dispatch(setNotification({ message: t('feedback.success.doi_request_sent'), variant: 'success' }));
        refetchRegistration();
      }, 10_000);
    }
  };

  return (
    <Accordion elevation={3}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>DOI</AccordionSummary>
      <AccordionDetails>
        {!doiRequest && (
          <>
            <LoadingButton
              variant="outlined"
              endIcon={<LocalOfferIcon />}
              loadingPosition="end"
              loading={isLoading}
              data-testid={
                isPublishedRegistration
                  ? dataTestId.registrationLandingPage.requestDoiButton
                  : dataTestId.registrationLandingPage.reserveDoiButton
              }
              onClick={() => (isPublishedRegistration ? toggleRequestDoiModal() : sendDoiRequest())}>
              {isPublishedRegistration
                ? t('registration.public_page.request_doi')
                : t('registration.public_page.reserve_doi')}
            </LoadingButton>

            <Modal
              open={openRequestDoiModal}
              onClose={toggleRequestDoiModal}
              headingText={t('registration.public_page.request_doi')}
              dataTestId={dataTestId.registrationLandingPage.requestDoiModal}>
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
                  data-testid={dataTestId.registrationLandingPage.sendDoiButton}
                  onClick={sendDoiRequest}
                  loading={isLoading}>
                  {t('common.send')}
                </LoadingButton>
              </DialogActions>
            </Modal>
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
