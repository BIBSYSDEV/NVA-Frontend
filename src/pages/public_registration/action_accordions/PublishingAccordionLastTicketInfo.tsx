import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { UpdateTicketData } from '../../../api/registrationApi';
import { MessageForm } from '../../../components/MessageForm';
import { setNotification } from '../../../redux/notificationSlice';
import { PublishingTicket } from '../../../types/publication_types/ticket.types';
import { RegistrationTab } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getRegistrationWizardLink, UrlPathTemplate } from '../../../utils/urlPaths';
import { TicketMessageList } from '../../messages/components/MessageList';

interface PublishingAccordionLastTicketInfoProps {
  publishingTicket: PublishingTicket;
  canApprovePublishingRequest: boolean;
  registrationHasApprovedFile: boolean;
  refetchData: () => Promise<void>;
  addMessage: (ticketId: string, message: string) => Promise<unknown>;
  registrationIsValid: boolean;
}

export const PublishingAccordionLastTicketInfo = ({
  publishingTicket,
  canApprovePublishingRequest,
  registrationHasApprovedFile,
  registrationIsValid,
  addMessage,
  refetchData,
}: PublishingAccordionLastTicketInfoProps) => {
  const { t } = useTranslation();

  const isCompletedTicket = publishingTicket.status === 'Completed';
  const isClosedTicket = publishingTicket.status === 'Closed';
  const isPendingTicket = publishingTicket.status === 'New' || publishingTicket.status === 'Pending';

  return (
    <>
      {isCompletedTicket && (
        <>
          {canApprovePublishingRequest ? (
            registrationHasApprovedFile ? (
              <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_description_for_curator">
                <Typography paragraph />
              </Trans>
            ) : (
              <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_without_file_description_for_curator">
                <Typography paragraph />
              </Trans>
            )
          ) : registrationHasApprovedFile ? (
            <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_description_for_registrator">
              <Typography paragraph />
            </Trans>
          ) : (
            <Trans i18nKey="registration.public_page.tasks_panel.approved_publishing_request_without_file_description_for_registrator">
              <Typography paragraph />
            </Trans>
          )}
        </>
      )}

      {isClosedTicket && (
        <>
          {canApprovePublishingRequest ? (
            <Trans i18nKey="registration.public_page.tasks_panel.has_rejected_files_publishing_request">
              <Typography paragraph />
            </Trans>
          ) : (
            <>
              <Trans i18nKey="registration.public_page.tasks_panel.has_rejected_files_publishing_request_registrator">
                <Typography paragraph />
              </Trans>
              <Button
                sx={{ bgcolor: 'white' }}
                variant="outlined"
                fullWidth
                data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestEditButton}
                endIcon={<EditIcon />}
                component={RouterLink}
                to={getRegistrationWizardLink(publishingTicket.publicationIdentifier, {
                  tab: RegistrationTab.FilesAndLicenses,
                })}>
                {t('registration.edit_registration')}
              </Button>
            </>
          )}
        </>
      )}

      {isPendingTicket && (
        <>
          {canApprovePublishingRequest ? (
            <PendingPublishingTicketForCuratorSection
              publishingTicket={publishingTicket}
              addMessage={addMessage}
              refetchData={refetchData}
              registrationIsValid={registrationIsValid}
            />
          ) : registrationHasApprovedFile ? (
            <Trans i18nKey="registration.public_page.tasks_panel.pending_publishing_request_with_file_description_for_registrator">
              <Typography paragraph />
            </Trans>
          ) : (
            <Trans i18nKey="registration.public_page.tasks_panel.pending_publishing_request_without_file_description_for_registrator">
              <Typography paragraph />
            </Trans>
          )}
        </>
      )}

      <Divider sx={{ my: '1rem' }} />
      <Typography fontWeight="bold" gutterBottom>
        {t('common.messages')}
      </Typography>
      <Typography gutterBottom>
        {window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue)
          ? t('registration.public_page.publishing_request_message_about_curator')
          : t('registration.public_page.publishing_request_message_about')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <MessageForm
          confirmAction={async (message) => await addMessage(publishingTicket.id, message)}
          hideRequiredAsterisk
        />
        {publishingTicket.messages.length > 0 && <TicketMessageList ticket={publishingTicket} />}
      </Box>
    </>
  );
};

const PendingPublishingTicketForCuratorSection = ({
  publishingTicket,
  addMessage,
  refetchData,
  registrationIsValid,
}: Pick<
  PublishingAccordionLastTicketInfoProps,
  'publishingTicket' | 'addMessage' | 'refetchData' | 'registrationIsValid'
>) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isLoadingData = false;
  const [openRejectionDialog, setOpenRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const ticketMutation = useMutation({
    mutationFn: async (newTicketData: UpdateTicketData) => {
      if (newTicketData.status === 'Closed') {
        if (!rejectionReason) {
          throw new Error('Rejection reason is required');
        }
        await addMessage(
          publishingTicket.id,
          `${t('registration.public_page.reason_for_rejection')}: ${rejectionReason}`
        );
      }
      const updateTicketResponse = new Promise((resolve) => setTimeout(resolve, 5_000));
      // updateTicket(publishingTicket.id, newTicketData);
      await refetchData();

      return updateTicketResponse;
    },
    onSuccess: (_, variables) => {
      if (variables.status === 'Completed') {
        dispatch(setNotification({ message: t('feedback.success.published_registration'), variant: 'success' }));
      } else if (variables.status === 'Closed') {
        setOpenRejectionDialog(false);
        dispatch(setNotification({ message: t('feedback.success.publishing_request_rejected'), variant: 'success' }));
      }
    },
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.update_publishing_request'), variant: 'error' })),
  });

  return (
    <Box sx={{ mt: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Trans
        i18nKey="registration.public_page.tasks_panel.approve_publishing_request_description"
        components={[<Typography key="1" />]}
      />
      <LoadingButton
        sx={{ bgcolor: 'white', mb: '0.5rem' }}
        variant="outlined"
        data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAcceptButton}
        startIcon={<InsertDriveFileIcon />}
        onClick={() => ticketMutation.mutate({ status: 'Completed' })}
        loading={ticketMutation.isPending && ticketMutation.variables?.status === 'Completed'}
        disabled={isLoadingData || ticketMutation.isPending || !registrationIsValid}>
        {t('registration.public_page.approve_publish_request')} ({publishingTicket.filesForApproval.length})
      </LoadingButton>

      <Trans
        i18nKey="registration.public_page.tasks_panel.reject_publishing_request_description"
        values={{ count: publishingTicket.filesForApproval.length }}
        components={[<Typography key="1" />]}
      />
      <LoadingButton
        sx={{ bgcolor: 'white', mb: '0.5rem' }}
        variant="outlined"
        data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestRejectButton}
        startIcon={<CloseIcon />}
        onClick={() => setOpenRejectionDialog(true)}
        disabled={isLoadingData || ticketMutation.isPending}>
        {t('registration.public_page.reject_publish_request')} ({publishingTicket.filesForApproval.length})
      </LoadingButton>

      <Typography>{t('registration.public_page.tasks_panel.edit_publishing_request_description')}</Typography>
      <Button
        sx={{ bgcolor: 'white', mb: '0.5rem' }}
        variant="outlined"
        fullWidth
        data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestEditButton}
        endIcon={<EditIcon />}
        component={RouterLink}
        to={getRegistrationWizardLink(publishingTicket.publicationIdentifier, {
          tab: RegistrationTab.FilesAndLicenses,
        })}>
        {t('registration.edit_registration')}
      </Button>

      <Dialog open={openRejectionDialog} onClose={() => setOpenRejectionDialog(false)}>
        <DialogTitle fontWeight="bold">{t('registration.public_page.reject_publish_request')}</DialogTitle>
        <DialogContent>
          <Trans
            i18nKey="registration.public_page.reject_publish_request_description"
            components={[<Typography paragraph key="1" />]}
          />
          <TextField
            data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestRejectionMessageTextField}
            inputProps={{ maxLength: 160 }}
            variant="filled"
            multiline
            minRows={3}
            fullWidth
            required
            label={t('registration.public_page.reason_for_rejection')}
            FormHelperTextProps={{ sx: { textAlign: 'end' } }}
            helperText={`${rejectionReason.length}/160`}
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            data-testid={dataTestId.registrationLandingPage.tasksPanel.cancelRejectionButton}
            onClick={() => setOpenRejectionDialog(false)}>
            {t('common.cancel')}
          </Button>
          <LoadingButton
            data-testid={dataTestId.registrationLandingPage.tasksPanel.rejectionDialogConfirmButton}
            disabled={!rejectionReason}
            loading={ticketMutation.isPending && ticketMutation.variables?.status === 'Closed'}
            variant="contained"
            onClick={() => ticketMutation.mutate({ status: 'Closed' })}>
            {t('common.reject')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
