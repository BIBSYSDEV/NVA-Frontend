import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router';
import { updateTicket, UpdateTicketData } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { PreviousPathLocationState } from '../../../types/locationState.types';
import { PublishingTicket } from '../../../types/publication_types/ticket.types';
import { RegistrationTab } from '../../../types/registration.types';
import { MAX_MESSAGE_LENGTH } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getRegistrationWizardPath } from '../../../utils/urlPaths';

interface PendingPublishingTicketForCuratorSectionProps {
  publishingTicket: PublishingTicket;
  addMessage: (ticketId: string, message: string) => Promise<unknown>;
  refetchData: () => Promise<void>;
  registrationIsValid: boolean;
}

export const PendingPublishingTicketForCuratorSection = ({
  publishingTicket,
  addMessage,
  refetchData,
  registrationIsValid,
}: PendingPublishingTicketForCuratorSectionProps) => {
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
      const updateTicketResponse = await updateTicket(publishingTicket.id, newTicketData);
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
      <Button
        sx={{ bgcolor: 'secondary.main', mb: '0.5rem' }}
        variant="contained"
        data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAcceptButton}
        startIcon={<InsertDriveFileIcon />}
        loadingPosition="start"
        onClick={() => ticketMutation.mutate({ status: 'Completed' })}
        loading={ticketMutation.isPending && ticketMutation.variables?.status === 'Completed'}
        disabled={isLoadingData || ticketMutation.isPending || !registrationIsValid}>
        {t('registration.public_page.approve_publish_request')} ({publishingTicket.filesForApproval.length})
      </Button>

      <Trans
        i18nKey="registration.public_page.tasks_panel.reject_publishing_request_description"
        values={{ count: publishingTicket.filesForApproval.length }}
        components={[<Typography key="1" />]}
      />
      <Button
        sx={{ bgcolor: 'error.main', mb: '0.5rem' }}
        variant="contained"
        data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestRejectButton}
        startIcon={<CloseIcon />}
        loadingPosition="start"
        onClick={() => setOpenRejectionDialog(true)}
        disabled={isLoadingData || ticketMutation.isPending}>
        {t('registration.public_page.reject_publish_request')} ({publishingTicket.filesForApproval.length})
      </Button>

      <Typography>{t('registration.public_page.tasks_panel.edit_publishing_request_description')}</Typography>
      <Button
        sx={{ bgcolor: 'secondary.light', color: 'primary.main', mb: '0.5rem' }}
        variant="contained"
        fullWidth
        data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestEditButton}
        endIcon={<EditIcon />}
        component={RouterLink}
        state={{ previousPath: window.location.pathname } satisfies PreviousPathLocationState}
        to={getRegistrationWizardPath(publishingTicket.publicationIdentifier, {
          tab: RegistrationTab.FilesAndLicenses,
        })}>
        {t('registration.edit_registration')}
      </Button>

      <Dialog open={openRejectionDialog} onClose={() => setOpenRejectionDialog(false)}>
        <DialogTitle fontWeight="bold">{t('registration.public_page.reject_publish_request')}</DialogTitle>
        <DialogContent>
          <Trans
            i18nKey="registration.public_page.reject_publish_request_description"
            components={[<Typography sx={{ mb: '1rem' }} key="1" />]}
          />
          <TextField
            data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestRejectionMessageTextField}
            variant="filled"
            multiline
            minRows={3}
            fullWidth
            required
            label={t('registration.public_page.reason_for_rejection')}
            helperText={`${rejectionReason.length}/${MAX_MESSAGE_LENGTH}`}
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            slotProps={{
              htmlInput: { maxLength: MAX_MESSAGE_LENGTH },
              formHelperText: { sx: { textAlign: 'end' } },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            data-testid={dataTestId.registrationLandingPage.tasksPanel.cancelRejectionButton}
            onClick={() => setOpenRejectionDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            data-testid={dataTestId.registrationLandingPage.tasksPanel.rejectionDialogConfirmButton}
            disabled={!rejectionReason}
            loading={ticketMutation.isPending && ticketMutation.variables?.status === 'Closed'}
            variant="contained"
            onClick={() => ticketMutation.mutate({ status: 'Closed' })}>
            {t('common.reject')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
