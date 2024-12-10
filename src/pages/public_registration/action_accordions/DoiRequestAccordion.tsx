import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Collapse,
  DialogActions,
  Divider,
  IconButton,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { addTicketMessage, createDraftDoi, createTicket, updateTicket } from '../../../api/registrationApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ConfirmMessageDialog } from '../../../components/ConfirmMessageDialog';
import { MessageForm } from '../../../components/MessageForm';
import { Modal } from '../../../components/Modal';
import { setNotification } from '../../../redux/notificationSlice';
import { TicketLocationState } from '../../../types/locationState.types';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { Registration, RegistrationStatus } from '../../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getOpenFiles, userHasAccessRight } from '../../../utils/registration-helpers';
import { DoiRequestMessagesColumn } from '../../messages/components/DoiRequestMessagesColumn';
import { TicketMessageList } from '../../messages/components/MessageList';
import { TicketAssignee } from './TicketAssignee';

interface DoiRequestAccordionProps {
  registration: Registration;
  refetchData: () => Promise<void>;
  doiRequestTicket?: Ticket;
  isLoadingData: boolean;
  addMessage: (ticketId: string, message: string) => Promise<unknown>;
}

enum LoadingState {
  None,
  RequestDoi,
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
  isLoadingData,
  addMessage,
}: DoiRequestAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(LoadingState.None);
  const [messageToCurator, setMessageToCurator] = useState('');

  const location = useLocation<TicketLocationState>();

  const [openRequestDoiModal, setOpenRequestDoiModal] = useState(false);
  const toggleRequestDoiModal = () => setOpenRequestDoiModal((open) => !open);

  const [showConfirmDialogAssignDoi, setShowConfirmDialogAssignDoi] = useState(false);
  const toggleConfirmDialogAssignDoi = () => setShowConfirmDialogAssignDoi((open) => !open);

  const [openReserveDoiDialog, setOpenReserveDoiDialog] = useState(false);
  const toggleReserveDoiDialog = () => setOpenReserveDoiDialog((open) => !open);

  const [openRejectDoiDialog, setOpenRejectDoiDialog] = useState(false);
  const toggleRejectDoiDialog = () => setOpenRejectDoiDialog((open) => !open);

  const [showMoreActions, setShowMoreActions] = useState(false);

  const approveTicketMutation = useMutation({
    mutationFn: async () => {
      if (doiRequestTicket) {
        await updateTicket(doiRequestTicket.id, { status: 'Completed' });
      }
    },
    onSuccess: async () => {
      await refetchData();
      dispatch(setNotification({ message: t('feedback.success.doi_request_approved'), variant: 'success' }));
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.approve_doi_request'), variant: 'error' })),
  });

  const rejectDoiMutation = useMutation({
    mutationFn: async (message: string) => {
      if (doiRequestTicket && message) {
        await addTicketMessage(doiRequestTicket.id, message);
        await updateTicket(doiRequestTicket.id, { status: 'Closed' });
      }
    },
    onSuccess: async () => {
      await refetchData();
      dispatch(setNotification({ message: t('feedback.success.doi_request_rejected'), variant: 'success' }));
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
      await refetchData();
      dispatch(setNotification({ message: t('feedback.success.reserve_doi'), variant: 'success' }));
    }
    setIsLoading(LoadingState.None);
  };

  const sendDoiRequest = async () => {
    setIsLoading(LoadingState.RequestDoi);
    const message = isPublishedRegistration ? messageToCurator : '';

    const createDoiRequestResponse = await createTicket(registration.id, 'DoiRequest', message);
    if (isErrorStatus(createDoiRequestResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_doi_request'), variant: 'error' }));
    } else if (isSuccessStatus(createDoiRequestResponse.status)) {
      if (openRequestDoiModal) {
        toggleRequestDoiModal();
      }
      await refetchData();
      dispatch(
        setNotification({
          message: t('feedback.success.doi_request_sent'),
          variant: 'success',
        })
      );
    }
    setIsLoading(LoadingState.None);
  };

  const waitingForRemovalOfDoi = isClosedDoiRequest && !!registration.doi;
  const messages = doiRequestTicket?.messages ?? [];

  const openFilesOnRegistration = getOpenFiles(registration.associatedArtifacts);

  const hasReservedDoi = !doiRequestTicket && registration.doi;
  const status = doiRequestTicket
    ? t(`my_page.messages.ticket_types.${doiRequestTicket.status}`)
    : hasReservedDoi
      ? t('registration.public_page.tasks_panel.reserved')
      : '';

  const requestDoiButton = (
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
  );

  const assignDoiButton = (
    <LoadingButton
      sx={{ bgcolor: 'white' }}
      fullWidth
      size="small"
      variant="outlined"
      data-testid={dataTestId.registrationLandingPage.tasksPanel.createDoiButton}
      endIcon={<CheckIcon />}
      onClick={() => {
        if (openFilesOnRegistration.length > 0) {
          approveTicketMutation.mutate();
        } else {
          toggleConfirmDialogAssignDoi();
        }
      }}
      loading={approveTicketMutation.isPending}
      disabled={isLoadingData}>
      {t('registration.public_page.tasks_panel.assign_doi')}
    </LoadingButton>
  );

  const userCanRequestDoi = userHasAccessRight(registration, 'doi-request-create');
  const userCanAssignDoi = userHasAccessRight(registration, 'doi-request-approve');

  const defaultExpanded = location.state?.selectedTicketType
    ? location.state.selectedTicketType === 'DoiRequest'
    : waitingForRemovalOfDoi || isPendingDoiRequest || isClosedDoiRequest;

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.doiRequestAccordion}
      sx={{ bgcolor: 'doiRequest.light' }}
      elevation={3}
      defaultExpanded={defaultExpanded}>
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
            components={[<Typography sx={{ mb: '1rem' }} key="1" />]}
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
            {isPublishedRegistration && userCanRequestDoi && (
              <>
                <Trans
                  t={t}
                  i18nKey="registration.public_page.tasks_panel.request_doi_description"
                  values={{ buttonText: t('registration.public_page.request_doi') }}
                  components={[
                    <Typography sx={{ mb: '1rem' }} key="1" />,
                    <Typography sx={{ mb: '1rem' }} key="2">
                      {doiLink}
                    </Typography>,
                  ]}
                />

                {requestDoiButton}
              </>
            )}
            {isDraftRegistration && (
              <>
                <Trans
                  t={t}
                  i18nKey="registration.public_page.tasks_panel.draft_doi_description"
                  values={{ buttonText: t('registration.public_page.reserve_doi') }}
                  components={[
                    <Typography sx={{ mb: '1rem' }} key="1" />,
                    <Typography sx={{ mb: '1rem' }} key="2">
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
                    components={[
                      <Typography sx={{ mb: '1rem' }} key="1" />,
                      <Typography sx={{ mb: '1rem' }} key="2" fontWeight={700} />,
                    ]}
                  />
                </ConfirmDialog>
              </>
            )}
          </>
        )}

        <Modal
          open={openRequestDoiModal}
          onClose={toggleRequestDoiModal}
          headingText={t('registration.public_page.request_doi')}
          dataTestId={dataTestId.registrationLandingPage.tasksPanel.requestDoiModal}>
          <Trans
            t={t}
            i18nKey="registration.public_page.request_doi_description"
            components={[<Typography sx={{ mb: '1rem' }} key="1" />]}
          />
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
              {t('registration.public_page.request_doi')}
            </LoadingButton>
          </DialogActions>
        </Modal>

        <ConfirmDialog
          open={showConfirmDialogAssignDoi}
          title={t('registration.public_page.tasks_panel.no_published_files_on_registration')}
          onAccept={async () => {
            await approveTicketMutation.mutateAsync();
            toggleConfirmDialogAssignDoi();
          }}
          isLoading={isLoadingData || approveTicketMutation.isPending}
          onCancel={toggleConfirmDialogAssignDoi}>
          <Trans
            t={t}
            i18nKey="registration.public_page.tasks_panel.no_published_files_on_registration_description"
            components={[<Typography sx={{ mb: '1rem' }} key="1" />]}
          />
        </ConfirmDialog>

        {userCanAssignDoi && isPublishedRegistration && isPendingDoiRequest && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
            <Typography>{t('registration.public_page.tasks_panel.assign_doi_about')}</Typography>

            {assignDoiButton}

            <Button
              sx={{ bgcolor: 'white' }}
              variant="outlined"
              size="small"
              data-testid={dataTestId.registrationLandingPage.rejectDoiButton}
              endIcon={<CloseIcon />}
              onClick={toggleRejectDoiDialog}
              disabled={isLoadingData || approveTicketMutation.isPending}>
              {t('common.reject_doi')}
            </Button>

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
              <Typography sx={{ mb: '1rem' }}>
                {t('registration.public_page.tasks_panel.describe_doi_rejection_reason')}
              </Typography>
            </ConfirmMessageDialog>
          </Box>
        )}

        {(isPendingDoiRequest || isClosedDoiRequest) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem' }}>
            {messages.length > 0 ? (
              <TicketMessageList
                ticket={doiRequestTicket}
                canDeleteMessage={userCanAssignDoi}
                refetchData={refetchData}
              />
            ) : (
              <Typography>{t('registration.public_page.publishing_request_message_about')}</Typography>
            )}
            <MessageForm
              confirmAction={async (message) => await addMessage(doiRequestTicket.id, message)}
              hideRequiredAsterisk
            />
          </Box>
        )}

        {isClosedDoiRequest && (
          <>
            <Divider sx={{ my: '0.5rem', bgcolor: 'primary.main' }} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                data-testid={dataTestId.registrationLandingPage.tasksPanel.showMoreDoiActionsButton}
                size="small"
                color="primary"
                onClick={() => setShowMoreActions((open) => !open)}
                title={showMoreActions ? t('common.show_fewer_options') : t('common.show_more_options')}>
                <MoreHorizIcon />
              </IconButton>
            </Box>
            <Collapse in={showMoreActions}>
              {userCanAssignDoi ? (
                <>
                  <Typography variant="h2" gutterBottom>
                    {t('registration.public_page.tasks_panel.assign_doi')}
                  </Typography>
                  {assignDoiButton}
                </>
              ) : (
                <>
                  <Typography variant="h2" gutterBottom>
                    {t('registration.public_page.request_doi')}
                  </Typography>
                  <Typography sx={{ mb: '1rem' }}>{t('registration.public_page.request_doi_again')}</Typography>
                  {requestDoiButton}
                </>
              )}
            </Collapse>
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
