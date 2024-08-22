import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
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
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  addTicketMessage,
  createDraftDoi,
  createTicket,
  updateTicket,
  UpdateTicketData,
} from '../../../api/registrationApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ConfirmMessageDialog } from '../../../components/ConfirmMessageDialog';
import { MessageForm } from '../../../components/MessageForm';
import { Modal } from '../../../components/Modal';
import { setNotification } from '../../../redux/notificationSlice';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { Registration, RegistrationStatus } from '../../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getAssociatedFiles } from '../../../utils/registration-helpers';
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

const doiLink = (
  <MuiLink
    href="https://sikt.no/tjenester/doi"
    target="_blank"
    rel="noopener noreferrer"
    sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
    <LaunchIcon fontSize="small" />
  </MuiLink>
);

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

  const [showConfirmDialogAssignDoi, setShowConfirmDialogAssignDoi] = useState(false);
  const toggleConfirmDialogAssignDoi = () => setShowConfirmDialogAssignDoi((open) => !open);

  const [openReserveDoiDialog, setOpenReserveDoiDialog] = useState(false);
  const toggleReserveDoiDialog = () => setOpenReserveDoiDialog((open) => !open);

  const [openRejectDoiDialog, setOpenRejectDoiDialog] = useState(false);
  const toggleRejectDoiDialog = () => setOpenRejectDoiDialog((open) => !open);

  const ticketMutation = useMutation({
    mutationFn: doiRequestTicket
      ? (newTicketData: UpdateTicketData) => {
          if (newTicketData.status === 'Completed') {
            setIsLoading(LoadingState.ApproveDoi);
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

  const rejectDoiMutation = useMutation({
    mutationFn: async (message: string) => {
      if (doiRequestTicket && message) {
        const sendMessageSuccess = await addMessage(doiRequestTicket.id, message);
        if (sendMessageSuccess) {
          await updateTicket(doiRequestTicket.id, { status: 'Closed' });
        }
      }
    },
    onSuccess: () => {
      dispatch(setNotification({ message: t('feedback.success.doi_request_rejected'), variant: 'success' }));
      refetchData();
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.reject_doi_request'), variant: 'error' })),
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

  const publishedFilesOnRegistration = getAssociatedFiles(registration.associatedArtifacts).filter(
    (file) => file.type === 'PublishedFile'
  );

  const hasReservedDoi = !doiRequestTicket && registration.doi;
  const status = doiRequestTicket
    ? t(`my_page.messages.ticket_types.${doiRequestTicket.status}`)
    : hasReservedDoi
      ? t('registration.public_page.tasks_panel.reserved')
      : '';

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.doiRequestAccordion}
      sx={{ bgcolor: 'doiRequest.light' }}
      elevation={3}
      defaultExpanded={waitingForRemovalOfDoi || isPendingDoiRequest || isClosedDoiRequest}>
      <AccordionSummary sx={{ fontWeight: 700 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
        {t('common.doi')}
        {status && ` - ${status}`}
      </AccordionSummary>
      <AccordionDetails>
        {doiRequestTicket && <TicketAssignee ticket={doiRequestTicket} refetchTickets={refetchData} />}

        {doiRequestTicket && <DoiRequestMessagesColumn ticket={doiRequestTicket} />}

        {hasReservedDoi && (
          <Trans
            t={t}
            i18nKey="registration.public_page.tasks_panel.has_reserved_doi"
            components={[<Typography paragraph key="1" />]}
          />
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
              <>
                <Trans
                  t={t}
                  i18nKey="registration.public_page.tasks_panel.request_doi_description"
                  values={{ buttonText: t('registration.public_page.request_doi') }}
                  components={[
                    <Typography paragraph key="1" />,
                    <Typography paragraph key="2">
                      {doiLink}
                    </Typography>,
                  ]}
                />

                <Button
                  data-testid={dataTestId.registrationLandingPage.tasksPanel.requestDoiButton}
                  sx={{ bgcolor: 'white' }}
                  size="small"
                  fullWidth
                  variant="outlined"
                  endIcon={<LocalOfferIcon />}
                  disabled={isLoading !== LoadingState.None}
                  onClick={toggleRequestDoiModal}>
                  {t('registration.public_page.request_doi')}
                </Button>
              </>
            )}
            {isDraftRegistration && (
              <>
                <Trans
                  t={t}
                  i18nKey="registration.public_page.tasks_panel.draft_doi_description"
                  values={{ buttonText: t('registration.public_page.reserve_doi') }}
                  components={[
                    <Typography paragraph key="1" />,
                    <Typography paragraph key="2">
                      {doiLink}
                    </Typography>,
                  ]}
                />

                <Button
                  data-testid={dataTestId.registrationLandingPage.tasksPanel.reserveDoiButton}
                  sx={{ bgcolor: 'white' }}
                  size="small"
                  fullWidth
                  variant="outlined"
                  endIcon={<LocalOfferIcon />}
                  disabled={isLoading !== LoadingState.None}
                  onClick={toggleReserveDoiDialog}>
                  {t('registration.public_page.reserve_doi')}
                </Button>

                <ConfirmDialog
                  open={openReserveDoiDialog}
                  title={t('registration.public_page.reserve_doi')}
                  onAccept={addDraftDoi}
                  onCancel={toggleReserveDoiDialog}>
                  <Trans
                    t={t}
                    i18nKey="registration.public_page.tasks_panel.reserve_doi_confirmation"
                    components={[<Typography paragraph key="1" />, <Typography paragraph key="2" fontWeight={700} />]}
                  />
                </ConfirmDialog>
              </>
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
            <Button
              sx={{ bgcolor: 'white' }}
              variant="outlined"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.createDoiButton}
              endIcon={<CheckIcon />}
              onClick={() => {
                if (publishedFilesOnRegistration.length > 0) {
                  ticketMutation.mutate({ status: 'Completed' });
                } else {
                  toggleConfirmDialogAssignDoi();
                }
              }}
              disabled={isLoadingData || isLoading !== LoadingState.None}>
              {t('registration.public_page.tasks_panel.assign_doi')}
            </Button>
            <Button
              sx={{ bgcolor: 'white' }}
              variant="outlined"
              data-testid={dataTestId.registrationLandingPage.rejectDoiButton}
              endIcon={<CloseIcon />}
              onClick={toggleRejectDoiDialog}
              disabled={isLoadingData || isLoading !== LoadingState.None}>
              {t('common.reject_doi')}
            </Button>

            <ConfirmDialog
              open={showConfirmDialogAssignDoi}
              title={t('registration.public_page.tasks_panel.no_published_files_on_registration')}
              onAccept={async () => {
                await ticketMutation.mutateAsync({ status: 'Completed' });
                toggleConfirmDialogAssignDoi();
              }}
              isLoading={isLoadingData || ticketMutation.isPending}
              onCancel={toggleConfirmDialogAssignDoi}>
              <Trans
                t={t}
                i18nKey="registration.public_page.tasks_panel.no_published_files_on_registration_description"
                components={[<Typography paragraph key="1" />]}
              />
            </ConfirmDialog>

            <ConfirmMessageDialog
              open={openRejectDoiDialog}
              title={t('common.reject_doi')}
              onAccept={async (message: string) => {
                await rejectDoiMutation.mutateAsync(message);
                toggleRejectDoiDialog();
              }}
              onCancel={toggleRejectDoiDialog}
              textFieldLabel={t('common.message')}
              confirmButtonLabel={t('common.reject_doi')}>
              <Typography paragraph>
                {t('registration.public_page.tasks_panel.describe_doi_rejection_reason')}
              </Typography>
            </ConfirmMessageDialog>
          </Box>
        )}

        {(isPendingDoiRequest || isClosedDoiRequest) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem' }}>
            {messages.length > 0 ? (
              <TicketMessageList ticket={doiRequestTicket} canDeleteMessage={userIsCurator} refetchData={refetchData} />
            ) : (
              <Typography>{t('registration.public_page.publishing_request_message_about')}</Typography>
            )}
            <MessageForm
              confirmAction={async (message) => await addMessage(doiRequestTicket.id, message)}
              hideRequiredAsterisk
            />
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
