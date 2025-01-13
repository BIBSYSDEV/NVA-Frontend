import LaunchIcon from '@mui/icons-material/Launch';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';

interface NviCandidateRejectionDialogProps {
  open: boolean;
  onCancel: () => void;
  onAccept: (reason: string) => Promise<unknown>;
  isLoading: boolean;
}

const maxReasonLength = 160;
const minReasonLength = 10;

export const NviCandidateRejectionDialog = ({
  open,
  onCancel,
  onAccept,
  isLoading,
}: NviCandidateRejectionDialogProps) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  const handleClose = () => {
    onCancel();
    setReason('');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('tasks.nvi.reject_nvi_candidate')}</DialogTitle>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await onAccept(reason.trim());
          setReason('');
        }}>
        <DialogContent>
          <Trans
            i18nKey="tasks.nvi.reject_nvi_candidate_modal_text"
            components={{
              p: <Typography sx={{ mb: '1rem' }} />,
              hyperlink: (
                <Link
                  href="https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/hjelpeside-nva/NVI-rapporteringsinstruks"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              launchIcon: <LaunchIcon fontSize="small" sx={{ ml: '0.2rem', verticalAlign: 'bottom' }} />,
            }}
          />

          <TextField
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            data-testid={dataTestId.tasksPage.nvi.rejectionModalTextField}
            variant="filled"
            multiline
            minRows={3}
            fullWidth
            required
            label={t('tasks.nvi.reject_nvi_candidate_form_label')}
            helperText={`${reason.length}/${maxReasonLength}`}
            slotProps={{
              htmlInput: { minLength: minReasonLength, maxLength: maxReasonLength },
              formHelperText: { sx: { textAlign: 'end' } },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button data-testid={dataTestId.tasksPage.nvi.rejectionModalCancelButton} onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <LoadingButton
            data-testid={dataTestId.tasksPage.nvi.rejectionModalRejectButton}
            loading={isLoading}
            variant="contained"
            type="submit">
            {t('common.reject')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
