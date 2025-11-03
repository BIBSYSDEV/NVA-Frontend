import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Accordion,
  AccordionDetails,
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { addTicketMessage, createDraftDoi, createTicket, updateTicket } from '../../../api/registrationApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ConfirmMessageDialog } from '../../../components/ConfirmMessageDialog';
import { MessageForm } from '../../../components/MessageForm';
import { Modal } from '../../../components/Modal';
import { StatusChip, TicketStatusChip } from '../../../components/StatusChip';
import { setNotification } from '../../../redux/notificationSlice';
import { SelectedTicketTypeLocationState } from '../../../types/locationState.types';
import { Ticket, TicketTypeEnum } from '../../../types/publication_types/ticket.types';
import { Registration, RegistrationStatus } from '../../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getOpenFiles, userHasAccessRight } from '../../../utils/registration-helpers';
import { invalidateQueryKeyDueToReindexing } from '../../../utils/searchHelpers';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { DoiRequestMessagesColumn } from '../../messages/components/DoiRequestMessagesColumn';
import { TicketMessageList } from '../../messages/components/MessageList';
import { TicketAssignee } from './TicketAssignee';
import { getTicketColor } from '../../messages/utils';
import { TicketTypeTag } from '../../messages/components/TicketTypeTag';
import { TaskAccordionSummary } from './styles';

interface DoiRequestAccordionProps {
  registration: Registration;
  refetchData: () => Promise<void>;
  doiRequestTicket?: Ticket;
  isLoadingData: boolean;
  addMessage: (ticketId: string, message: string) => Promise<unknown>;
  hasReservedDoi: boolean;
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
    <OpenInNewIcon fontSize="small" />
  </MuiLink>
);

export const DoiRequestAccordion = ({
  registration,
  doiRequestTicket,
  refetchData,
  isLoadingData,
  addMessage,
  hasReservedDoi,
}: DoiRequestAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(LoadingState.None);
  const [messageToCurator, setMessageToCurator] = useState('');

  const location = useLocation();
  const locationState = location.state as SelectedTicketTypeLocationState | undefined;

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
      invalidateQueryKeyDueToReindexing(queryClient, 'taskNotifications');
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

  const requestDoiButton = (
    <Button
      data-testid={dataTestId.registrationLandingPage.tasksPanel.requestDoiButton}
      size="small"
      fullWidth
      color="tertiary"
      variant="contained"
      startIcon={<LocalOfferIcon />}
      disabled={isLoading !== LoadingState.None}
      onClick={toggleRequestDoiModal}>
      {t('registration.public_page.request_doi')}
    </Button>
  );

  const assignDoiButton = (
    <Button
      sx={{ bgcolor: 'secondary.main' }}
      fullWidth
      size="small"
      variant="contained"
      data-testid={dataTestId.registrationLandingPage.tasksPanel.createDoiButton}
      startIcon={<CheckIcon />}
      loadingPosition="end"
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
    </Button>
  );

  const userCanRequestDoi = userHasAccessRight(registration, 'doi-request-create');
  const userCanAssignDoi = userHasAccessRight(registration, 'doi-request-approve');

  const defaultExpanded = locationState?.selectedTicketType
    ? locationState.selectedTicketType === 'DoiRequest'
    : waitingForRemovalOfDoi || isPendingDoiRequest || isClosedDoiRequest;

  const [openAccordion, setOpenAccordion] = useState(defaultExpanded);

  const initialDoiRequest = useRef(doiRequestTicket);
  useEffect(() => {
    // Open accordion if a new DOI request is created, e.g. when publishing a result with a draft DOI
    if (!initialDoiRequest.current && doiRequestTicket) {
      setOpenAccordion(true);
    }
  }, [doiRequestTicket]);

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.doiRequestAccordion}
      sx={{
        bgcolor: 'background.paper',
        '& .MuiAccordionSummary-content': {
          alignItems: 'center',
          gap: '0.5rem',
        },
      }}
      elevation={3}
      expanded={openAccordion}
      onChange={() => setOpenAccordion((open) => !open)}>
      <TaskAccordionSummary
        sx={{ borderLeftColor: getTicketColor(TicketTypeEnum.DoiRequest) }}
        expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <TicketTypeTag type={TicketTypeEnum.DoiRequest} showText={false} />
        <Typography fontWeight="bold" sx={{ flexGrow: '1' }}>
          {t('common.doi')}
        </Typography>
        {doiRequestTicket ? (
          <TicketStatusChip ticket={doiRequestTicket} />
        ) : hasReservedDoi ? (
          <StatusChip text={t('registration.public_page.tasks_panel.reserved')} icon="hourglass" />
        ) : null}
      </TaskAccordionSummary>
      <AccordionDetails>
        {doiRequestTicket && <TicketAssignee ticket={doiRequestTicket} refetchTickets={refetchData} />}

        {doiRequestTicket && <DoiRequestMessagesColumn ticket={doiRequestTicket} />}

        {hasReservedDoi && (
          <Trans
            i18nKey="registration.public_page.tasks_panel.has_reserved_doi"
            components={[<Typography sx={{ mb: '1rem' }} key="1" />]}
          />
        )}

        {waitingForRemovalOfDoi && (
          <>
            <Typography gutterBottom>{t('registration.public_page.tasks_panel.waiting_for_rejected_doi')}</Typography>
            <Button
              variant="outlined"
              onClick={refetchData}
              loading={isLoadingData}
              startIcon={<RefreshIcon />}
              loadingPosition="start"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.refreshDoiRequestButton}>
              {t('registration.public_page.tasks_panel.reload')}
            </Button>
          </>
        )}

        {!doiRequestTicket && !registration.doi && (
          <>
            {isPublishedRegistration && userCanRequestDoi && (
              <>
                <Trans
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
                  size="small"
                  fullWidth
                  variant="contained"
                  color="tertiary"
                  startIcon={<LocalOfferIcon />}
                  disabled={isLoading !== LoadingState.None}
                  onClick={toggleReserveDoiDialog}>
                  {t('registration.public_page.reserve_doi')}
                </Button>

                <ConfirmDialog
                  open={openReserveDoiDialog}
                  title={t('registration.public_page.reserve_doi')}
                  isLoading={isLoading === LoadingState.DraftDoi}
                  onAccept={addDraftDoi}
                  onCancel={toggleReserveDoiDialog}>
                  <Trans
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
            <Button onClick={toggleRequestDoiModal} disabled={isLoadingData || isLoading !== LoadingState.None}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="contained"
              data-testid={dataTestId.registrationLandingPage.tasksPanel.sendDoiButton}
              onClick={sendDoiRequest}
              loading={isLoadingData || isLoading !== LoadingState.None}>
              {t('registration.public_page.request_doi')}
            </Button>
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
            i18nKey="registration.public_page.tasks_panel.no_published_files_on_registration_description"
            components={[<Typography sx={{ mb: '1rem' }} key="1" />]}
          />
        </ConfirmDialog>

        {userCanAssignDoi && isPublishedRegistration && isPendingDoiRequest && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
            <Typography>{t('registration.public_page.tasks_panel.assign_doi_about')}</Typography>

            {assignDoiButton}

            <Button
              color="tertiary"
              variant="contained"
              size="small"
              data-testid={dataTestId.registrationLandingPage.rejectDoiButton}
              startIcon={<CloseIcon />}
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
                invalidateQueryKeyDueToReindexing(queryClient, 'taskNotifications');
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
          <>
            <Divider sx={{ my: '1rem' }} />
            <Typography fontWeight="bold" gutterBottom>
              {t('common.messages')}
            </Typography>

            {window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue) ? (
              <Typography gutterBottom>
                {t('registration.public_page.publishing_request_message_about_curator')}
              </Typography>
            ) : (
              <Trans
                i18nKey="registration.public_page.publishing_request_message_about"
                components={{ p: <Typography gutterBottom /> }}
              />
            )}

            <MessageForm
              confirmAction={async (message) => await addMessage(doiRequestTicket.id, message)}
              hideRequiredAsterisk
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '0.5rem' }}>
              {messages.length > 0 && <TicketMessageList ticket={doiRequestTicket} />}
            </Box>
          </>
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
